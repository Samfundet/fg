from fg.api import helpers
from django.db import models
from versatileimagefield.fields import VersatileImageField, PPOIField


class Tag(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)
    description = models.CharField(max_length=255)

    def __str__(self):
        return self.name


class Category(models.Model):
    name = models.CharField(max_length=80, unique=True, db_index=True)

    class Meta:
        verbose_name_plural = 'categories'

    def __str__(self):
        return self.name


class Media(models.Model):
    name = models.CharField(max_length=80, unique=True, db_index=True)

    def __str__(self):
        return self.name


class Album(models.Model):
    name = models.CharField(max_length=5, unique=True, db_index=True)

    def __str__(self):
        return self.name


class Place(models.Model):
    name = models.CharField(max_length=80, unique=True, db_index=True)

    def __str__(self):
        return self.name


class Photo(models.Model):
    # The actual photo object
    photo = VersatileImageField(
        upload_to=helpers.path_and_rename,
        ppoi_field='photo_ppoi',
        default="default.jpg",
        height_field='height',
        width_field='width'
    )

    # Information describing the photo
    height = models.IntegerField()
    width = models.IntegerField()
    description = models.CharField(max_length=256, db_index=True, blank=True, verbose_name='motiv')
    date_taken = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    photo_ppoi = PPOIField()

    # Foreign keys describing meta-data
    tag = models.ForeignKey(Tag, on_delete=models.CASCADE)
    category = models.ForeignKey(Category, on_delete=models.CASCADE)
    media = models.ForeignKey(Media, on_delete=models.CASCADE)
    album = models.ForeignKey(Album, on_delete=models.CASCADE)
    place = models.ForeignKey(Place, on_delete=models.CASCADE)

    def __str__(self):
        return self.photo.name;
