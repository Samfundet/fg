from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework import viewsets
from . import models, serializers


class TagViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited
    """
    queryset = models.Tag.objects.all().order_by('name')
    serializer_class = serializers.TagSerializer

class CategoryViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited
    """
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer

class MediaViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows mediums to be viewed or edited
    """
    queryset = models.Media.objects.all()
    serializer_class = serializers.MediaSerializer


class AlbumViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows albums to be viewed or edited
    """
    queryset = models.Album.objects.all()
    serializer_class = serializers.AlbumSerializer


class PlaceViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows places to be viewed or edited
    """
    queryset = models.Place.objects.all()
    serializer_class = serializers.PlaceSerializer


class PhotoViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows image data to be viewed or edited
    """
    queryset = models.Photo.objects.all()
    serializer_class = serializers.PhotoSerializer
