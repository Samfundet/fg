from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import BaseUserManager
from django.utils import timezone


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
        return user


class SecurityLevel(models.Model):
    name = models.CharField(max_length=50, unique=True, db_index=True)

    def __str__(self):
        return self.name


class FgInfo(models.Model):
    opptaksaar = models.IntegerField(null=True, blank=True)
    gjengjobb1 = models.CharField(max_length=255, blank=True)
    gjengjobb2 = models.CharField(max_length=255, blank=True)
    gjengjobb3 = models.CharField(max_length=255, blank=True)
    hjemmeside = models.CharField(max_length=255, blank=True)
    uker = models.CharField(max_length=255, blank=True)
    fg_kallenavn = models.CharField(max_length=255, blank=True)
    bilde = models.ImageField(
        max_length=255, blank=True, upload_to='alle/fg_profile_images')  # TODO?
    aktiv_pang = models.BooleanField(default=False)
    comments = models.CharField(max_length=255, blank=True)


class User(AbstractUser):
    """fields in AbstractUser username, first_name, last_name, email"""
    address = models.CharField(max_length=100, blank=True)
    zip_code = models.IntegerField(null=True, blank=True)
    city = models.CharField(max_length=30, blank=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    member_number = models.IntegerField(null=True, blank=True)
    security_level = models.ForeignKey(SecurityLevel, default=4, blank=True)
    fg_info = models.ForeignKey(FgInfo, null=True, blank=True)
    downloaded_images = models.ManyToManyField(
        "api.Photo", blank=True, through='DownloadedImages')

    objects = FGUserManager()

    USERNAME_FIELD = 'username'

    def __str__(self):
        return '%s %s' % (self.first_name, self.last_name)

    def is_fg(self):
        return self.security_level.name.lower() == "fg"

    def is_husfolk(self):
        return self.security_level.name.lower() == "husfolk" or self.is_fg()

    def is_power(self):
        return self.security_level.name.lower() == "power" or self.is_fg()


class DownloadedImages(models.Model):
    image = models.ForeignKey("api.Photo")
    user = models.ForeignKey(User)
    date_downloaded = models.DateField(auto_now_add=True, blank=True)
