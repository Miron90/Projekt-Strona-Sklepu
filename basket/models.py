from django.db import models
from account.models import Account
from product.models import Products

# Create your models here.


class Baskets(models.Model):
    userId = models.ForeignKey(Account, on_delete=models.CASCADE)
    fullPrice = models.DecimalField(decimal_places=2, max_digits=10)
    ordered = models.BooleanField(default=False)
    bought = models.BooleanField(default=False)
    canceled = models.BooleanField(default=False)
    finished = models.BooleanField(default=False)


class Basket(models.Model):
    basketId = models.ForeignKey(Baskets, on_delete=models.CASCADE)
    productId = models.ForeignKey(Products, on_delete=models.CASCADE)
    quantity = models.IntegerField()
    price = models.DecimalField(decimal_places=2, max_digits=10)
