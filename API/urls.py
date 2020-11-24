from django.urls import path

from API.views import UserSignUpListView, UserLoginListView, AddProductListView, get_all_categories, GetSubCategoriesListView

urlpatterns = [
    path('login/', UserLoginListView.as_view(), name='check-user'),
    path('register/', UserSignUpListView.as_view(), name='add-user'),
    re_path(r'^.*', TemplateView.as_view(template_name='index.html')),
    path('addproduct/', AddProductListView.as_view(), name='add-user'),
    path('getallcategories/', GetAllCategoriesListView.as_view(), name='add-user'),
    path('getsubcategories/', GetSubCategoriesListView.as_view(), name='add-user'),
]
