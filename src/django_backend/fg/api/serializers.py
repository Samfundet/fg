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

class PhotoSerializer(serializers.HyperlinkedModelSerializer):
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

    def create(self, validated_data):
        tags = validated_data.pop('tags')
        category = validated_data.pop('category')
        media = validated_data.pop('media')
        album = validated_data.pop('album')
        place = validated_data.pop('place')

        photo_meta_data = []
        photo_meta_data['category'], created = models.Category.objects.get_or_create(**category)
        photo_meta_data['media'], created = models.Media.objects.get_or_create(**media)
        photo_meta_data['album'], created = models.Album.objects.get_or_create(**album)
        photo_meta_data['place'], created = models.Place.objects.get_or_create(**place)

        photo_object = models.Photo.objects.create(**validated_data)
        photo_object.tags.add(tags)

        print("#########")
        print(validated_data)
        return photo_object
