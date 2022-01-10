from django.shortcuts import render

# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.status import HTTP_200_OK, HTTP_400_BAD_REQUEST
from rest_framework.authtoken.models import Token
from account.models import Account
from django.db.models import Q
from django import forms
from rest_framework.decorators import api_view
from product.models import Category, SubCategory, Products
from product.categoryService import CategoryService
from product.subCategoryService import SubcategoryService
from product.productsService import ProductService
from account.accountService import AccountService
from basket.basketService import BasketService
import datetime
""" from pytesseract import pytesseract
from PIL import Image
import cv2 as cv
import numpy as np
from matplotlib import pyplot as plt
import os,io
from google.cloud import vision
from google.cloud.vision import types
import pandas """


# Done
class UserSignUpListView(APIView):
    def post(self, request):
        results = {}
        if request.method == 'POST':
            results = AccountService().add_user(request.data)
            return Response(results, HTTP_200_OK)
        return Response(results, HTTP_400_BAD_REQUEST)


# Done
class UserLoginListView(APIView):
    def post(self, request):
        results = {}
        if request.method == 'POST':
            results = AccountService().authUser(request.data)
            return Response(results, HTTP_200_OK)
        return Response(results, HTTP_400_BAD_REQUEST)

# Done
@api_view(["GET", "PUT"])
def categories(request):
    results = {}
    if request.method == 'GET':
        results = CategoryService().getAllCategoriesOrderByName()
        return Response(results, HTTP_200_OK)
    if request.method == 'PUT':
        results = CategoryService().addNewCategory(request.data)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)

# Done
@api_view(["GET"])
def get_sub_categories(request, slug):
    results = {}
    if request.method == 'GET':
        results = SubcategoryService().getAllSubcategoriesOrderByNameFilteredBySlug(slug)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)

# Done
@api_view(["PUT"])
def add_product(request):
    results = {}
    if request.method == 'PUT':
        """ img = cv.imread('D:\django-react-boilerplate-master\API\IMG_20201123_221205.jpg',0)
        img = cv.medianBlur(img,5)
        th3 = cv.adaptiveThreshold(img,1200,cv.ADAPTIVE_THRESH_GAUSSIAN_C,\
            cv.THRESH_BINARY,11,2)
        pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
        print(pytesseract.image_to_string(img, lang="pol")) """
        results = ProductService().add_product(request.data)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)

# Done
@api_view(["GET"])
def get_products(request, page, howManyPerPage):
    results = {}
    if request.method == 'GET':
        results = ProductService().get_products_per_page_products(None, page, howManyPerPage)
        return Response(results, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)

# Done
@api_view(["DELETE"])
def delete_product(request):
    results = {}
    if request.method == 'DELETE':
        results = ProductService().delete_product(request.data)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)

# Done
@api_view(["GET"])
def get_product(request, productName):
    results = {}
    if request.method == 'GET':
        results = ProductService().get_product_by_name(productName)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)

# Done
@api_view(["POST"])
def edit_product(request):
    results = {}
    if request.method == 'POST':
        results = ProductService().edit_product(request.data)
        return Response(results, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)

# Done
@api_view(["GET"])
def search_products(request, search, page, slug):
    results = {}
    if request.method == 'GET':
        results = ProductService().search_product(search, page, slug)
        return Response(results, HTTP_200_OK)
    return Response(slug, HTTP_400_BAD_REQUEST)


@api_view(["PUT"])
def add_subcategory(request):
    results = {}
    if request.method == 'PUT':
        results = SubcategoryService().addNewSubcategory(request.data)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def update_profile(request):
    results = {}
    AccountService().update_user(request)
    # if request.method == 'POST':
    #     results = ProductService().edit_product(request.data)
    #     return Response(results, HTTP_200_OK)
    return Response(results, HTTP_200_OK)

@api_view(["POST"])
def payment(request):
    results = {}
    if request.method == 'POST':
        results = ProductService().delete(request.data)
        BasketService().deleteCart(request.data['token'])
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def get_sub_categories(request, slug):
    results = {}
    if request.method == 'GET':
        results = SubcategoryService().getAllSubcategoriesOrderByNameFilteredBySlug(slug)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)

@api_view(["PUT"])
def add_to_cart(request):
    results = {}
    if request.method == 'PUT':
        results = BasketService().add_to_cart(request.data)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)


@api_view(["GET"])
def get_basket(request, token):
    results = {}
    if request.method == 'GET':
        results = BasketService().get_basket(token)
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def delete_from_basket(request):
    results = {}
    if request.method == 'POST':
        results = BasketService().delete_from_basket(request.data['productName'], request.data['token'])
        return Response(results, HTTP_200_OK)
    return Response(results, HTTP_400_BAD_REQUEST)