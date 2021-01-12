from account.serializers import RegistrationSerializer
from rest_framework.authtoken.models import Token
from account.models import Account
from django.db.models import Q
import datetime
from account.serializers import UpdateProfile


class AccountService:
    def add_user(self, data):
        serializer = RegistrationSerializer(data=data)
        results = {}
        if serializer.is_valid():
            account = serializer.save()
            results['key'] = Token.objects.get(user=account).key
            return results
        else:
            results = serializer.errors
            if 'error' not in results:
                if 'username' in results and 'email' in results:
                    if 'exists' in results.get('username')[0]:
                        results['error'] = "Ta nazwa użytkownika jest już zajęta"
                    if 'exists' in results.get('email')[0]:
                        results['error'] = results['error'] + ' \nTen adres email jest już zajęty'
                elif 'username' in results:
                    if 'exists' in results.get('username')[0]:
                        results['error'] = "Ta nazwa użytkownika jest już zajęta"
                else:
                    if 'exists' in results.get('email')[0]:
                        results['error'] = 'Ten adres email jest już zajęty'
                return results
            else:
                return results
    
    def update_user(self, request):
        user = Token.objects.get(key=request.data['token']).user
        print(user)
        print('tutaj')
        serializer = UpdateProfile(user, data=request.data)
        if serializer.is_valid():
            account = serializer.save(user)
            print('zapisane')
            # results['key'] = Token.objects.get(user=account).key
        else:
            print(serializer.errors)
        print('dziala')
                
    def authUser(self, data):
        email = data.get('email')
        password = data.get('password')
        result = {}
        data['password'] = ''
        if not email:
            result['error'] = 'Email jest wymagany'
        account = Account.manager.filter(Q(email=email)).distinct()
        if account.exists() and account.count() == 1:
            account = account.first()
        else:
            result['error'] = 'Email jest błędny'
            return result
        if account:
            if not account.check_password(password):
                result['error'] = 'Podano błędne hasło'
                return result
        if 'error' not in data:
            token, created = Token.objects.get_or_create(user=account)
            if not created:
                token.delete()
                token = Token.objects.create(user=account)
                token.created = datetime.datetime.utcnow()
                token.save()
            result['key'] = token.key
            if account.has_perm():
                result['perm'] = True
            return result
        else:
            return result