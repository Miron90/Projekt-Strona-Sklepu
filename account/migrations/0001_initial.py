# Generated by Django 2.2.10 on 2020-11-19 14:33

from django.db import migrations, models
import django.db.models.manager


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Account',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('email', models.EmailField(max_length=50, unique=True)),
                ('username', models.CharField(max_length=50, unique=True)),
                ('data_joined', models.DateTimeField(auto_now_add=True)),
                ('last_login', models.DateTimeField(auto_now=True)),
                ('is_admin', models.BooleanField(default=False)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('is_superuser', models.BooleanField(default=False)),
                ('firstName', models.CharField(max_length=50)),
                ('surName', models.CharField(max_length=50)),
                ('country', models.CharField(max_length=50)),
                ('zipCode', models.CharField(max_length=10)),
                ('street', models.CharField(max_length=100)),
                ('NIP', models.CharField(max_length=50)),
                ('avatarImagePath', models.CharField(max_length=200)),
            ],
            options={
                'abstract': False,
            },
            managers=[
                ('manager', django.db.models.manager.Manager()),
            ],
        ),
    ]
