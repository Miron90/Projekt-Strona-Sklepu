from product.models import Products, Category, SubCategory
from rest_framework import serializers
from PIL import Image
import urllib.request
from django.core.files.uploadedfile import UploadedFile
import requests


class ProductSerializer(serializers.ModelSerializer):

    image = serializers.ImageField(required=False, allow_null=True)
    image_url = serializers.URLField(required=False, allow_null=True)


    class Meta:
        model = Products
        fields = ['productName', 'description', 'image', 'shortDescription', 'price', 'quantity', 'category', 'subcategory', 'image_url']


    def update(self, instance, data):
        instance.productName = data.get('productName', instance.productName)
        instance.description = data.get('description', instance.description)
        instance.image = data.get('image', instance.image)
        instance.shortDescription = data.get('shortDescription', instance.shortDescription)
        instance.price = data.get('price', instance.price)
        instance.quantity = data.get('quantity', instance.quantity)
        instance.category = data.get('category', instance.category)
        instance.subcategory = data.get('subcategory', instance.subcategory)
        instance.save()
        return instance

    """ def create(self, validated_data):
        response = requests.get(validated_data['image_url'])
        validated_data['image'] = requests.get(validated_data['image_url']).content

        return Products.objects.create(**validated_data) """


class CategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = Category
        fields = ['name']


class SubcategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = SubCategory
        fields = ['name', 'categoryId']
