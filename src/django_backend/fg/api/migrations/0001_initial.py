# -*- coding: utf-8 -*-
# Generated by Django 1.10 on 2017-03-29 20:36
from __future__ import unicode_literals

from django.db import migrations, models
import django.db.models.deletion
import fg.api.helpers


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Album',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=5, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('category', models.CharField(db_index=True, max_length=80, unique=True)),
            ],
            options={
                'verbose_name_plural': 'categories',
            },
        ),
        migrations.CreateModel(
            name='Media',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('medium', models.CharField(db_index=True, max_length=80, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Photo',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('prod', models.ImageField(upload_to=fg.api.helpers.path_and_rename)),
                ('date_taken', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('album', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Album')),
                ('category', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Category')),
                ('media', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Media')),
            ],
        ),
        migrations.CreateModel(
            name='Place',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('place', models.CharField(db_index=True, max_length=80, unique=True)),
            ],
        ),
        migrations.CreateModel(
            name='Tag',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=50, unique=True)),
                ('description', models.CharField(max_length=256)),
            ],
        ),
        migrations.AddField(
            model_name='photo',
            name='place',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Place'),
        ),
        migrations.AddField(
            model_name='photo',
            name='tag',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.Tag'),
        ),
    ]
