from django.contrib import admin
from . import models

# api registration
admin.site.register(models.Tag)
admin.site.register(models.Category)
admin.site.register(models.Media)
admin.site.register(models.Album)
admin.site.register(models.Place)
admin.site.register(models.Photo)

