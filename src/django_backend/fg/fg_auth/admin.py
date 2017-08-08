from django.contrib import admin
from . import models

# fg_auth registrations
admin.site.register(models.SecurityLevel)
admin.site.register(models.FgInfo)
admin.site.register(models.User)
admin.site.register(models.DownloadedImages)