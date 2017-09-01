import random, os, io
from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate, APITestCase
from rest_framework import status
from .api import models, helpers
from .api.views import PhotoViewSet
from .settings import VERSATILEIMAGEFIELD_SETTINGS, MEDIA_ROOT, PROD_PATH
from django.apps import apps
from django.core.files import File
from django.contrib.auth.models import Group
from .fg_auth.models import User
from PIL import Image
from django.test.client import encode_multipart, BOUNDARY

GROUPS = ["FG", "HUSFOLK", "POWER"]
SECURITY_LEVELS = ["FG", "HUSFOLK", "ALLE"]


def get_random_object(app_name, model_string):
    Mod = apps.get_model(app_name, model_string)
    random_index = random.randint(0, Mod.objects.count() - 1)
    return Mod.objects.all()[random_index]


def seed_foreign_keys():
    apps_models_dict = {
        "api": ["Album", "Tag", "Category", "Media", "Place"],
        "fg_auth": []
    }

    for app_name, models in apps_models_dict.items():
        for model_name in models:
            Mod = apps.get_model(app_name, model_name)
            for i in range(10):
                obj = Mod(name="TEST_" + helpers.get_rand_string(4))
                obj.save()


def seed_groups():
    for g in GROUPS:
        group = Group(name=g)
        group.save()


def seed_security_levels():
    for s in SECURITY_LEVELS:
        security_level = models.SecurityLevel(name=s)
        security_level.save()


def seed_photos():
    photos = []
    for i in range(10):
        photo = models.Photo(
            album=get_random_object("api", "Album"),
            place=get_random_object("api", "Place"),
            media=get_random_object("api", "Media"),
            category=get_random_object("api", "Category"),
            page=13,
            image_number=37,
            security_level=get_random_object("api", "SecurityLevel")
        )
        photo.save()
        photo.tags.add(get_random_object("api", "Tag"))
        img = get_default_image()
        photo.photo = File(img['file'])
        photo.save()
        photos.append(photo)

    return photos


def seed_users():
    for i, u in enumerate(GROUPS):  # Saving a few lines making the group equal to test usernames
        user = User(
            id=i,
            username=u,
            email="test@user.com",
            password="qwert1234"
        )
        group = Group.objects.get(name=u)
        user.save()
        user.groups.add(group)

    admin = User(
        id=100,
        username="ADMIN",
        email="test@user.com",
        password="qwert1234",
        is_superuser=True,
        is_staff=True,
        is_active=True
    )
    admin.save()


def get_default_image():
    return {'name': 'default.jpg', 'file': open(MEDIA_ROOT + 'default.jpg', 'rb')}


def delete_photos(photos):
    """Deletes all the photos from the media folder"""
    for photo in photos:
        photo_object = models.Photo.objects.get(pk=photo.pk)
        photo_object.photo.delete_all_created_images()


class PhotoTestCase(TestCase):
    test_photo = None
    sizes = VERSATILEIMAGEFIELD_SETTINGS['sizes']

    def setUp(self):
        seed_foreign_keys()
        seed_groups()
        seed_security_levels()

        self.test_photo = models.Photo(
            album=get_random_object("api", "Album"),
            place=get_random_object("api", "Place"),
            media=get_random_object("api", "Media"),
            category=get_random_object("api", "Category"),
            page=13,
            image_number=37,
            security_level=get_random_object("api", "SecurityLevel")
        )
        self.test_photo.save()
        self.test_photo.tags.add(get_random_object("api", "Tag"))
        img = get_default_image()
        self.test_photo.photo = File(img['file'])
        self.test_photo.save()

    def tearDown(self):
        delete_photos([self.test_photo])

    def test_new_photo_is_saved(self):
        """Tests if new photo is saved to the database"""
        retrieved_photo = models.Photo.objects.all()[0]
        self.assertEqual(self.test_photo, retrieved_photo)
        self.assertEqual(self.test_photo.photo, retrieved_photo.photo)

    def test_new_photo_saves_file_in_correct_directory(self):
        """Tests if photos are saved to the correct album folder with appropriate filename"""
        retrieved_photo = models.Photo.objects.all()[0]
        expected_path = os.path.join(
            MEDIA_ROOT,
            PROD_PATH,
            retrieved_photo.album.name,
            retrieved_photo.album.name + str(retrieved_photo.page) + str(retrieved_photo.image_number) + '.jpg'
        )
        self.assertEqual(retrieved_photo.photo.path, expected_path)


class UserPermissionTestCase(APITestCase):
    """
    Test that Users in groups FG, POWER, HUSFOLK and anonymous users have correct permissions
    """
    factory = APIRequestFactory()
    photos = None

    def setUp(self):
        seed_foreign_keys()
        seed_groups()
        seed_security_levels()
        self.photos = seed_photos()
        seed_users()

    def tearDown(self):
        delete_photos(self.photos)

    def test_admin_user_can_see_all_photos(self):
        expected_count = models.Photo.objects.count()
        user = User.objects.get(username="ADMIN")
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)

    def test_fg_user_can_see_all_photos(self):
        expected_count = models.Photo.objects.count()
        user = User.objects.get(username="FG")
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)

    def test_husfolk_user_can_only_see_husfolk_and_alle(self):
        expected_count = models.Photo.objects.filter(
            security_level__name__in=("ALLE", "HUSFOLK")
        ).count()
        user = User.objects.get(username="HUSFOLK")
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)

    def test_power_user_can_see_husfolk_and_alle(self):
        expected_count = models.Photo.objects.filter(
            security_level__name__in=("ALLE", "HUSFOLK")
        ).count()
        user = User.objects.get(username="POWER")
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)

    def test_anon_user_can_only_see_alle(self):
        expected_count = models.Photo.objects.filter(
            security_level__name__iexact="ALLE"
        ).count()
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)


class PhotoPostPutDeleteTestCase(APITestCase):
    def setUp(self):
        seed_foreign_keys()
        seed_groups()
        seed_security_levels()
        seed_users()

    def generate_photo_file(self):
        file = io.BytesIO()
        image = Image.new('RGBA', size=(100, 100), color=(155, 0, 0))
        image.name = 'test.jpg'
        image.seek(0)
        return file

    def test_fg_user_can_post_new_photo(self):
        user = User.objects.get(username="FG")
        view = PhotoViewSet.as_view({'post': 'create'})

        photo_file = self.generate_photo_file()

        data = {
            'motive': 'TEST_motive',
            'security_level': 'ALLE',
            'category': 'TEST_category',
            'media': 'TEST_media',
            'album': 'TEST_album',
            'place': 'TEST_place',
            'image_number': 1,
            'page': 1,
            'photo': photo_file
        }

        content = encode_multipart(BOUNDARY, data)

        request = self.client.post(path='/api/photos', data=content)
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
