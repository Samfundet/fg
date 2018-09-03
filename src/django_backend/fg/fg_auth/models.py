from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import BaseUserManager, Group
from django.utils import timezone
from ..api.models import Photo


class FGUserManager(BaseUserManager):
    def create_user(self, username, email=None, password=None, **extra_fields):
        now = timezone.now()
        if not username:
            raise ValueError('The given username must be set')
        email = FGUserManager.normalize_email(email)
        user = self.model(username=username, email=email,
                          is_staff=False, is_active=True, is_superuser=False,
                          last_login=now, date_joined=now, **extra_fields)

        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, email, password, **extra_fields):
        user = self.create_user(username, email, password, **extra_fields)
        user.is_staff = True
        user.is_active = True
        user.is_superuser = True
        user.save()

        group, created = Group.objects.get_or_create(name="FG")
        group.user_set.add(user)
        return user


class Job(models.Model):
    objects = models.Manager()

    name = models.CharField(max_length=64)
    description = models.CharField(max_length=256)
    date_created = models.DateTimeField(blank=True, default=timezone.now)

    def __str__(self):
        return self.name


class UserDownloadedPhoto(models.Model):
    objects = models.Manager()

    photo = models.ForeignKey(Photo, on_delete=models.PROTECT)
    user = models.ForeignKey('User', on_delete=models.CASCADE)
    date_downloaded = models.DateTimeField(blank=True, default=timezone.now)

    def __str__(self):
        return '[' + str(self.user) + '] downloaded ' + str(self.photo)


class User(AbstractUser):
    """fields in AbstractUser username, first_name, last_name, email"""
    # Personal info
    address = models.CharField(max_length=100, blank=True)
    zip_code = models.CharField(null=True, blank=True, max_length=16)
    city = models.CharField(max_length=30, blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    member_number = models.IntegerField(null=True, blank=True)
    # fg info
    opptaksaar = models.IntegerField(null=True, blank=True)
    gjengjobber = models.ManyToManyField(Job, blank=True)
    hjemmeside = models.CharField(max_length=255, blank=True)
    uker = models.CharField(max_length=255, blank=True)
    fg_kallenavn = models.CharField(max_length=255, blank=True)
    bilde = models.ImageField(
        max_length=255, blank=True, upload_to='alle/fg_profile_images')
    aktiv_pang = models.BooleanField(default=False)
    comments = models.CharField(max_length=255, blank=True)

    downloaded_photos = models.ManyToManyField(Photo, through='UserDownloadedPhoto')

    objects = FGUserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return '%s %s - (%s)' % (self.first_name, self.last_name, self.username)
