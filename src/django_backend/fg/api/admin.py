from django.contrib import admin
from . import models

admin.site.register(models.Tag)
admin.site.register(models.Category)
admin.site.register(models.Media)
admin.site.register(models.Album)
admin.site.register(models.Place)
admin.site.register(models.Image)
