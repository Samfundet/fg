"""Helper file containing functions used in api"""
import os, string, random
from uuid import uuid4

def path_and_rename(instance, filename):
    """Used in Image model to determine filename and path"""
    upload_to = "photo"
    extension = filename.split('.')[-1]
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, extension)
    else:
        # set filename as random string
        filename = '{}.{}'.format(uuid4().hex, extension)

    return os.path.join(upload_to, filename)

def get_rand_string(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))