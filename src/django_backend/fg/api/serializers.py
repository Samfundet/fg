from rest_framework import serializers
from fg.api import models
from fg.settings import VERSATILEIMAGEFIELD_SETTINGS
from versatileimagefield.serializers import VersatileImageFieldSerializer


# Domain model serializations
class TagSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Tag
        fields = ('name', 'description')


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


class PhotoListSerializer(serializers.ModelSerializer):
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
        sizes=VERSATILEIMAGEFIELD_SETTINGS['sizes']
    )
    tags = TagSerializer(many=True)

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

    def create(self, validated_data):  # TODO
        pass
