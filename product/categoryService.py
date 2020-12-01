from product.models import Category
from product.serializers import CategorySerializer
from django.db.models import Q
from rest_framework.authtoken.models import Token


class CategoryService:
    def getAllCategoriesOrderByName(self):
        return Category.objects.all().order_by('name').values()

    def addNewCategory(self, data):
        token = data['token']
        user = Token.objects.get(key=token).user
        if user:
            if user.has_perm():
                data = {'name': data['category']}
                serializer = CategorySerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    return {'result': 'success'}
                else:
                    return {'error': 'Taka nazwa kategorii już istnieje'}
            else:
                return {'error': 'Nie masz uprawnień do wykonania tej czynności'}
        else:
            return {'error': 'Nie masz uprawnień do wykonania tej czynności'}
    
    def get_category_by_id(self, id):
        return Category.objects.filter(Q(name=id)).get()
