# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import random
from fg.api import models, helpers
from django.db import migrations

def seed_foreign_keys(apps):
    alb = models.Album(name=helpers.get_rand_string(4))
    alb.save()
    model_name_list = ["Tag", "Category", "Media", "Place"]
    for model_name in model_name_list:
        Mod = apps.get_model("api", model_name)
        obj = Mod(name=helpers.get_rand_string(4))
        obj.save()


def get_random_object(apps, model_string):
    Mod = apps.get_model("api", model_string)
    random_index = random.randint(0, Mod.objects.count() - 1)
    return Mod.objects.all()[random_index]

def load_photos(apps, schema_editor):
    seed_foreign_keys(apps)
    Photo = apps.get_model("api", "Photo")
    photo_test = Photo(
        id=0,
        album=get_random_object(apps, "Album"),
        tag=get_random_object(apps, "Tag"),
        place=get_random_object(apps, "Place"),
        media=get_random_object(apps, "Media"),
        category=get_random_object(apps, "Category")
    )
    photo_test.save()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_photos)
    ]
