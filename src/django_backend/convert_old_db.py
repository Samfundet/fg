import os
import sys
import json
sys.path.append('/django')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fg.settings")
import django
django.setup()

from django.core.exceptions import ObjectDoesNotExist

from django import db
from fg.api import models, views
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


def get_latest_image_number_and_page_number(album_pk):
    latest_page = models.Photo.objects.filter(
        album=album_pk
    ).aggregate(db.models.Max('page'))['page__max']

    latest_image_number = models.Photo.objects.filter(
        album=album_pk, page=latest_page
    ).aggregate(db.models.Max('image_number'))['image_number__max']

    new_image_number = latest_image_number + 1
    new_page = latest_page
    if new_image_number > 99:
        new_image_number = 1
        new_page = latest_page + 1
    else:
        raise IndexError("Out of image_number and page range!")

    return {
        'new_image_number': new_image_number,
        'new_page': new_page
    }


def convert_Photo():
    print("Converting Photos")
    chunksize = 1000
    queryset = old_models.ArchiveImagemodel.objects.using('old_db')

    key_dict = {}
    dupes = []
    pk = 0
    last_pk = queryset.order_by('-pk')[0].pk
    old_photo_set = queryset.order_by('pk')

    while pk < last_pk:
        obj_list = []

        for item in old_photo_set.filter(pk__gt=pk)[:chunksize]:
            sys.stdout.write(".")
            pk = item.pk

            key = '{}-{}-{}'.format(item.page,
                                    item.image_number, item.album.pk)
            if key in key_dict:
                dupes.append(item)
                continue
            else:
                key_dict[key] = item

            if len(item.motive) >= 256:
                item.description = item.motive
                item.motive = item.motive[:255]

            new_item = models.Photo(
                pk=item.pk,
                photo=item.image_prod,
                motive=item.motive,
                scanned=item.scanned,
                on_home_page=item.on_home_page,
                lapel=item.lapel,
                splash=False,
                page=item.page,
                image_number=item.image_number,
                date_taken=item.date,

                security_level=models.SecurityLevel.objects.get(
                    pk=item.security_level.pk),
                category=models.Category.objects.get(pk=item.category.pk),
                media=models.Media.objects.get(pk=item.media.pk),
                album=models.Album.objects.get(pk=item.album.pk),
                place=models.Place.objects.get(pk=item.place.pk)
            )
            obj_list.append(new_item)

        print("#")
        print("Bulk inserting {} photos".format(len(obj_list)))
        models.Photo.objects.bulk_create(obj_list)

    print("{} duplicates found".format(len(dupes)))
    for item in dupes:
        resp = get_latest_image_number_and_page_number(item.album.pk)
        new_item = models.Photo(
            pk=item.pk,
            photo=item.image_prod,
            motive=item.motive,
            scanned=item.scanned,
            on_home_page=item.on_home_page,
            lapel=item.lapel,
            splash=False,
            page=resp['new_page'],
            image_number=resp['new_image_number'],
            date_taken=item.date,

            security_level=models.SecurityLevel.objects.get(
                pk=item.security_level.pk),
            category=models.Category.objects.get(pk=item.category.pk),
            media=models.Media.objects.get(pk=item.media.pk),
            album=models.Album.objects.get(pk=item.album.pk),
            place=models.Place.objects.get(pk=item.place.pk)
        )
        new_item.save()
        print(resp)


def attach_Tags_to_photos():
    old_tag2photo_set = old_models.ArchiveImagemodelTag.objects.using(
        'old_db').order_by('imagemodel')

    for item in old_tag2photo_set:
        try:
            photo = models.Photo.objects.get(pk=item.imagemodel.pk)
            tag = models.Tag.objects.get(pk=item.tag.pk)

            photo.tags.add(tag)
            photo.save()
        except ObjectDoesNotExist:
            continue


def convert():
    convert_SecurityLevel()
    convert_Tag()
    convert_Category()
    convert_Album()
    convert_Media()
    convert_Place()
    convert_Photo()
    attach_Tags_to_photos()

    User.objects.create_superuser(
        username='fg', email='', password='qwer1234')

    print("Done!")


convert()
