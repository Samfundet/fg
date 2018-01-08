import random, os, string, tempfile
from datetime import datetime
from time import sleep
from django.test import TestCase
from django.db.models import Max
from rest_framework.test import APIRequestFactory, force_authenticate, APITestCase
from rest_framework import status
from .api import models
from .api.views import (
    PhotoViewSet, LatestSplashPhotoView, OrderViewSet, AlbumViewSet,
    get_latest_image_number_and_page_number,
)
from .fg_auth.views import FgUsersView, PowerUsersView
from .settings import VERSATILEIMAGEFIELD_SETTINGS, MEDIA_ROOT, SECURITY_LEVELS
from django.apps import apps
from django.core.files import File
from django.contrib.auth.models import Group
from .fg_auth.models import User
from PIL import Image


GROUPS = ["FG", "HUSFOLK", "POWER"]


def get_random_object ( app_name, model_string ):
    Mod = apps.get_model(app_name, model_string)
    random_index = random.randint(0, Mod.objects.count() - 1)
    return Mod.objects.all()[random_index]


def get_rand_string ( size=6, chars=string.ascii_uppercase + string.digits ):
    return ''.join(random.choice(chars) for _ in range(size))


def seed_foreign_keys ():
    apps_models_dict = {
        "api": ["Album", "Tag", "Category", "Media", "Place"],
        "fg_auth": []
    }

    for app_name, models in apps_models_dict.items():
        for model_name in models:
            Mod = apps.get_model(app_name, model_name)
            for i in range(10):
                obj = Mod(name="TEST_" + get_rand_string(4))
                if model_name == 'Album':
                    if i % 2 == 0:
                        obj.name = 'DIG' + str(i*2)
                    else:
                        obj.name = 'ANA' + str(i*2)
                obj.save()


def seed_groups ():
    for g in GROUPS:
        group = Group(name=g)
        group.save()


def seed_security_levels ():
    for s in SECURITY_LEVELS:
        security_level = models.SecurityLevel(name=s)
        security_level.save()


def seed_photos ():
    photos = []
    for i in range(10):
        photo = models.Photo(
            album=get_random_object("api", "Album"),
            place=get_random_object("api", "Place"),
            media=get_random_object("api", "Media"),
            category=get_random_object("api", "Category"),
            page=i*2,
            image_number=i*4,
            security_level=get_random_object("api", "SecurityLevel"),
            on_home_page=True if random.random() > 0.5 else False,
            lapel=True if random.random() > 0.5 else False,
            scanned=True if random.random() > 0.5 else False,
            splash=True if random.random() > 0.5 else False,
            date_taken=datetime.now().astimezone()
        )
        photo.save()
        photo.tags.add(get_random_object("api", "Tag"))
        img = get_default_image()
        photo.photo = File(img['file'])
        photo.save()
        photos.append(photo)

    return photos


def seed_users ():
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


def get_default_image ():
    return {'name': 'default.jpg', 'file': open(MEDIA_ROOT + 'default.jpg', 'rb')}


def delete_photos ( photos ):
    """Deletes all the photos from the media folder"""
    for photo in photos:
        try:
            photo_object = models.Photo.objects.get(pk=photo.pk)
            photo_object.photo.delete_all_created_images()
            photo_object.photo.delete()
        except models.Photo.DoesNotExist:
            print("No photo object with pk: " + str(photo.pk))


class PhotoTestCase(TestCase):
    test_photo = None
    sizes = VERSATILEIMAGEFIELD_SETTINGS['sizes']

    def setUp ( self ):
        seed_foreign_keys()
        seed_groups()
        seed_security_levels()

        self.test_photo = models.Photo(
            album=get_random_object("api", "Album"),
            place=get_random_object("api", "Place"),
            media=get_random_object("api", "Media"),
            category=get_random_object("api", "Category"),
            page=random.randint(1, 99),
            image_number=random.randint(1, 99),
            security_level=get_random_object("api", "SecurityLevel"),
            date_taken=datetime.now().astimezone()
        )
        self.test_photo.save()
        self.test_photo.tags.add(get_random_object("api", "Tag"))
        img = get_default_image()
        self.test_photo.photo = File(img['file'])
        self.test_photo.save()

    def tearDown ( self ):
        delete_photos([self.test_photo])

    def test_new_photo_is_saved ( self ):
        """Tests if new photo is saved to the database"""
        retrieved_photo = models.Photo.objects.all()[0]
        self.assertEqual(self.test_photo, retrieved_photo)
        self.assertEqual(self.test_photo.photo, retrieved_photo.photo)

    def test_new_photo_saves_file_in_correct_directory ( self ):
        # TODO: Needs to be fixed
        """Tests if photos are saved to the correct album folder with appropriate filename"""
        photo = models.Photo.objects.all()[0]
        expected_path = os.path.join(
            MEDIA_ROOT,
            photo.security_level.name.upper(),
            photo.album.name.upper(),
            photo.album.name.upper() + str(photo.page) + str(photo.image_number) + '.jpg'
        )
        self.assertEqual(photo.photo.path, expected_path)

    def test_photo_security_level_changed_moves_file_to_correct_directory ( self ):
        photo = models.Photo.objects.all()[0]
        photo.security_level = models.SecurityLevel.objects.filter(name="FG").first()

        photo.save()

        expected_path = os.path.join(
            MEDIA_ROOT,
            "FG",
            photo.album.name.upper(),
            photo.album.name.upper() + str(photo.page) + str(photo.image_number) + '.jpg'
        )
        self.assertEqual(photo.photo.path.upper(), expected_path.upper())

    def test_exact_motive_search_retrieves_single_image ( self ):
        seed_photos()
        seed_users()
        factory = APIRequestFactory()

        motive = random.choice(models.Photo.objects.all()).motive
        expected_count = models.Photo.objects.filter(motive=motive).count()

        user = User.objects.get(username="FG")
        view = PhotoViewSet.as_view({'get': 'list'})

        request = factory.get('/api/photos?search=' + motive)
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), expected_count)

    def test_only_photos_with_on_home_page_set_to_true_appear_on_home_page ( self ):
        seed_photos()
        factory = APIRequestFactory()
        view = PhotoViewSet.as_view({'get': 'list'})

        expected_count = models.Photo.objects.filter(security_level__name="ALLE").filter(on_home_page=True).count()
        request = factory.get('/api/photos?on_home_page=true')

        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['results']), expected_count)

    def test_page_and_image_number_gets_latest ( self ):
        seed_photos()
        seed_users()
        factory = APIRequestFactory()
        view = get_latest_image_number_and_page_number
        user = User.objects.get(username="FG")

        expected_album = models.Photo.objects.filter(
                album__name__startswith='DIG').latest('date_taken').album
        expected_page = models.Photo.objects.filter(
            album__name=expected_album.name).aggregate(Max('page'))['page__max']
        expected_image_number = (models.Photo.objects.filter(
            album__name=expected_album.name, page=expected_page).aggregate(Max('image_number'))['image_number__max'])
        if expected_image_number >= 99:
            if expected_page < 99:
                expected_image_number = 1
                expected_page = expected_page + 1
            else:
                return expected_album, 'fullt', 'album'
        else:
            expected_image_number = expected_image_number + 1

        request = factory.get('/api/photos/upload-info')
        force_authenticate(request, user=user)

        response = view(request)

        self.assertEqual(response.data['latest_album'], expected_album.id)
        self.assertEqual(response.data['latest_page'], expected_page)
        self.assertEqual(response.data['latest_image_number'], expected_image_number)

        models.Photo.objects.get(id=expected_album.id).delete()
        expected_album = models.Photo.objects.filter(
            album__name__startswith='DIG').latest('date_taken').album
        self.assertEqual(response.data['latest_album'], expected_album.id)

        photo = models.Photo(
            album=get_random_object("api", "Album"),
            place=get_random_object("api", "Place"),
            media=get_random_object("api", "Media"),
            category=get_random_object("api", "Category"),
            page=expected_page,
            image_number=expected_image_number + 1,
            security_level=get_random_object("api", "SecurityLevel"),
            on_home_page=True if random.random() > 0.5 else False,
            lapel=True if random.random() > 0.5 else False,
            scanned=True if random.random() > 0.5 else False,
            splash=True if random.random() > 0.5 else False,
            date_taken=datetime.now().astimezone()
        )
        photo.save()
        expected_image_number = (models.Photo.objects.filter(
            album__name=expected_album.name, page=expected_page).aggregate(Max('image_number'))['image_number__max'])
        self.assertEqual(response.data['latest_album'], expected_image_number)

class UserPermissionTestCase(APITestCase):
    """
    Test that Users in groups FG, POWER, HUSFOLK and anonymous users have correct permissions
    """
    factory = APIRequestFactory()
    photos = None

    def setUp ( self ):
        seed_foreign_keys()
        seed_groups()
        seed_security_levels()
        self.photos = seed_photos()
        seed_users()

    def tearDown ( self ):
        delete_photos(self.photos)

    def test_admin_user_can_see_all_photos ( self ):
        expected_count = models.Photo.objects.count()
        user = User.objects.get(username="ADMIN")
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)

    def test_fg_user_can_see_all_photos ( self ):
        expected_count = models.Photo.objects.count()
        user = User.objects.get(username="FG")
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)

    def test_husfolk_user_can_only_see_husfolk_and_alle ( self ):
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

    def test_power_user_can_see_husfolk_and_alle ( self ):
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

    def test_anon_user_can_only_see_alle ( self ):
        expected_count = models.Photo.objects.filter(
            security_level__name__iexact="ALLE"
        ).count()
        view = PhotoViewSet.as_view({'get': 'list'})

        request = self.factory.get('/api/photos')
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), expected_count)


class PhotoCRUDTestCase(APITestCase):
    photos = None

    def setUp ( self ):
        seed_foreign_keys()
        seed_groups()
        seed_security_levels()
        seed_users()
        self.factory = APIRequestFactory()

    def tearDown ( self ):
        if self.photos:
            delete_photos(self.photos)

    @staticmethod
    def generate_photo_file ():
        image = Image.new('RGBA', size=(50, 50), color=(155, 0, 0))
        file = tempfile.NamedTemporaryFile(suffix='.jpg')
        image.save(file)
        return file

    def test_fg_user_can_post_new_photo ( self ):
        user = User.objects.get(username="FG")
        view = PhotoViewSet.as_view({'post': 'create'})

        photo_file = self.generate_photo_file()

        tags = ['foo', 'bar', 'tourettes']

        with open(photo_file.name, 'rb') as file:
            data = {
                'motive': 'TEST_motive',
                'security_level': 1,
                'category': 1,
                'media': 1,
                'album': 1,
                'place': 1,
                'tags': tags,
                'image_number': 1,
                'page': 1,
                'photo': file,
                'on_home_page': False,
                'scanned': True,
                'splash': True,
                'lapel': True,
                'date_taken': datetime.now().astimezone()
            }

            request = self.factory.post(path='/api/photos', data=data)
            force_authenticate(request, user=user)
            response = view(request)

            self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
            self.assertEqual(models.Photo.objects.count(), 1)

            latest_photo = models.Photo.objects.latest()

            self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
            self.assertEqual(data['motive'], latest_photo.motive, msg=latest_photo.motive)
            self.assertEqual(data['image_number'], latest_photo.image_number, msg=latest_photo.image_number)
            self.assertEqual(data['page'], latest_photo.page, msg=latest_photo.page)
            self.assertEqual(data['security_level'], latest_photo.page, msg=latest_photo.page)
            self.assertEqual(data['album'], latest_photo.album.pk, msg=latest_photo.album)
            self.assertEqual(data['category'], latest_photo.category.pk, msg=latest_photo.category)
            self.assertEqual(data['media'], latest_photo.media.pk, msg=latest_photo.media)
            self.assertEqual(data['place'], latest_photo.place.pk, msg=latest_photo.place)
            self.assertEqual(data['scanned'], latest_photo.scanned, msg=latest_photo.scanned)
            self.assertEqual(data['on_home_page'], latest_photo.on_home_page, msg=latest_photo.on_home_page)
            self.assertEqual(data['splash'], latest_photo.splash, msg=latest_photo.splash)
            self.assertEqual(data['lapel'], latest_photo.lapel, msg=latest_photo.lapel)
            for tag in tags:
                self.assertIn(tag, [t.name for t in latest_photo.tags.all()])

    def test_fg_user_can_delete_photo ( self ):
        user = User.objects.get(username="FG")
        view = PhotoViewSet.as_view({'delete': 'destroy'})
        self.photos = seed_photos()
        original_photo_count = models.Photo.objects.count()

        request = self.factory.delete(path='/api/photos')
        force_authenticate(request, user=user)
        response = view(request, pk=1)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, msg=response.data)
        self.assertEqual(models.Photo.objects.count(), original_photo_count - 1)

    def test_fg_user_can_update_photo ( self ):
        self.photos = seed_photos()
        user = User.objects.get(username="FG")
        view = PhotoViewSet.as_view({'put': 'update'})

        tags = []
        for i in range(3):
            tags.append(models.Tag.objects.create(name="NEW_TAG_" + str(i)))
        new_category = models.Category.objects.create(name="NEW_CAT")
        new_album = models.Album.objects.create(name="NALB")
        new_media = models.Media.objects.create(name="NEW_MEDIA")
        new_place = models.Place.objects.create(name="NEW_PLACE")
        random_security = random.choice(models.SecurityLevel.objects.all())

        data = {
            'motive': 'NEW_MOTIVE',
            'album': new_album.pk,
            'security_level': random_security.pk,
            'category': new_category.pk,
            'media': new_media.pk,
            'place': new_place.pk,
            'tags': [t.name for t in tags],
            'image_number': 24,
            'page': 48,
            'date_taken': datetime.now().astimezone()
        }

        request = self.factory.put(path='/api/photos', data=data)
        force_authenticate(request, user=user)
        response = view(request, pk=1)
        photo = models.Photo.objects.get(pk=1)

        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)
        self.assertEqual(new_album.pk, photo.album.pk, msg=photo.album)
        self.assertEqual(new_category.pk, photo.category.pk, msg=photo.category)
        self.assertEqual(new_media.pk, photo.media.pk, msg=photo.media)
        self.assertEqual(new_place.pk, photo.place.pk, msg=photo.place)
        for tag in tags:
            self.assertIn(tag.pk, [t.pk for t in photo.tags.all()])

    def test_fg_user_can_update_list_of_photos ( self ):  # TODO
        pass

    def test_latest_splash_retrieved ( self ):
        self.photos = seed_photos()
        view = LatestSplashPhotoView.as_view()

        for photo in self.photos:
            photo.splash = False
            photo.save()

        expected = None

        request = self.factory.get(path='/api/photos/latest-splash')
        response = view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK, msg=response.data)

        self.assertEqual(expected, response.data['photo'], msg=response.data)

        expected = models.Photo.objects.filter(security_level__name='ALLE').latest()
        expected.splash = True
        expected.save()

        expected = models.Photo.objects.filter(security_level__name='ALLE').filter(splash=True).latest('date_taken')
        request = self.factory.get(path='/api/photos/latest-splash')
        response = view(request)
        self.assertEqual(expected.motive, response.data['motive'], msg=response.data)

        expected = None
        for photo in self.photos:
            photo.splash = False
            photo.save()

        p = models.Photo.objects.get(pk=1)
        p.security_level = models.SecurityLevel.objects.get(name="FG")
        p.splash = True
        p.save()

        request = self.factory.get(path='/api/photos/latest-splash')
        response = view(request)
        self.assertEqual(expected, response.data['photo'])

    def test_anon_user_cannot_post ( self ):
        pass


class OrderTestCase(APITestCase):
    photos = []

    def setUp ( self ):
        seed_foreign_keys()
        seed_groups()
        seed_security_levels()
        seed_users()
        self.photos = seed_photos()
        self.factory = APIRequestFactory()

    def tearDown ( self ):
        if self.photos:
            delete_photos(self.photos)

    def test_order_is_created ( self ):
        view = OrderViewSet.as_view({'post': 'create'})

        data = {
            'name': 'nameyName',
            'email': 'mail@mail.com',
            'address': 'addressy',
            'place': 'placey',
            'zip_code': '1234',
            'post_or_get': 'get',
            'comment': 'i really like turtles',
            'order_photos': [
                {'photo': 1, 'format': 'bigAF'},
                {'photo': 2, 'format': 'smallAF'}
            ]
        }

        request = self.factory.post(path='/api/orders', format='json', data=data)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, msg=response.data)
        order = models.Order.objects.all()[0]
        self.assertEqual(order.name, data['name'])
        order_photo_count = models.OrderPhoto.objects.count()
        self.assertEqual(order_photo_count, 2)
        order_photos = models.OrderPhoto.objects.all()

        for op in order_photos:
            self.assertEqual(op.order.pk, order.pk)


class AlbumTestCase(APITestCase):
    def test_if_album_always_in_descending_order ( self ):
        album_count = 20
        for x in range(album_count):
            models.Album.objects.create(name=get_rand_string())
            sleep(0.002)
        factory = APIRequestFactory()
        request = factory.get('/api/albums/')
        view = AlbumViewSet.as_view({'get': 'list'})
        response = view(request)
        albums = response.data
        for num in range(album_count - 1):
            self.assertGreater(albums[num]['date_created'], albums[num + 1]['date_created'])


class UserTestCase(APITestCase):
    def setUp ( self ):
        seed_groups()
        seed_users()
        self.factory = APIRequestFactory()


    def test_fg_users_can_get_all_fg_users ( self ):
        view = FgUsersView.as_view()

        user = User.objects.get(username="FG")
        request = self.factory.get(path='/api/users/fg')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        fg_user_count = User.objects.filter(groups__name="FG").count()
        self.assertEqual(fg_user_count, len(response.data))

    def test_fg_users_can_get_all_power_users ( self ):
        view = PowerUsersView.as_view()

        user = User.objects.get(username="FG")
        request = self.factory.get(path='/api/users/power')
        force_authenticate(request, user=user)
        response = view(request)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        power_user_count = User.objects.filter(groups__name="POWER").count()
        self.assertEqual(power_user_count, len(response.data))
