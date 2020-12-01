from validate_email import validate_email
import re
from rest_framework import serializers
from account.models import Account


class RegistrationSerializer(serializers.ModelSerializer):

    password1 = serializers.CharField(style={'input_type': 'password'}, write_only=True)
    password2 = serializers.CharField(style={'input_type': 'password'}, write_only=True)

    class Meta:
        model = Account
        fields = ['email', 'username', 'password1', 'password2']

    def save(self):
        email = self.validated_data['email'],
        username = self.validated_data['username']
        account = Account(
            email=email[0],
            username=self.validated_data['username']
        )
        password1 = self.validated_data['password1']
        password2 = self.validated_data['password2']
        account.set_password(password1)
        account.save()
        return account

    def validate(self, value):
        print(value)
        usernamePattern = '^[a-zA-Z0-9]+$'
        passwordPattern = '^[a-z1-9A-Z.*+\-?^${}()|[\]\\@#$%^&*(!@]+$'
        if not validate_email(value['email']):
            raise serializers.ValidationError({'error': "Email jest nieprawidłowy"})
        if not(re.match(usernamePattern, value['username'])) or len(value['username']) < 8 or value['username'][0] != value['username'][0].upper():
            raise serializers.ValidationError({'error': "Nazwa użytkownika musi zawierać co najmniej 8 liter bądź cyfr i pierwsza litera musi być wielka"})
        if len(value['password1']) < 8 or len(value['password2']) < 8 or not(re.match(passwordPattern, value['password1'])) or not(re.match(passwordPattern, value['password2'])):
            raise serializers.ValidationError({'error': "Hasło musi zawierać conajmniej 8 liter bądź cyfr"})
        if value['password1'] != value['password2']:
            raise serializers.ValidationError({'error': "Hasła muszą być jendakowe"})
        return value
