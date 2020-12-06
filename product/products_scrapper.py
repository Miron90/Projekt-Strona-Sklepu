from django.db import connection
import time
import requests
from bs4 import BeautifulSoup
import random
import shutil
from product.productsService import ProductService, CategoryService, SubcategoryService
from product.models import Products, Category, SubCategory
from django.core.files.base import ContentFile
from django.core.files.uploadedfile import InMemoryUploadedFile
import urllib.request
import base64
import requests
from io import BytesIO
from django.db.models import Q
from PIL import Image


def getAllSubcategoriesForCategory(link):
    r = requests.get(link)
    soup = BeautifulSoup(r.text, "lxml")
    body = soup.body
    categories = body.find('div', {'id': 'category'})
    allAnchors = categories.findAll('a', {'class': 's-facet-tree__link'})
    allLinks = []
    allSubcategories = []
    for x in allAnchors:
        allLinks.append("https://www.lidl-sklep.pl" + x['href'])
        allSubcategories.append(x.find("span").text)
    for x in allSubcategories:
        allSubcategories.pop(0)
        break
    for x in allLinks:
        allLinks.pop(0)
        break
    return (allLinks, allSubcategories)


def addAllCatAndSubcat(cat, subcat):
    # 0 moda 1 kuchnia 2 dom 3 sport 4 zdrowie 5 ogrod
    i = 0
    for x in cat:
        j = 0
        
        datacat = {'admin': 'yes', 'name': x}
        CategoryService().addNewCategory(datacat)
        for y in subcat[i]:
            data = {'admin': 'yes', 'name': y, 'categoryId': x}
            SubcategoryService().addNewSubcategory(data)
        i = i + 1
        
    
def findDescAndImage(link):
    r = requests.get(link)
    soup = BeautifulSoup(r.text, "lxml")
    body = soup.body
    imgAnchor = body.find('img', {'class': 'gallery-image__img'})
    descDivs = body.find('div', {'class': 'space p-tb'})
    li = descDivs.findAll('li')
    imgsrc = imgAnchor['src']
    desc = ''
    for x in li:
        desc = desc + ' ' + str(x.text.strip())
    # print(imgsrc)
    # print(desc)
    return imgsrc, desc


def goToAllSubcategoriesAndGetAll(links, cat, subcat):
    allProducts = []
    i = 0
    for catLink in links:
        j = 0
        products = []
        for subcatLink in catLink:
            r = requests.get(subcatLink)
            soup = BeautifulSoup(r.text, "lxml")
            body = soup.body
            allProducts = body.findAll('a', {'class': 'product-grid-box'})
            howManyProducts = random.randint(10, 24)
            # print('xdd ' + str(howManyProducts))
            if howManyProducts > len(allProducts):
                howManyProducts = len(allProducts)
            products = []
            x=0
            for tempProduct in allProducts:
                if howManyProducts > 0:
                    product = []
                    productName = tempProduct.find("h2", {'class': 'product-grid-box__title'})
                    div = tempProduct.find('div', {'class': 'product-grid-box__text'})
                    price = tempProduct.find('div', {'class': 'm-price__price m-price__price--small'})
                    href = "https://www.lidl-sklep.pl" + tempProduct['href']
                    divs = div.findAll('div')
                    shortdesc = ''
                    for div in divs:
                        shortdesc = shortdesc + ' ' + div.text.strip()
                    imgsrc, desc = findDescAndImage(href)
                    quantity = random.randint(5, 100)
                    priceText = price.text.strip()
                    priceToList = list(priceText)
                    for l in range(len(priceToList)):
                        if priceToList[l] == ',':
                            priceToList[l] = '.'
                            break
                    priceToFloat = "".join(priceToList)
                    r = requests.get(url=imgsrc, stream=True)
                    x = x + 1
                    path = 'D:\\ProjektStronaSklepu\\' + str(x) + '.jpeg'
                    category = CategoryService().get_category_by_id(cat[i])
                    subcategory = SubcategoryService().get_subcategory_by_id(subcat[i][j])
                    print(subcategory)
                    print(category)
                    print(productName.text.strip())
                    print(desc)
                    print(shortdesc)

                    if not Products.objects.filter(Q(productName=productName.text.strip())).count() > 0:
                        p = Products.objects.create(productName=productName.text.strip(), description=desc, shortDescription=shortdesc, price=priceToFloat, quantity=quantity, category=category, subcategory=subcategory, image_url=imgsrc)
                        p.save()
                    # Products.objects.create('productName': productName.text, 'description': desc, 'image_url': imgsrc, 'shortDescription': shortdesc, 'price': float(priceToFloat), 'quantity': quantity, 'category': cat[i], 'subcategory': subcat[i][j])
                else:
                    break
                howManyProducts = howManyProducts - 1
                # print(productName.text.strip())
                # print(price.text.strip())
            # print(howManyProducts)
            j = j + 1
        i = i + 1


def scrapper():
    r = requests.get("https://www.lidl-sklep.pl/")
    soup = BeautifulSoup(r.text, "lxml")
    body = soup.body
    ol = body.find('ol', {'class': 'n-header__main-navigation n-header__main-navigation--sub'})
    allAnchors = ol.findAll('a', {'class': 'n-header__main-navigation-link n-header__main-navigation-link--sub'})
    allCategories = ol.findAll('span', {'class': 'n-header__main-navigation-link-text'})
    allLinksList = []
    for x in allAnchors:
        allLinksList.append('https://www.lidl-sklep.pl' + x['href'])
    allLinksList.remove('https://www.lidl-sklep.pl' + '/h/warsztat-i-auto/h10000994')
    allLinksList.remove('https://www.lidl-sklep.pl' + '/h/dziecko/h10000995')
    allCategoriesList = []
    for x in allCategories:
        allCategoriesList.append(x.text)
    allCategoriesList.remove('Warsztat i auto')
    allCategoriesList.remove('Dziecko')
    slug = []
    for x in allLinksList:
        slug.append(getAllSubcategoriesForCategory(x))
    allSubcategoriesList = []
    allSubcategoriesLinks = []
    for x in slug:
        allSubcategoriesList.append(x[1])
        allSubcategoriesLinks.append(x[0])
    # print(allCategoriesList)
    # print(allLinksList)
    # print(allSubcategories)
    addAllCatAndSubcat(allCategoriesList, allSubcategoriesList)
    goToAllSubcategoriesAndGetAll(allSubcategoriesLinks, allCategoriesList, allSubcategoriesList)
    # print(allSubcategoriesLinks)

    connection.close()