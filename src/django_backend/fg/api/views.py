from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from . import models, serializers


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = serializers.GroupSerializer


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


class ImageViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows image data to be viewed or edited
    """
    queryset = models.Image.objects.all()
    serializer_class = serializers.ImageSerializer