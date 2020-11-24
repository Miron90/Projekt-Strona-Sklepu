from rest_framework import serializers
from account.models import Account
from django.db.models import Q
from product.models import Products
import re


class RegistrationSerializer(serializers.ModelSerializer):

    password1 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = Account
        fields = ['email', 'username', 'password1', 'password2']

    def save(self):
        email = self.validated_data['email'],
        print(email[0])
        username = self.validated_data['username']
        account = Account(
            email=email[0],
            username=self.validated_data['username']
        )
        password1 = self.validated_data['password1']
        password2 = self.validated_data['password2']
        usernamePattern = '^[a-zA-Z0-9]+$'
        emailPattern = '^[a-z0-9]+[\._]?[a-z0-9]+[@]\w+[.]\w{2,3}$'
        passwordPattern = '^[a-z1-9A-Z.*+\-?^${}()|[\]\\@#$%^&*(!@]+$'
        if not(re.match(usernamePattern, username)) or len(username) < 8 or username[0] != username[0].upper():
            raise serializers.ValidationError({'error': "Nazwa użytkownika musi zawierać co najmniej 8 liter bądź cyfr i pierwsza litera musi być wielka"})
        if password1 != password2 or len(password1) < 8 or len(password2) < 8 or not(re.match(passwordPattern, password1)) or not(re.match(passwordPattern, password2)):
            raise serializers.ValidationError({'error': "Hasło musi zawierać conajmniej 8 liter bądź cyfr i muszą być jendakowe"})
        if not(re.match(emailPattern, email[0])):
            raise serializers.ValidationError({'error': "Email jest nieprawidłowy"})
        account.set_password(password1)
        account.save()
        return account


class ProductSerializer(serializers.ModelSerializer):

    class Meta:
        model = Products
        fields = ['productName', 'description', 'image', 'shortDescription', 'price', 'quantity', 'category', 'subcategory']