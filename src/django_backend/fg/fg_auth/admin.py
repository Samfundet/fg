from django.contrib.auth.models import Group
from django.contrib import admin
from . import models

# fg_auth registrations
admin.site.register(models.User)
admin.site.register(models.DownloadedImages)
