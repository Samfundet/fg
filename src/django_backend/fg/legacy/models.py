# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey has `on_delete` set to the desired behavior.
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from __future__ import unicode_literals

from django.db import models


class ArchiveAlbum(models.Model):
    name = models.CharField(max_length=5)
    description = models.CharField(max_length=80)

    class Meta:
        managed = False
        db_table = 'archive_album'


class ArchiveCategory(models.Model):
    category = models.CharField(max_length=80)

    class Meta:
        managed = False
        db_table = 'archive_category'


class ArchiveImagemodel(models.Model):
    image_prod = models.CharField(max_length=100)
    image_web = models.CharField(max_length=100)
    image_thumb = models.CharField(max_length=100)
    motive = models.CharField(max_length=900)
    album = models.ForeignKey(ArchiveAlbum, models.DO_NOTHING)
    page = models.IntegerField()
    image_number = models.IntegerField()
    date = models.DateTimeField()
    lapel = models.BooleanField()
    scanned = models.BooleanField()
    media = models.ForeignKey('ArchiveMedia', models.DO_NOTHING)
    place = models.ForeignKey('ArchivePlace', models.DO_NOTHING)
    security_level = models.ForeignKey('FgAuthSecuritylevel', models.DO_NOTHING)
    category = models.ForeignKey(ArchiveCategory, models.DO_NOTHING)
    on_home_page = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'archive_imagemodel'


class ArchiveImagemodelTag(models.Model):
    imagemodel = models.ForeignKey(ArchiveImagemodel, models.DO_NOTHING)
    tag = models.ForeignKey('ArchiveTag', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'archive_imagemodel_tag'
        unique_together = (('imagemodel', 'tag'),)


class ArchiveMedia(models.Model):
    medium = models.CharField(max_length=80)

    class Meta:
        managed = False
        db_table = 'archive_media'


class ArchivePlace(models.Model):
    place = models.CharField(max_length=80)

    class Meta:
        managed = False
        db_table = 'archive_place'


class ArchiveTag(models.Model):
    name = models.CharField(max_length=50)
    description = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'archive_tag'


class AuthGroup(models.Model):
    name = models.CharField(unique=True, max_length=80)

    class Meta:
        managed = False
        db_table = 'auth_group'


class AuthGroupPermissions(models.Model):
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)
    permission = models.ForeignKey('AuthPermission', models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'auth_group_permissions'
        unique_together = (('group', 'permission'),)


class AuthPermission(models.Model):
    name = models.CharField(max_length=50)
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING)
    codename = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'auth_permission'
        unique_together = (('content_type', 'codename'),)


class DjangoAdminLog(models.Model):
    action_time = models.DateTimeField()
    user_id = models.IntegerField()
    content_type = models.ForeignKey('DjangoContentType', models.DO_NOTHING, blank=True, null=True)
    object_id = models.TextField(blank=True, null=True)
    object_repr = models.CharField(max_length=200)
    action_flag = models.SmallIntegerField()
    change_message = models.TextField()

    class Meta:
        managed = False
        db_table = 'django_admin_log'


class DjangoContentType(models.Model):
    name = models.CharField(max_length=100)
    app_label = models.CharField(max_length=100)
    model = models.CharField(max_length=100)

    class Meta:
        managed = False
        db_table = 'django_content_type'
        unique_together = (('app_label', 'model'),)


class DjangoSelect2Keymap(models.Model):
    key = models.CharField(unique=True, max_length=40)
    value = models.CharField(max_length=100)
    accessed_on = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_select2_keymap'


class DjangoSession(models.Model):
    session_key = models.CharField(primary_key=True, max_length=40)
    session_data = models.TextField()
    expire_date = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'django_session'


class DjangoSite(models.Model):
    domain = models.CharField(max_length=100)
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'django_site'


class FgAuthDownloadedimages(models.Model):
    image = models.ForeignKey(ArchiveImagemodel, models.DO_NOTHING)
    user = models.ForeignKey('FgAuthUser', models.DO_NOTHING)
    date_downloaded = models.DateField()

    class Meta:
        managed = False
        db_table = 'fg_auth_downloadedimages'


class FgAuthFginfo(models.Model):
    opptaksaar = models.IntegerField(blank=True, null=True)
    gjengjobb1 = models.CharField(max_length=255)
    gjengjobb2 = models.CharField(max_length=255)
    gjengjobb3 = models.CharField(max_length=255)
    hjemmeside = models.CharField(max_length=255)
    uker = models.CharField(max_length=255)
    fg_kallenavn = models.CharField(max_length=255)
    bilde = models.CharField(max_length=255)
    aktiv_pang = models.BooleanField()
    comments = models.CharField(max_length=255)

    class Meta:
        managed = False
        db_table = 'fg_auth_fginfo'


class FgAuthSecuritylevel(models.Model):
    name = models.CharField(max_length=50)

    class Meta:
        managed = False
        db_table = 'fg_auth_securitylevel'


class FgAuthUser(models.Model):
    password = models.CharField(max_length=128)
    last_login = models.DateTimeField()
    is_superuser = models.BooleanField()
    username = models.CharField(unique=True, max_length=30)
    first_name = models.CharField(max_length=30)
    last_name = models.CharField(max_length=30)
    email = models.CharField(max_length=75)
    is_staff = models.BooleanField()
    is_active = models.BooleanField()
    date_joined = models.DateTimeField()
    address = models.CharField(max_length=100)
    zip_code = models.IntegerField(blank=True, null=True)
    city = models.CharField(max_length=30)
    phone = models.CharField(max_length=15, blank=True, null=True)
    member_number = models.IntegerField(blank=True, null=True)
    security_level = models.ForeignKey(FgAuthSecuritylevel, models.DO_NOTHING)
    fg_info = models.ForeignKey(FgAuthFginfo, models.DO_NOTHING, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'fg_auth_user'


class FgAuthUserGroups(models.Model):
    user = models.ForeignKey(FgAuthUser, models.DO_NOTHING)
    group = models.ForeignKey(AuthGroup, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'fg_auth_user_groups'
        unique_together = (('user', 'group'),)


class FgAuthUserUserPermissions(models.Model):
    user = models.ForeignKey(FgAuthUser, models.DO_NOTHING)
    permission = models.ForeignKey(AuthPermission, models.DO_NOTHING)

    class Meta:
        managed = False
        db_table = 'fg_auth_user_user_permissions'
        unique_together = (('user', 'permission'),)


class InfoSite(models.Model):
    title = models.CharField(unique=True, max_length=80)
    slug = models.CharField(unique=True, max_length=50)
    intro = models.TextField()
    body = models.TextField()
    show_home = models.BooleanField()

    class Meta:
        managed = False
        db_table = 'info_site'


class SouthMigrationhistory(models.Model):
    app_name = models.CharField(max_length=255)
    migration = models.CharField(max_length=255)
    applied = models.DateTimeField()

    class Meta:
        managed = False
        db_table = 'south_migrationhistory'


class ThumbnailKvstore(models.Model):
    key = models.CharField(primary_key=True, max_length=200)
    value = models.TextField()

    class Meta:
        managed = False
        db_table = 'thumbnail_kvstore'
