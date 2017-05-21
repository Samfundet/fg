import random
from django.test import TestCase
from fg.api import models, helpers
from fg.settings import VERSATILEIMAGEFIELD_SETTINGS
from django.apps import apps
from django.core.files import File


def get_random_object(model_string):
    Mod = apps.get_model(app_label="api", model_name=model_string)
    random_index = random.randint(0, Mod.objects.count() - 1)
    return Mod.objects.all()[random_index]


def seed_foreign_keys():
    model_name_list = ["Album", "Tag", "Category", "Media", "Place"]
    for model_name in model_name_list:
        Mod = apps.get_model("api", model_name)
        for i in range(10):
            obj = Mod(name=helpers.get_rand_string(4))
            obj.save()


def get_default_image():
    return {'name': 'default.jpg', 'file': open('media/default.jpg', 'rb')}


class PhotoTestCase(TestCase):
    test_photo = None
    sizes = VERSATILEIMAGEFIELD_SETTINGS['sizes']

    def setUp(self):
        seed_foreign_keys()

        self.test_photo = models.Photo(
            album=get_random_object("Album"),
            tag=get_random_object("Tag"),
            place=get_random_object("Place"),
            media=get_random_object("Media"),
            category=get_random_object("Category")
        )

    def test_new_photo_is_saved(self):
        """Tests if new photo is saved to the database"""
        img = get_default_image()
        self.test_photo.photo = File(img['file'])
        self.test_photo.save()

        retrieved_photo = models.Photo.objects.all()[0]
        self.assertEqual(self.test_photo, retrieved_photo)
        self.assertEqual(self.test_photo.photo, retrieved_photo.photo)

    def test_new_photo_saves_file_in_correct_directory(self):
        # TODO
        pass

