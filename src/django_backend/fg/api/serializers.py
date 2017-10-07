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
        fields = ('name', 'id')


class MediaSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Media
        fields = ('name', 'id')


class AlbumSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Album
        fields = ('name', 'id', 'date_created')


class PlaceSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Place
        fields = ('name', 'id')


class SecurityLevelSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.SecurityLevel
        fields = ('name', 'id')


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


class TagListField(serializers.StringRelatedField):
    def to_internal_value(self, value):
        return value


class PhotoCreateSerializer(serializers.ModelSerializer):
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
            'date_taken',
            'security_level',
            'category',
            'media',
            'album',
            'place',
            'image_number',
            'page',
            'tags',
            'scanned',
            'on_home_page',
            'splash',
            'lapel'
        )

    def create(self, validated_data):
        tags = validated_data.pop('tags')

        photo = models.Photo.objects.create(**validated_data)
        for tag_name in tags:
            tag, _ = models.Tag.objects.get_or_create(name=tag_name)
            photo.tags.add(tag)
        photo.save()

        return photo


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
            'date_taken',
            'security_level',
            'category',
            'media',
            'album',
            'place',
            'image_number',
            'page',
            'tags',
            'scanned',
            'on_home_page',
            'splash',
            'lapel'
        )

    def update(self, instance, validated_data):
        instance.motive = validated_data.get('motive', instance.motive)
        instance.image_number = validated_data.get('image_number', instance.image_number)
        instance.page = validated_data.get('page', instance.page)

        instance.album = validated_data.get('album', instance.album)
        instance.place = validated_data.get('place', instance.place)
        instance.category = validated_data.get('category', instance.category)
        instance.media = validated_data.get('media', instance.media)

        instance.scanned = validated_data.get('scanned', instance.scanned)
        instance.on_home_page = validated_data.get('on_home_page', instance.on_home_page)
        instance.splash = validated_data.get('splash', instance.splash)

        for tag_name in validated_data.get('tags', instance.tags):
            tag, _ = models.Tag.objects.get_or_create(name=tag_name)
            instance.tags.add(tag)

        instance.save()

        return instance


class ShoppingCartSerializer(serializers.Serializer):
    foo = serializers.CharField()

