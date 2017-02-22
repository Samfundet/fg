from django.db import models

# Create your models here.
class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True)

class Category(models.Model):
    category = models.CharField(max_length=80, unique=True)

class Media(models.Model):
    medium = models.CharField(max_length=80, unique=True)

class Album(models.Model):
    name = models.CharField(max_length=5, unique=True)

class Place(models.Model):
    place = models.CharField(max_length=80, unique=True)

class Image(models.Model):
    #image_prod = models.ImageField()
    #image_web = models.ImageField()
    #image_thumb = models.ImageField()

    # Foreign keys
    tag = models.ForeignKey(Tag)
    category = models.ForeignKey(Category)
    media = models.ForeignKey(Media)
    album = models.ForeignKey(Album)
    place = models.ForeignKey(Place)
