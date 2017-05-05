# -*- coding: utf-8 -*-
from __future__ import unicode_literals
import os, random, requests, tempfile
from fg.api import models, helpers
from django.db import migrations
from django.core.files import File


def get_random_image():
    x, y = 300, 500
    URL = "https://unsplash.it/" + str(x) + "/" + str(y) + "?random"
    request = requests.get(URL, stream=True)

    # Was the request OK?
    if request.status_code != requests.codes.ok:
        raise FileNotFoundError("Request to URL: "+URL+" failed");

    # Get the filename from the url, used for saving later
    file_name = "temp.jpg"

    # Create a temporary file
    lf = tempfile.NamedTemporaryFile()

    # Read the streamed image in sections
    for block in request.iter_content(1024 * 8):

        # If no more file then stop
        if not block:
            break

        # Write image block to temporary file
        lf.write(block)

    return {'name': file_name, 'file': lf}

def seed_foreign_keys(apps):
    model_name_list = ["Album", "Tag", "Category", "Media", "Place"]
    for model_name in model_name_list:
        Mod = apps.get_model("api", model_name)
        for i in range(10):
            obj = Mod(name=helpers.get_rand_string(4))
            obj.save()


def get_random_object(apps, model_string):
    Mod = apps.get_model("api", model_string)
    random_index = random.randint(0, Mod.objects.count() - 1)
    return Mod.objects.all()[random_index]

def load_photos(apps, schema_editor):
    seed_foreign_keys(apps)

    Photo = apps.get_model("api", "Photo")

    for i in range(100):
        photo_test = Photo(
            album=get_random_object(apps, "Album"),
            tag=get_random_object(apps, "Tag"),
            place=get_random_object(apps, "Place"),
            media=get_random_object(apps, "Media"),
            category=get_random_object(apps, "Category")
        )
        img = get_random_image()
        photo_test.photo.save(os.path.basename(img['name']), File(img['file']))
        photo_test.save()

class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(load_photos)
    ]
