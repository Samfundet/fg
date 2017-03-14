import os
from ..settings import MEDIA_URL
from . import helpers
from django.db import models


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name


class Category(models.Model):
    category = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.category


class Media(models.Model):
    medium = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.medium


class Album(models.Model):
    name = models.CharField(max_length=5, unique=True)

    def __str__(self):
        return self.name;


class Place(models.Model):
    place = models.CharField(max_length=80, unique=True)

    def __str__(self):
        return self.place;


class Image(models.Model):
    image_prod = models.ImageField(upload_to=helpers.path_and_rename)
    url_web = models.CharField(default=(os.path.join(MEDIA_URL, 'web/default.jpg')), max_length=256)
    url_thumb = models.CharField(default=(os.path.join(MEDIA_URL, 'thumb/default.jpg')), max_length=256)

    # Foreign keys
    tag = models.ForeignKey(Tag)
    category = models.ForeignKey(Category)
    media = models.ForeignKey(Media)
    album = models.ForeignKey(Album)
    place = models.ForeignKey(Place)
    date_taken = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)

    def set_web_and_thumb(self):
        """If an image is saved (new or not), new web and thumb must be made and url_web and url_thumb updated"""
        self.url_web = "TEST_WEB"
        self.url_thumb = "TEST_THUMB"
        self.image_prod

    """Overriding save method"""
    def save(self, *args, **kwargs):
        self.set_web_and_thumb()
        super(Image, self).save(*args, **kwargs)

