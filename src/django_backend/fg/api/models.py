from django.db import models
from django.utils.timezone import now


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
    image_prod = models.ImageField()
    image_web = models.ImageField(null=True)
    image_thumb = models.ImageField(null=True)

    # Foreign keys
    tag = models.ForeignKey(Tag)
    category = models.ForeignKey(Category)
    media = models.ForeignKey(Media)
    album = models.ForeignKey(Album)
    place = models.ForeignKey(Place)
    date_taken = models.DateTimeField(default=now)
    date_modified = models.DateTimeField(blank=True)

    def save(self):
        self.date_modified = now()
        super(Image, self).save()
