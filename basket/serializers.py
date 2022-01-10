from rest_framework import serializers
from basket.models import Basket

class BasketSerializer(serializers.ModelSerializer):

    class Meta:
        model = Basket
        fields = ['userId', 'productId', 'quantity', 'price']

    def save(self):
        print(self.data)
        userIdtemp = self.data['userId']
        productIdtemp = self.data['productId']
        quantitytemp = self.data['quantity']
        pricetemp = self.data['price']
        basket = Basket(
            userId=userIdtemp,
            productId=productIdtemp,
            quantity=quantitytemp,
            price=pricetemp,
        )
        basket.save()
        return basket
