import os
from .. import settings
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


class SecurityLevel(models.Model):
    name = models.CharField(max_length=16, unique=True, db_index=True)

    def __str__(self):
        return self.name


def path_and_rename(instance, filename):
    image_type = '.%s' % filename.split('.')[-1]
    album = instance.album.name.upper()
    page = str(instance.page).zfill(2)
    image_number = str(instance.image_number).zfill(2)
    return settings.PROD_PATH+"%s/%s" % (album, album + page + image_number + image_type)


class Photo(models.Model):
    # The actual photo object
    photo = VersatileImageField(
        upload_to=path_and_rename,
        blank=True,
        ppoi_field='photo_ppoi',
        default=settings.MEDIA_ROOT + 'default.jpg'
    )

    # Information describing the photo
    # height = models.IntegerField()
    # width = models.IntegerField()
    motive = models.CharField(max_length=256, db_index=True, blank=True, verbose_name='motiv')
    date_taken = models.DateTimeField(auto_now_add=True)
    date_modified = models.DateTimeField(auto_now=True)
    photo_ppoi = PPOIField()

    # Meta information
    page = models.IntegerField(db_index=True)
    image_number = models.PositiveIntegerField(db_index=True)
    lapel = models.BooleanField(default=False, db_index=True)
    scanned = models.BooleanField(default=False, db_index=True)
    on_home_page = models.BooleanField(default=True, db_index=True)
    splash = models.BooleanField(default=False)

    # Foreign keys describing meta-data
    security_level = models.ForeignKey(SecurityLevel, on_delete=models.PROTECT)
    # models.Protect protects against cascading deletion. You cant delete a security level that has photos
    tags = models.ManyToManyField(Tag, blank=True)
    category = models.ForeignKey(Category)
    media = models.ForeignKey(Media)
    album = models.ForeignKey(Album)
    place = models.ForeignKey(Place)

    def __str__(self):
        return self.photo.name

    def save(self, *args, **kwargs):
        if self.pk is not None:
            orig = Photo.objects.get(pk=self.pk)
            if orig.album != self.album:
                self.move_image_file_location()
            elif orig.page != self.page:
                self.move_image_file_location()
            elif orig.image_number != self.image_number:
                self.move_image_file_location()

        super(Photo, self).save(*args, **kwargs)

    def move_image_file_location(self):
        import shutil
        try:
            if '.' in self.image_prod.name:
                image_type = ".%s" % self.image_prod.name.split('.')[-1]
            else:
                image_type = '.jpg'
            url_new = os.path.join(settings.MEDIA_ROOT, self.relative_url(image_type))
            url_orig = os.path.join(settings.MEDIA_ROOT, self.image_prod.name)
            if os.path.exists(url_orig) and 'default' not in url_orig:
                self.create_dirs(url_new)
                shutil.move(url_orig, url_new)
                self.image_prod = self.relative_url(image_type)

        except IOError as e:
            print(e)

    def relative_url(self, image_type='.jpg'):
        album = self.album.name.upper()
        return settings.PROD_PATH+"%s/%s" % (album, self.file_name(image_type=image_type))

    def file_name(self, image_type=".jpg"):
        album = self.album.name.lower()
        page = str(self.page).zfill(2)
        image_number = str(self.image_number).zfill(2)
        return album + page + image_number + image_type

    @staticmethod
    def create_dirs(dest):
        dest_dir = os.path.dirname(dest)
        if not os.path.exists(dest_dir):
            try:
                os.makedirs(dest_dir)
            except IOError:
                pass  # TODO i smell a foul stench from this snippet
