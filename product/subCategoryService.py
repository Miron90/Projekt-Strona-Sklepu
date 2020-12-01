from product.models import Category, SubCategory, Products
from product.serializers import SubcategorySerializer
from django.db.models import Q
from rest_framework.authtoken.models import Token


class SubcategoryService:
    def getAllSubcategoriesOrderByNameFilteredBySlug(self, slug):
        return SubCategory.objects.filter(Q(categoryId=slug)).order_by('name').values()

    def addNewSubcategory(self, data):
        token = data['token']
        user = Token.objects.get(key=token).user
        if user:
            if user.has_perm():
                results = {}
                data = {'name': data['subCategory'], 'categoryId': data['category']}
                serializer = SubcategorySerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    results['result'] = 'success'
                    return results
                else:
                    results['error'] = 'Taka nazwa podkategorii już istnieje'
                    return results
            else:
                return {'error': 'Nie masz uprawnień do wykonania tej czynności'}
        else:
            return {'error': 'Nie masz uprawnień do wykonania tej czynności'}

    def get_subcategory_by_id(self, id):
        return SubCategory.objects.filter(Q(name=id)).get()
