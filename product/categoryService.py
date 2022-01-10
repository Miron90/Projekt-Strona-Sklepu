from product.models import Category
from product.serializers import CategorySerializer
from django.db.models import Q
from rest_framework.authtoken.models import Token

"""Klasa CategoryService, której zadaniem jest oddzielenie działania bazy danych od operacji
Metody:
getAllCategoriesOrderByName(self): funkcja odpowiedzialna za komunikacje z bazą danych otrzymanie wszystkich kategorii produktów oraz posortowanie ich po nazwie i zwrócenie posortowanej tablicy

addNewCategory(self, data): funkcja odpowiedzialna za dodanie rekordu do bazy danych zmienna data zawiera obiekt kategorii który zostanie dodany do bazy 
funkcja zwraca informacje o wyniki wykonania operacji

getCategoryById(self,id): funkcja odpowiedzialna za pobranie odpowiedniej kategorii zgodnej z numerem id przekazywanej do funkcji
Funkcja zwraca odpowiednią kategorie
"""
class CategoryService:
    def getAllCategoriesOrderByName(self):
        return Category.objects.all().order_by('name').values()

    def addNewCategory(self, data):
        if 'admin' in data:
            serializer = CategorySerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                return
            else:
                serializer.errors
                return 
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
