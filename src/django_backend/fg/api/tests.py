import random
from django.test import TestCase
from fg.api import models, helpers
from fg.settings import VERSATILEIMAGEFIELD_SETTINGS
from django.apps import apps
from django.core.files import File


def get_random_object(app_name, model_string):
    Mod = apps.get_model(app_name, model_string)
    random_index = random.randint(0, Mod.objects.count() - 1)
    return Mod.objects.all()[random_index]


def seed_foreign_keys():
    apps_models_dict = {
        "api": ["Album", "Tag", "Category", "Media", "Place"],
        "fg_auth": ["SecurityLevel"]
    }

    for app_name, models in apps_models_dict.items():
        for model_name in models:
            Mod = apps.get_model(app_name, model_name)
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
            album=get_random_object("api", "Album"),
            tag=get_random_object("api", "Tag"),
            place=get_random_object("api", "Place"),
            media=get_random_object("api", "Media"),
            category=get_random_object("api", "Category"),
            page=13,
            image_number=37,
            security_level=get_random_object("fg_auth", "SecurityLevel")
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
