# Generated by Django 2.2.10 on 2020-11-21 22:02

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('product', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='products',
            old_name='categoryId',
            new_name='category',
        ),
        migrations.RenameField(
            model_name='products',
            old_name='subCategoryId',
            new_name='subcategory',
        ),
    ]
