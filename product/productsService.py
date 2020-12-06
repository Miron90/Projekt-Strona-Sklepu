from product.serializers import ProductSerializer
from product.models import Products, Category, SubCategory
from django.db.models import Q
from product.categoryService import CategoryService
from product.subCategoryService import SubcategoryService
from rest_framework.authtoken.models import Token


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
