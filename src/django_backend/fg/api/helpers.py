"""Helper file containing functions used in api"""
import os
from uuid import uuid4


def path_and_rename(instance, filename):
    """Used in Image model to determine filename and path"""
    upload_to = "prod"
    extension = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, extension)
    else:
        # set filename as random string
        filename = '{}.{}'.format(uuid4().hex, extension)

    return os.path.join(upload_to, filename)


def path_and_rename_prod(instance, filename):
    upload_to = "prod"
    path_and_rename(instance, filename, upload_to)


def path_and_rename_web(instance, filename):
    upload_to = "web"
    path_and_rename(instance, filename, upload_to)


def path_and_rename_thumb(instance, filename):
    upload_to = "thumb"
    path_and_rename(instance, filename, upload_to)


def get_file_type(thumb_extension):
    if thumb_extension in ['.jpg', '.jpeg']:
        return 'JPEG'
    elif thumb_extension == '.gif':
        return 'GIF'
    elif thumb_extension == '.png':
        return 'PNG'
    else:
        return False
