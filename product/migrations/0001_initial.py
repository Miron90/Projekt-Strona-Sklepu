# Generated by Django 3.1.5 on 2021-01-12 21:35

from django.db import migrations, models
import django.db.models.deletion
import product.models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Category',
            fields=[
                ('name', models.CharField(max_length=120, primary_key=True, serialize=False, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='SubCategory',
            fields=[
                ('name', models.CharField(max_length=120, primary_key=True, serialize=False)),
                ('categoryId', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.category')),
            ],
        ),
        migrations.CreateModel(
            name='Products',
            fields=[
                ('productName', models.CharField(max_length=120, primary_key=True, serialize=False)),
                ('description', models.CharField(max_length=10000)),
                ('image', models.ImageField(blank=True, null=True, upload_to=product.models.upload_small_path)),
                ('shortDescription', models.CharField(max_length=4000)),
                ('price', models.DecimalField(decimal_places=2, max_digits=10)),
                ('quantity', models.IntegerField()),
                ('image_url', models.URLField(blank=True, null=True)),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.category')),
                ('subcategory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='product.subcategory')),
            ],
        ),
    ]
