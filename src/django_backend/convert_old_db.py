import os
import time
import sys
import json
import logging
sys.path.append('/django')
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "fg.settings")
import django
django.setup()

from django.core.exceptions import ObjectDoesNotExist

from django import db
from fg.api import models, views
from fg.legacy import models as old_models
from fg.fg_auth.models import User

logging.basicConfig(level=logging.INFO)


def convert_SecurityLevel():
    logging.info("Converting security_levels")
    old_security_levels = old_models.FgAuthSecuritylevel.objects.using(
        'old_db').all()

    obj_list = []
    for item in old_security_levels:
        new_item = models.SecurityLevel(name=item.name, pk=item.pk)
        obj_list.append(new_item)

    models.SecurityLevel.objects.bulk_create(obj_list)


def convert_Tag():
    logging.info("Converting tags")
    old_tags = old_models.ArchiveTag.objects.using('old_db').all()

    obj_list = []
    for item in old_tags:
        new_item = models.Tag(name=item.name, pk=item.pk)
        obj_list.append(new_item)

    models.Tag.objects.bulk_create(obj_list)


def convert_Category():
    logging.info("Converting categories")
    old_categories = old_models.ArchiveCategory.objects.using('old_db').all()

    obj_list = []
    for item in old_categories:
        new_item = models.Category(name=item.category, pk=item.pk)
        obj_list.append(new_item)

    models.Category.objects.bulk_create(obj_list)


def convert_Album():
    logging.info("Converting albums")
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
    logging.info("Converting mediums")
    old_mediums = old_models.ArchiveMedia.objects.using('old_db').all()

    obj_list = []
    for item in old_mediums:
        new_item = models.Media(name=item.medium, pk=item.pk)
        obj_list.append(new_item)

    models.Media.objects.bulk_create(obj_list)


def convert_Place():
    logging.info("Converting places")
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

    return {
        'new_image_number': new_image_number,
        'new_page': new_page
    }


def convert_Photo():
    logging.info("Converting Photos")
    old_photo_set = old_models.ArchiveImagemodel.objects.using('old_db').all()

    key_dict = {}
    dupes = []

    obj_list = []

    for item in old_photo_set:
        logging.debug("Reading item pk#{} from photoset".format(item.pk))
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

            security_level_id=item.security_level.pk,
            category_id=item.category.pk,
            media_id=item.media.pk,
            album_id=item.album.pk,
            place_id=item.place.pk
        )
        obj_list.append(new_item)

    logging.info("Bulk inserting {} photos".format(len(obj_list)))
    models.Photo.objects.bulk_create(obj_list)

    if len(dupes) > 0:
        logging.warning("{} duplicates found".format(len(dupes)))
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

                security_level_id=item.security_level.pk,
                category_id=item.category.pk,
                media_id=item.media.pk,
                album_id=item.album.pk,
                place_id=item.place.pk
            )
            new_item.save()
            logging.info(resp)


def attach_Tags_to_photos():
    logging.info("attaching tags to photos")
    old_tag2photo_set = old_models.ArchiveImagemodelTag.objects.using(
        'old_db').order_by('imagemodel')[::1]

    for item in old_tag2photo_set:
        try:
            photo = models.Photo.objects.get(pk=item.imagemodel.pk)
            tag = models.Tag.objects.get(pk=item.tag.pk)

            photo.tags.add(tag)
            photo.save()
        except StopIteration as e:
            logging.exception("Photo or tag does not exist")
            logging.exception(e)
            continue


def convert():
    User.objects.create_superuser(
        username='fg', email='', password='qwer1234')

    convert_SecurityLevel()
    convert_Tag()
    convert_Category()
    convert_Album()
    convert_Media()
    convert_Place()
    convert_Photo()

    attach_Tags_to_photos()
    # TODO move users and user_photo_downloaded in as well


logging.info("Starting conversion")
start_time = time.monotonic()
convert()
elapsed_time = time.monotonic() - start_time
logging.info("Conversion complete")
logging.info(time.strftime("%H:%M:%S", time.gmtime(elapsed_time)))
