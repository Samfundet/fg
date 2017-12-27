import itertools
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_filters.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import BasePagination, CursorPagination
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from collections import namedtuple
from django.db.models import Count
from django.db.models.functions import TruncYear

from ..paginations import UnlimitedPagination
from ..permissions import IsFGOrReadOnly, IsFG, IsFgOrPostOnly
from rest_framework.permissions import AllowAny
from . import models, serializers, filters

from django.core.mail import send_mail


Statistics = namedtuple(
    'Statistics',
    # ('photos', 'tags', 'places', 'categories', 'mediums', 'orders') OLD
    ('photos', 'tags', 'scanned', 'albums', 'splash', 'orders', 'photos_by_year')
)


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
    filter_backends = (OrderingFilter,)
    ordering_fields = '__all__'
    queryset = models.Album.objects.all()
    serializer_class = serializers.AlbumSerializer
    permission_classes = [IsFGOrReadOnly]
    pagination_class = UnlimitedPagination
    ordering = ('-date_created',)


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
    pagination_class = CursorPagination

    # Filters and search
    filter_backends = (OrderingFilter, SearchFilter, DjangoFilterBackend)
    ordering_fields = '__all__'
    search_fields = ('motive', 'tags__name', 'album__name')
    ordering = ('-date_taken',)
    filter_class = filters.PhotoFilter

    def retrieve ( self, request, *args, **kwargs ):
        self.serializer_class = serializers.PhotoSerializer
        return super(PhotoViewSet, self).retrieve(request, *args, **kwargs)

    def list ( self, request, *args, **kwargs ):
        queryset = self.filter_queryset(self.get_queryset())
        page = self.paginate_queryset(queryset)
        self.serializer_class = serializers.PhotoSerializer
        serialized_list = serializers.PhotoSerializer(page, many=True)

        return self.get_paginated_response(serialized_list.data)

    def create ( self, request, *args, **kwargs ):
        self.serializer_class = serializers.PhotoCreateSerializer
        self.permission_classes = [IsFG]
        return super().create(request, *args, **kwargs)

    def destroy ( self, request, *args, **kwargs ):
        self.serializer_class = serializers.PhotoSerializer
        return super().destroy(request, *args, **kwargs)

    # Use partial update if you want to send partial objects (verb: PATCH instead of PUT)
    def update ( self, request, *args, **kwargs ):
        self.serializer_class = serializers.PhotoUpdateSerializer
        return super().update(request, *args, **kwargs)

    def partial_update ( self, request, *args, **kwargs ):
        self.serializer_class = serializers.PhotoUpdateSerializer
        return super().partial_update(request, *args, **kwargs)

    def options ( self, request, *args, **kwargs ):
        self.serializer_class = serializers.PhotoSerializer
        return super().options(request, *args, **kwargs)

    def get_queryset ( self ):
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
    permission_classes = [IsFGOrReadOnly]

    def get_object ( self ):
        try:
            latest = self.get_queryset().filter(splash=True).latest('date_taken')
        except ObjectDoesNotExist:
            return None
        if latest.splash:
            return latest
        else:
            return None

    def get_queryset ( self ):
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


class PhotoListFromIds(ListAPIView):
    """
    Retrieves a list of photos from a list of ids
    """
    serializer_class = serializers.PhotoSerializer
    permission_classes = [IsFGOrReadOnly]

    def get_queryset ( self ):
        user = self.request.user

        if (user.groups.exists() and user.is_active and 'FG' in user.groups.all()) or user.is_superuser:
            ids = self.request.query_params.get('ids', []).split(',')
            return models.Photo.objects.filter(id__in=ids)

        return models.Photo.objects.none()


class OrderViewSet(ModelViewSet):
    """
    API endpoint that allows for viewing and editing orders
    """
    serializer_class = serializers.OrderSerializer
    permission_classes = [IsFgOrPostOnly]
    queryset = models.Order.objects.all()

    filter_backends = (OrderingFilter, DjangoFilterBackend)
    ordering_fields = '__all__'
    ordering = ('order_completed',)
    filter_class = filters.OrderFilter


class OrderPhotoViewSet(ModelViewSet):
    serializer_class = serializers.OrderPhotoSerializer
    permission_classes = [IsFgOrPostOnly]
    queryset = models.OrderPhoto.objects.all()


class StatisticsViewSet(ViewSet):
    """
     Viewset for all statistics related to intern/statistics page
    """

    def list ( self, request ):
        print('new try')
        # Puts photos per year in list, 0-index = newest year
        photos_per_year = models.Photo.objects.annotate(
            year=TruncYear('date_taken')
        ).values('year').annotate(
            count=Count('pk')
        ).values('count', 'year')
        print(models.Photo.objects.annotate(
            year=TruncYear('date_taken')
        ).values('year').annotate(
            count=Count('pk')
        ).values('count', 'year'))

        # TODO same thing for analog and digital photos
        photo_per_year_list = []
        for year in photos_per_year:
            y =year.get('year').year
            photo_per_year_list.append([str(year.get('year').year), year.get('count')])
        photo_per_year_list.sort()

        statistics = Statistics(
            photos=models.Photo.objects.all().count(),
            tags=models.Tag.objects.all().count(),
            scanned=models.Photo.objects.filter(scanned=True).count(),
            albums=models.Photo.objects.all().count(),
            splash=models.Photo.objects.filter(splash=True).count(),
            orders=models.Order.objects.all().count(),
            photos_by_year=photo_per_year_list
        )
        serializer = serializers.StatisticsSerializer(statistics)
        return Response(serializer.data)
