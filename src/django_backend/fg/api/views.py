from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework.viewsets import ModelViewSet
from rest_framework.permissions import IsAdminUser
from . import models, serializers
from .permissions import IsFGOrReadOnly

class TagViewSet(ModelViewSet):
    """
    API endpoint that allows tags to be viewed or edited
    """
    queryset = models.Tag.objects.all().order_by('name')
    serializer_class = serializers.TagSerializer
    permission_classes = [IsFGOrReadOnly]


class CategoryViewSet(ModelViewSet):
    """
    API endpoint that allows categories to be viewed or edited
    """
    queryset = models.Category.objects.all()
    serializer_class = serializers.CategorySerializer
    permission_classes = [IsFGOrReadOnly]


class MediaViewSet(ModelViewSet):
    """
    API endpoint that allows mediums to be viewed or edited
    """
    queryset = models.Media.objects.all()
    serializer_class = serializers.MediaSerializer
    permission_classes = [IsFGOrReadOnly]


class AlbumViewSet(ModelViewSet):
    """
    API endpoint that allows albums to be viewed or edited
    """
    queryset = models.Album.objects.all()
    serializer_class = serializers.AlbumSerializer
    permission_classes = [IsFGOrReadOnly]


class PlaceViewSet(ModelViewSet):
    """
    API endpoint that allows places to be viewed or edited
    """
    queryset = models.Place.objects.all()
    serializer_class = serializers.PlaceSerializer
    permission_classes = [IsFGOrReadOnly]


class PhotoViewSet(ModelViewSet):
    """
    API endpoint that allows image data to be viewed or edited
    """
    queryset = models.Photo.objects.none()
    serializer_class = serializers.PhotoSerializer
    permission_classes = [IsFGOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        # Filter the photos based on user group
        # No group == "Alle"
        if user.groups.exists():
            for g in user.groups.all():
                if g.name == "FG":
                    # FG gets to see it all
                    return models.Photo.objects.all()
                elif g.name in ["HUSFOLK", "POWER"]:  # TODO test permissions
                    return models.Photo.objects.filter(security_level__name__iexact="ALLE")
        else:
            return models.Photo.objects.filter(security_level__name__iexact="ALLE")
