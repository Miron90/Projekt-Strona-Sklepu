from django.db import models
import requests
import os
from io import BytesIO
from PIL import Image
from django.core.files import File

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=120, primary_key=True, unique=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    name = models.CharField(max_length=120, primary_key=True)
    categoryId = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


def upload_small_path(instance, filename):
    return '/'.join(['smallProducts', filename])


class Products(models.Model):
    productName = models.CharField(max_length=120, primary_key=True)
    description = models.CharField(max_length=10000)
    image = models.ImageField(blank=True, null=True, upload_to=upload_small_path)
    shortDescription = models.CharField(max_length=4000)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)
    image_url = models.URLField(blank=True, null=True)

    def save(self, *args, **kwargs):
        if self.image_url and not self.image:
            result = requests.get(self.image_url).content  # urlretrieve(self.image_url)
            image = Image.open(BytesIO(result))
            path = 'D:\\ProjektStronaSklepu\\file1.jpg'
            image.save(path)
            self.image.save(
                os.path.basename(self.image_url),
                File(open(path, 'rb')),
                save=False)
        super(Products, self).save(*args, **kwargs)

    def __str__(self):
        return self.productName
