from django.db import models
from account.models import Account
from product.models import Products

# Create your models here.


class Basket(models.Model):
    userId = models.CharField(max_length=120)
    productId = models.CharField(max_length=120)
    quantity = models.IntegerField()
    price = models.DecimalField(decimal_places=2, max_digits=10)
