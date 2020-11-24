from django.contrib import admin
from product.models import Products, Category, SubCategory

# Register your models here.

admin.site.register(Products)
admin.site.register(Category)
admin.site.register(SubCategory)
