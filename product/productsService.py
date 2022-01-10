from product.serializers import ProductSerializer
from product.models import Products, Category, SubCategory
from django.db.models import Q
from product.categoryService import CategoryService
from product.subCategoryService import SubcategoryService
from rest_framework.authtoken.models import Token

"""Klasa ProductSevice, której zadaniem jest oddzielenie działania bazy danych od operacji
Metody:
add_product(self, data): funkcja odpowiedzialna za komunikacje z bazą danych oraz dodanie danego rekordu do bazy danych
zmienne: 
data: zmienna zawierające dane o dodawanym produkcie w formacie JSON
Zwraca:
Ciąg znaków informujący o efekcie zapytania

get_products_per_page_products(self, data, page, howManyPerPage): funkcja odpowiedzialna za komunikacje z bazą danych w celu otrzymania listy produktów dla zadanej strony
Zmienne:
data: Zawiera informacje o produktach otzrymanych z zapytania
page: liczba wskazująca dla której strony pobierane są produkty
howManyPerPage: liczba wskazująca ile produktów należy pobrać dla danej strony

Zwraca:
Listę produktów dla danej strony

delete_product(self, data): funkcja odpowiedzialna za usuwanie produktu z bazy danych
Zmienne:
data: zmienna zawirająca informacje o usuwanym rekordzie (produkcie)

Zwraca:
Ciąg znaków informujący o efekcie zapytania

get_product_by_name(self, data): funkcja odpowiedzialna za pobieranie produktu z bazy danych
Zmienne:
data: zmienna zawierająca informacje o rekordzie (produkcie), który chcemy uzyskać

Zwraca:
Produkt w formacie JSON

edit_product(self, data):funkcja odpowiedzialna za edytowanie produktu w bazy danych
Zmienne:
data: zmienna zawierająca informacje o edytowanym rekordzie (produkcie)

Zwraca:
Ciąg znaków informujący o efekcie zapytania

search_product(self, search, page, slug):funkcja odpowiedzialna za poszukiwaniu produktów w bazie danych
Zmienne:
search: zmienna zawierająca informacje o frazie jaką zawierać musi nazwa produktu
page: liczba reprezentująca aktualna stronę użytownika
slug: liczba reprezentujące masymalna ilość stron przy zadanych założeniach

Zwraca:
listę Produktów spełniających zapytanie

delete(self, request):funkcja odpowiedzialna za usuwanie zadanej ilości produktów z bazy danych 
Zmienne:
request: liczba informująca ile produktów usunąć z magazynu sklepu

Zwraca:
Ciąg znaków informujący o efekcie zapytania
"""
class ProductService:
    def add_product(self, data):
        results = {}
        user = ''
        admin = ''
        if 'admin' in data:
            admin = data['admin']
            serializer = ProductSerializer(data=data)
            if serializer.is_valid():
                serializer.save()
                results['result'] = 'success'
            else:
                print(serializer.errors)
            return
        token = data['token']
        user = Token.objects.get(key=token).user
        if user or 'yes' in admin:
            if user.has_perm() or 'yes' in admin:
                serializer = ProductSerializer(data=data)
                if serializer.is_valid():
                    serializer.save()
                    results['result'] = 'success'
                else:
                    results['result'] = 'error'
                    if 'image' in serializer.errors:
                        results['error'] = ": nie prawidłowy plik najpewniej nie jest to zdjęcie"
                    if 'productName' in serializer.errors:
                        if 'error' in results:
                            results['error'] = results['error'] + " " + "oraz produkt o takiej nazwie już istnieje"
                        else:
                            results['error'] = ": produkt o takiej nazwie już istnieje"
            else:
                results['error'] = "Nie masz uprawnień bądź zostałeś wylogowany"
        else:
            results['error'] = "Nie masz uprawnień bądź zostałeś wylogowany"
        return results

    def get_products_per_page_products(self, data, page, howManyPerPage):
        results = {}
        minimum = 0
        maximum = 0
        if page == '1':
            minimum = 0
            maximum = int(howManyPerPage)
        else:
            minimum = (int(page) - 1) * int(howManyPerPage)
            maximum = int(page) * int(howManyPerPage)
        data = Products.objects.all()[minimum:maximum].values()
        results['query'] = data
        results['allProducts'] = Products.objects.count()
        return results

    def delete_product(self, data):
        results = {}
        token = data['token']
        user = Token.objects.get(key=token).user
        if user:
            if user.has_perm():
                Products.objects.filter(Q(productName=data['productName'])).delete()
                results['result'] = 'Produkt został usunięty'
            else:
                results['result'] = 'Błąd autoryzacji'
        else:
            results['result'] = 'Błąd autoryzacji'
        return results

    def get_product_by_name(self, data):
        results = Products.objects.filter(Q(productName=data)).values()
        return results
    
    def edit_product(self, data):
        results = {}
        token = data['token']
        user = Token.objects.get(key=token).user
        if user:
            if user.has_perm():
                productName = data['productName']
                description = data['description']
                shortDescription = data['shortDescription']
                price = data['price']
                quantity = data['quantity']
                image = data['image']
                category = data['category']
                subcategory = data['subcategory']
                originalName = data['originalName']
                if image:
                    cat = CategoryService().get_category_by_id(category)
                    subcat = SubcategoryService().get_subcategory_by_id(subcategory)

                    product = Products.objects.filter(Q(productName=originalName)).first()
                    if product:
                        product.save()
                        b = ProductSerializer(product, data=data)
                        if b.is_valid():
                            results['result'] = 'success'
                            b.save()
                        else:
                            results['error'] = "Błąd pliku najpewniej nie jest to obraz"
                else:
                    cat = CategoryService().get_category_by_id(category)
                    subcat = SubcategoryService().get_subcategory_by_id(subcategory)
                    image = Products.objects.filter(productName=originalName).values('image').get()['image']
                    product = Products.objects.filter(Q(productName=originalName)).first()
                    if product:
                        product.save()
                        b = ProductSerializer(product, data=data)
                        if b.is_valid():
                            results['result'] = 'success'
                            b.save()
                        else:
                            results['error'] = "Błąd pliku najpewniej nie jest to obraz"
        else:
            results['result'] = 'error'
        return results
    
    def search_product(self, search, page, slug):
        results = {}
        minimum = 0
        maximum = 0
        if page == '1':
            minimum = 0
            maximum = int(slug)
        else:
            minimum = (int(page) - 1) * int(slug)
            maximum = int(page) * int(slug)
        results['query'] = data = Products.objects.filter(productName__contains=search)[minimum:maximum].values()
        results['allProducts'] = Products.objects.filter(productName__contains=search).count()
        return results
    
    def delete(self, request):
        print(request['products'])
        for temp in request['products']:
            product = Products.objects.filter(Q(productName=temp['productName'])).first()
            print(product.quantity)
            product.quantity = product.quantity - int(temp['quantity'])
            product.save()
        
        return {"OK"}

