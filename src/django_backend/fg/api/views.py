from rest_framework.viewsets import ModelViewSet
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import RetrieveAPIView
from rest_framework.pagination import BasePagination
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import ObjectDoesNotExist
from . import models, serializers
from .permissions import IsFGOrReadOnly, IsFG


class UnlimitedPagination(BasePagination):
    def paginate_queryset(self, queryset, request, view=None):
        pass


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
    pagination_class = UnlimitedPagination


class MediaViewSet(ModelViewSet):
    """
    API endpoint that allows mediums to be viewed or edited
    """
    queryset = models.Media.objects.all()
    serializer_class = serializers.MediaSerializer
    permission_classes = [IsFGOrReadOnly]
    pagination_class = UnlimitedPagination



class AlbumViewSet(ModelViewSet):
    """
    API endpoint that allows albums to be viewed or edited
    """
    queryset = models.Album.objects.all()
    serializer_class = serializers.AlbumSerializer
    permission_classes = [IsFGOrReadOnly]
    pagination_class = UnlimitedPagination


class PlaceViewSet(ModelViewSet):
    """
    API endpoint that allows places to be viewed or edited
    """
    queryset = models.Place.objects.all()
    serializer_class = serializers.PlaceSerializer
    permission_classes = [IsFGOrReadOnly]
    pagination_class = UnlimitedPagination

class SecurityLevelViewSet(ModelViewSet):
    """
    API endpoint that allows SecurityLevels to be viewed or edited
    """
    queryset = models.SecurityLevel.objects.all()
    serializer_class = serializers.SecurityLevelSerializer
    permission_classes = [IsFG]
    pagination_class = UnlimitedPagination


class PhotoViewSet(ModelViewSet):
    """
    API endpoint that allows photo CRUD (Create, Read, Update, Delete)
    """
    permission_classes = [IsFGOrReadOnly]
    serializer_class = None

    # Filters and search
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    ordering_fields = '__all__'
    search_fields = ('motive', 'tags__name')
    ordering = ('-date_taken',)
    filter_fields = ('on_home_page',)

    def retrieve(self, request, *args, **kwargs):
        self.serializer_class = serializers.PhotoSerializer
        return super(PhotoViewSet, self).retrieve(request, *args, **kwargs)

    def list(self, request, *args, **kwargs):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        self.serializer_class = serializers.PhotoSerializer
        serialized_list = serializers.PhotoSerializer(page, many=True)

        return self.get_paginated_response(serialized_list.data)

    def create(self, request, *args, **kwargs):
        self.serializer_class = serializers.PhotoCreateSerializer
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        self.serializer_class = serializers.PhotoSerializer
        return super().destroy(request, *args, **kwargs)

    def update(self, request, *args, **kwargs):
        self.serializer_class = serializers.PhotoUpdateSerializer
        return super().update(request, *args, **kwargs)

    def options(self, request, *args, **kwargs):
        self.serializer_class = serializers.PhotoSerializer
        return super().options(request, *args, **kwargs)

    def get_queryset(self):
        user = self.request.user

        # Filter the photos based on user group
        if user.groups.exists() and user.is_active:
            for g in user.groups.all():
                if g.name == "FG":
                    # FG gets to see it all
                    return models.Photo.objects.all()
                elif g.name in ["HUSFOLK", "POWER"]:
                    return models.Photo.objects.filter(security_level__name__in=("ALLE", "HUSFOLK"))
        elif user.is_superuser and user.is_active:
            return models.Photo.objects.all()
        else:  # No group == "ALLE"
            return models.Photo.objects.filter(security_level__name="ALLE")


class LatestSplashPhotoView(RetrieveAPIView):
    """
    Retrieves the latest photo with splash set to True
    """
    serializer_class = serializers.PhotoSerializer

    def get_object(self):
        try:
            latest = self.get_queryset().filter(splash=True).latest('date_taken')
        except ObjectDoesNotExist:
            return None
        if latest.splash:
            return latest
        else:
            return None

    def get_queryset(self):
        user = self.request.user

        # Filter the photos based on user group
        if user.groups.exists() and user.is_active:
            for g in user.groups.all():
                if g.name == "FG":
                    # FG gets to see it all
                    return models.Photo.objects.all()
                elif g.name in ["HUSFOLK", "POWER"]:
                    return models.Photo.objects.filter(security_level__name__in=("ALLE", "HUSFOLK"))
        elif user.is_superuser and user.is_active:
            return models.Photo.objects.all()
        else:  # No group == "ALLE"
            return models.Photo.objects.filter(security_level__name="ALLE")
