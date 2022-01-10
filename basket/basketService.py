from django.db.models import Q
from rest_framework.authtoken.models import Token
from basket.serializers import BasketSerializer 
from basket.models import Basket
from product.models import Products
from django.core import serializers
class BasketService:

    def add_to_cart(self, data):
    #    print(data)
       user = Token.objects.get(key=data['token']).user
       slug = {'userId': user.email, 'productId': data['productName'], 'quantity': data['quantity'], 'price': data['price']}
       basket = Basket.objects.filter(Q(userId = user.email),Q( productId = data['productName'])).first()
       if basket:
            print(basket.quantity)
            basket.quantity = (basket.quantity + int(data['quantity']))
            basket.save()
       else:
            print('nie ma')
            serilizer = BasketSerializer(data=slug)
            serilizer.is_valid()
            serilizer.save()

    def get_basket(self, data):
        user = Token.objects.get(key=data).user
        products = Basket.objects.filter(Q(userId = user.email)).values()
        results = []
        for product in products:
            temp=Products.objects.filter(Q(productName = product['productId'])).first()
            results.append({'quantity': product['quantity'], 'product': {'imagePath': temp.image_url,'productName':temp.productName,'price':temp.price}})
        print(results)
        final = {"result": results}
        return final
    
    def deleteCart(self, token):
        user = Token.objects.get(key=token).user
        Basket.objects.filter(Q(userId = user.email)).delete()
        return {"OK":"OK"}

    def delete_from_basket(self, productName, token):
        user = Token.objects.get(key=token).user
        print(productName)
        Basket.objects.filter(Q(userId = user.email),Q(productId=productName)).delete()
        return {"OK":"OK"}