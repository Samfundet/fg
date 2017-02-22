from django.contrib import admin
from . import models

# Register your models here.
class TagAdmin(admin.ModelAdmin):
    list_display = ('name')

admin.register(models.Tag, TagAdmin)
