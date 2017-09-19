from rest_framework import serializers
from fg.api import models
from fg.settings import VERSATILEIMAGEFIELD_SETTINGS
from versatileimagefield.serializers import VersatileImageFieldSerializer


# Domain model serializations
class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Tag
        fields = ('name',)


class CategorySerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Category
        fields = ('name',)


class MediaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Media
        fields = ('name',)


class AlbumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Album
        fields = ('name',)


class PlaceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Place
        fields = ('name',)


class SecurityLevelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.SecurityLevel
        fields = ('name',)


class PhotoSerializer(serializers.ModelSerializer):
    photo = VersatileImageFieldSerializer(
        sizes=VERSATILEIMAGEFIELD_SETTINGS['sizes']
    )

    security_level = SecurityLevelSerializer()
    tags = TagSerializer(many=True)
    category = CategorySerializer()
    media = MediaSerializer()
    album = AlbumSerializer()
    place = PlaceSerializer()

    class Meta:
        model = models.Photo
        fields = '__all__'
        depth = 2


class PhotoCreateSerializer(serializers.ModelSerializer):
    photo = VersatileImageFieldSerializer(
        sizes=VERSATILEIMAGEFIELD_SETTINGS['sizes'],
        required=False
    )
    tags = TagSerializer(many=True, required=False)

    class Meta:
        model = models.Photo
        fields = (
            'photo',
            'motive',
            'security_level',
            'category',
            'media',
            'album',
            'place',
            'image_number',
            'page',
            'tags'
        )

    def create(self, validated_data):
        album_data = validated_data.pop('album')
        album, _ = models.Album.objects.get_or_create(name=album_data)

        place_data = validated_data.pop('place')
        place, _ = models.Place.objects.get_or_create(name=place_data)

        category_data = validated_data.pop('category')
        category, _ = models.Category.objects.get_or_create(name=category_data)

        media_data = validated_data.pop('media')
        media, _ = models.Media.objects.get_or_create(name=media_data)

        photo = models.Photo.objects.create(**validated_data)
        photo.save()

        for tag_data in validated_data.pop('tags'):
            tag = models.Tag.objects.get_or_create(**tag_data)
            photo.tags.add(tag)

        return photo


class TagListField(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class PhotoUpdateSerializer(serializers.ModelSerializer):
    photo = VersatileImageFieldSerializer(
        sizes=VERSATILEIMAGEFIELD_SETTINGS['sizes'],
        required=False
    )
    tags = TagListField(many=True)

    class Meta:
        model = models.Photo
        fields = (
            'photo',
            'motive',
            'security_level',
            'category',
            'media',
            'album',
            'place',
            'image_number',
            'page',
            'tags'
        )

    def update(self, instance, validated_data):
        instance.motive = validated_data.get('motive', instance.motive)
        instance.image_number = validated_data.get('image_number', instance.image_number)
        instance.page = validated_data.get('page', instance.page)

        album_data = validated_data.get('album', None)
        if album_data:
            album, _ = models.Album.objects.get_or_create(name=album_data.name)
            instance.album = album

        place_data = validated_data.get('place', None)
        if place_data:
            place, _ = models.Place.objects.get_or_create(name=place_data.name)
            instance.place = place

        category_data = validated_data.get('category', None)
        if category_data:
            category, _ = models.Category.objects.get_or_create(name=category_data.name)
            instance.category = category

        media_data = validated_data.get('media', None)
        if media_data:
            media, _ = models.Media.objects.get_or_create(name=media_data.name)
            instance.media = media

        for tag_name in validated_data.get('tags', []):
            tag, _ = models.Tag.objects.get_or_create(name=tag_name)
            instance.tags.add(tag)

        instance.save()

        return instance
