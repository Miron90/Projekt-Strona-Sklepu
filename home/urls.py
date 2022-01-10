from django.contrib import admin
from django.urls import path, include, re_path
from django.views.generic import TemplateView
from django.conf.urls import include
from API import views
from django.conf.urls.static import static
from django.conf import settings
from threading import Thread
from product.products_scrapper import scrapper
from product.models import Products, SubCategory
from product.subCategoryService import SubcategoryService
from django.db.models import Q

urlpatterns = [
    path('api-auth/', include('rest_framework.urls')),
    path('rest-auth/', include('rest_auth.urls')),
    path('login/', views.UserLoginListView.as_view(), name='check-user'),
    # path('rest-auth/registration/', UserListView.as_view(), name='add-user'),
    path('register/', views.UserSignUpListView.as_view(), name='add-user'),
    path('admin/', admin.site.urls),
    path('deleteproduct/', views.delete_product, name='add-user'),
    path('editproduct/', views.edit_product, name='add-user'),
    path('addproduct/', views.add_product, name='add-user'),

    path('addsubcategory/', views.add_subcategory, name='add-user'),
    path('searchproducts/<search>/<page>/<slug>/', views.search_products, name='add-user'),
    path('getproducts/<page>/<howManyPerPage>/', views.get_products, name='add-user'),
    path('getproduct/<productName>/', views.get_product, name='add-user'),

    path('getsubcategories/<slug>/', views.get_sub_categories, name='add-user'),

    path('addcategory/', views.categories, name='add-user'),
    path('getallcategories/', views.categories, name='add-user'),
    path('updateuser/', views.update_profile, name='add-user'),
    path('payment/', views.payment, name='add-user'),
    path('cart/', views.add_to_cart, name='add-user'),
    path('basket/<token>/', views.get_basket, name='add-user'),
    path('deletefrombasket/', views.delete_from_basket, name='add-user'),
]
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += re_path(r'^.*', TemplateView.as_view(template_name='index.html')),


def start_new_thread(function):
    print("xdd")
    Products.objects.all().delete()
    if not Products.objects.all().count() > 0:
        print("xdd")
        t = Thread(target=function)
        t.daemon = True
        t.start()
    else:
        print("xdd222")
        t = Thread(target=function)
        t.daemon = True
        t.start()


start_new_thread(scrapper)

# include('rest_auth.registration.urls')
