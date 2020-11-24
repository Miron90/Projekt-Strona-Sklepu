from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.authtoken.models import Token
from account.models import Account
from API.serializers import RegistrationSerializer, ProductSerializer
from django.db.models import Q
from django import forms
from rest_framework.decorators import api_view
from product.models import Category, SubCategory, Products
import datetime
from pytesseract import pytesseract
from PIL import Image
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt
import os,io
from google.cloud import vision
from google.cloud.vision import types
import pandas


class UserSignUpListView(APIView):
    def post(self, request, *args, **kwargs):
        if request.method == 'POST':
            serializer = RegistrationSerializer(data=request.data)
            data = {}
            if serializer.is_valid():
                account = serializer.save()
                data['key'] = Token.objects.get(user=account).key
                return Response(data, HTTP_200_OK)
            else:
                data = serializer.errors
                print(data)
                if 'username' in data and 'email' in data:
                    if 'exists' in data.get('username')[0]:
                        data['error'] = "Ta nazwa użytkownika jest już zajęta"
                    if 'exists' in data.get('email')[0]:
                        data['error'] = data['error'] + ' \nTen adres email jest już zajęty'
                elif 'username' in data:
                    if 'exists' in data.get('username')[0]:
                        data['error'] = "Ta nazwa użytkownika jest już zajęta"
                else:
                    if 'exists' in data.get('email')[0]:
                        data['error'] = 'Ten adres email jest już zajęty'
                return Response(data, HTTP_200_OK)
        return Response(data, HTTP_400_BAD_REQUEST)


class UserLoginListView(APIView):
    def post(self, request):
        data = request.data
        email = data.get('email')
        password = data.get('password')
        result = {}
        data['password'] = ''
        if not email:
            result['error'] = 'Email jest wymagane'
            return Response(data, HTTP_200_OK)
        account = Account.manager.filter(Q(email=email)).distinct()
        if account.exists() and account.count() == 1:
            account = account.first()
        else:
            result['error'] = 'Email jest błędny'
        if account:
            if not account.check_password(password):
                data['error'] = 'Podano błędne hasło'
        if 'error' not in data:
            token, created = Token.objects.get_or_create(user=account)
            if not created:
                token.delete()
                token = Token.objects.create(user=account)
                token.created = datetime.datetime.utcnow()
                token.save()
            result['key'] = token.key
            print(account.has_perm())
            if account.has_perm():
                result['perm'] = True
            print(result)
            return Response(result, HTTP_200_OK)
        else:
            return Response(result, HTTP_200_OK)


@api_view(["GET"])
def get_all_categories(request):
    if request.method == 'GET':
        data = Category.objects.all().order_by('name').values()
        data.first()
        return Response(data, HTTP_200_OK)
    return Response(data, HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_sub_categories(request, slug):
    if request.method == 'GET':
        data = SubCategory.objects.filter(Q(categoryId=slug)).order_by('name').values()
        data.first()
        return Response(data, HTTP_200_OK)
    return Response(data, HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def add_product(request):
    if request.method == 'PUT':

        """ img = cv.imread('D:\django-react-boilerplate-master\API\IMG_20201123_221205.jpg',0)
        img = cv.medianBlur(img,5)
        th3 = cv.adaptiveThreshold(img,1200,cv.ADAPTIVE_THRESH_GAUSSIAN_C,\
            cv.THRESH_BINARY,11,2)
        pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        print(pytesseract.image_to_string(img, lang="pol")) """

        

        data = {}
        """ token = request.data['token']
        user = Token.objects.get(key=token).user
        if user:
            if user.has_perm(): """
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            data['result'] = 'success'
        else:
            data['result'] = 'error'
            if 'image' in serializer.errors:
                data['error'] = ": nie prawidłowy plik najpewniej nie jest to zdjęcie"
            if 'productName' in serializer.errors:
                if 'error' in data:
                    data['error'] = data['error'] + " " + "oraz produkt o takiej nazwie już istnieje"
                else:
                    data['error'] = ": produkt o takiej nazwie już istnieje"
            print(serializer.errors)
        """ else:
            data['error'] = "error" """
        return Response(data, HTTP_200_OK)
    return Response(data, HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_products(request, page, slug):
    if request.method == 'GET':
        results = {}
        minimum = 0
        maximum = 0
        if page == '1':
            minimum = 0
            maximum = int(slug)
        else:
            minimum = (int(page) - 1) * int(slug)
            maximum = int(page) * int(slug) 
        data = Products.objects.all()[minimum:maximum].values()
        results['query'] = data
        results['allProducts'] = Products.objects.count()
        return Response(results, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def delete_product(request):
    if request.method == 'POST':
        data = {}
        token = request.data['token']
        user = Token.objects.get(key=token).user
        if user:
            if user.has_perm():
                Products.objects.filter(Q(productName=request.data['productName'])).delete()
                data['result'] = 'Produkt został usunięty'
        else:
            data['result'] = 'Błąd autoryzacji'
        return Response(data, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_product(request, productName):
    if request.method == 'GET':
        productName = 'Roxie Carbon'
        results = {}
        results = Products.objects.filter(Q(productName=productName)).values()
        return Response(results, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def edit_product(request):
    if request.method == 'PUT':
        results = {}
        token = request.data['token']
        user = Token.objects.get(key=token).user
        if user:
            if user.has_perm():
                productName = request.data['productName']
                description = request.data['description']
                shortDescription = request.data['shortDescription']
                price = request.data['price']
                quantity = request.data['quantity']
                image = request.data['image']
                category = request.data['category']
                subcategory = request.data['subcategory']
                originalName = request.data['originalName']
                if image:
                    print('yes')
                    cat = Category.objects.filter(Q(name=category)).get()
                    subcat = SubCategory.objects.filter(Q(name=subcategory)).get()
                    b = Products(productName=productName, description=description, shortDescription=shortDescription, price=price, quantity=quantity, category=cat, subcategory=subcat, image=image)
                    b.save()
                    results['result'] = 'success'
                else:
                    print('no')
                    cat = Category.objects.filter(Q(name=category)).get()
                    subcat = SubCategory.objects.filter(Q(name=subcategory)).get()
                    image = Products.objects.filter(productName=originalName).values('image').get()['image']
                    b = Products(productName=productName, description=description, shortDescription=shortDescription, price=price, quantity=quantity, category=cat, subcategory=subcat, image=image)
                    b.save()
                    results['result'] = 'success'
        else:
            results['result'] = 'error'
        return Response(results, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def search_products(request, search, page, slug):
    if request.method == 'GET':
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
        return Response(results, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)