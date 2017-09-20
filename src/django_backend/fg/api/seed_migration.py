# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import random, glob, string
from fg import settings
from django.db import migrations
from django.core.files import File
from django.core.files.temp import NamedTemporaryFile
from PIL import Image


def get_rand_string(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))


def seed_foreign_keys(apps):
    apps_models_dict = {
        "api": ["Album", "Tag", "Category", "Media", "Place"],
        "fg_auth": []
    }

    for app_name, models in apps_models_dict.items():
        for model_name in models:
            Mod = apps.get_model(app_name, model_name)
            for i in range(3):
                obj = Mod(name=get_rand_string(4))
                obj.save()


def get_random_object(apps, app_name, model_string):
    Mod = apps.get_model(app_name, model_string)
    random_index = random.randint(0, Mod.objects.count() - 1)
    return Mod.objects.all()[random_index]


def load_photos(apps, schema_editor):
    seed_foreign_keys(apps)
    Photo = apps.get_model("api", "Photo")
    image_paths = []
    for image_path in glob.glob(settings.PHOTO_ROOT + '*.jpg', recursive=True):
        image_paths.append(image_path)

    if not image_paths:
        raise ImportError(
            "Could not find any photos in PHOTO_ROOT: " + settings.PHOTO_ROOT + ". Add images to development_images directory")

    for i, image_path in enumerate(image_paths):
        photo_test = Photo(
            motive=get_rand_string(size=20),
            album=get_random_object(apps, "api", "Album"),
            place=get_random_object(apps, "api", "Place"),
            media=get_random_object(apps, "api", "Media"),
            category=get_random_object(apps, "api", "Category"),
            splash=True if random.random() > 0.5 else False,
            page=i,
            image_number=i,
            security_level=get_random_object(apps, "api", "SecurityLevel")
        )
        photo_test.save()
        photo_test.tags.add(get_random_object(apps, "api", "Tag"))
        with open(image_path, 'rb') as f:
            photo_test.photo.save(image_path, File(f))
            print("Success")


class Migration(migrations.Migration):
    dependencies = [
        ('api', '0001_initial'),
        ('fg_auth', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_photos)
    ]
