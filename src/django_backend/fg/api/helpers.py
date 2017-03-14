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