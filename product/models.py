from django.db import models

# Create your models here.


class Category(models.Model):
    name = models.CharField(max_length=120, primary_key=True, unique=True)

    def __str__(self):
        return self.name


class SubCategory(models.Model):
    name = models.CharField(max_length=120, primary_key=True, unique=True)
    categoryId = models.ForeignKey(Category, on_delete=models.CASCADE)

    def __str__(self):
        return self.name


def upload_path(instance, filename):
    return '/'.join(['products', filename])


class Products(models.Model):
    productName = models.CharField(max_length=120, primary_key=True)
    description = models.CharField(max_length=1000)
    image = models.ImageField(blank=False, null=False, upload_to=upload_path)
    shortDescription = models.CharField(max_length=400)
    price = models.DecimalField(decimal_places=2, max_digits=10)
    quantity = models.IntegerField()
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    subcategory = models.ForeignKey(SubCategory, on_delete=models.CASCADE)

    def __str__(self):
        return self.productName

