import os
import sys
import json
sys.path.append('/django')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fg.settings")
import django
django.setup()

from django import db
from fg.api import models
from fg.legacy import models as old_models
from fg.fg_auth.models import User
from versatileimagefield.fields import VersatileImageField


def convert_SecurityLevel():
    print("Converting security_levels")
    old_security_levels = old_models.FgAuthSecuritylevel.objects.using(
        'old_db').all()

    obj_list = []
    for item in old_security_levels:
        new_item = models.SecurityLevel(name=item.name, pk=item.pk)
        obj_list.append(new_item)

    models.SecurityLevel.objects.bulk_create(obj_list)


def convert_Tag():
    print("Converting tags")
    old_tags = old_models.ArchiveTag.objects.using('old_db').all()

    obj_list = []
    for item in old_tags:
        new_item = models.Tag(name=item.name, pk=item.pk)
        obj_list.append(new_item)

    models.Tag.objects.bulk_create(obj_list)


def convert_Category():
    print("Converting categories")
    old_categories = old_models.ArchiveCategory.objects.using('old_db').all()

    obj_list = []
    for item in old_categories:
        new_item = models.Category(name=item.category, pk=item.pk)
        obj_list.append(new_item)

    models.Category.objects.bulk_create(obj_list)


def convert_Album():
    print("Converting albums")
    old_albums = old_models.ArchiveAlbum.objects.using('old_db').all()

    old_albums_cleaned = []
    inc = 0
    for album in old_albums:
        if album.name == 'DIVB':
            if inc > 0:
                album.name = 'DIVB2'
            else:
                inc += 1

        old_albums_cleaned.append(album)

    obj_list = []
    for item in old_albums_cleaned:
        new_item = models.Album(
            name=item.name, description=item.description, pk=item.pk)
        obj_list.append(new_item)

    models.Album.objects.bulk_create(obj_list)


def convert_Media():
    print("Converting mediums")
    old_mediums = old_models.ArchiveMedia.objects.using('old_db').all()

    obj_list = []
    for item in old_mediums:
        new_item = models.Media(name=item.medium, pk=item.pk)
        obj_list.append(new_item)

    models.Media.objects.bulk_create(obj_list)


def convert_Place():
    print("Converting places")
    old_places = old_models.ArchivePlace.objects.using('old_db').all()

    obj_list = []
    for item in old_places:
        new_item = models.Place(name=item.place, pk=item.pk)
        obj_list.append(new_item)

    models.Place.objects.bulk_create(obj_list)


def convert_Photo():
    print("Converting Photos")
    chunksize = 1000
    old_photo_set = old_models.ArchiveImagemodel.objects.using('old_db').order_by('pk')

    key_dict = {}
    dupes = []
    # obj_list = []

    for item in old_photo_set.iterator():
        key = '{}#{}-{}-{}'.format(item.pk, item.page, item.image_number, item.album.pk)
        if key in key_dict:
            dupes.append(key)
        else:
            key_dict[key] = item
    print(dupes)


    # for item in old_Photos[:100]:

    #     key = '{}-{}-{}'.format(item.page, item.image_number, item.album.pk)
    #     if key in key_dict:
    #         dupes.append(key)
    #         item.page = 99
    #         item.image_number = 99
    #     else:
    #         key_dict[key] = item

    #     new_item = models.Photo(
    #         photo=item.image_prod,
    #         motive=item.motive,
    #         scanned=item.scanned,
    #         on_home_page=item.on_home_page,
    #         lapel=item.lapel,
    #         splash=False,
    #         page=item.page,
    #         image_number=item.image_number,
    #         date_taken=item.date,

    #         security_level=models.SecurityLevel.objects.get(
    #             pk=item.security_level.pk),
    #         category=models.Category.objects.get(pk=item.category.pk),
    #         media=models.Media.objects.get(pk=item.media.pk),
    #         album=models.Album.objects.get(pk=item.album.pk),
    #         place=models.Place.objects.get(pk=item.place.pk)
    #     )
    #     obj_list.append(new_item)

    # print("Bulk insert photos")
    # models.Photo.objects.bulk_create(obj_list)

    # print(dupes)


def convert():
    convert_SecurityLevel()
    convert_Tag()
    convert_Category()
    convert_Album()
    convert_Media()
    convert_Place()
    convert_Photo()

    User.objects.create_superuser(
        username='fg', email='', password='qwer1234')

    print("Done!")


convert()
