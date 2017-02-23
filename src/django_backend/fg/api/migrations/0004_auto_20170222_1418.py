# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-02-22 14:18
from __future__ import unicode_literals

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_auto_20170222_1322'),
    ]

    operations = [
        migrations.AlterField(
            model_name='album',
            name='name',
            field=models.CharField(max_length=5, unique=True),
        ),
        migrations.AlterField(
            model_name='category',
            name='category',
            field=models.CharField(max_length=80, unique=True),
        ),
        migrations.AlterField(
            model_name='media',
            name='medium',
            field=models.CharField(max_length=80, unique=True),
        ),
        migrations.AlterField(
            model_name='place',
            name='place',
            field=models.CharField(max_length=80, unique=True),
        ),
    ]
