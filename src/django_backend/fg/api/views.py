import itertools
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.decorators import api_view
from rest_framework_filters.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import BasePagination, CursorPagination
from rest_framework.viewsets import ModelViewSet, ViewSet
from rest_framework.views import APIView
from rest_framework.response import Response
from collections import namedtuple
from django.db.models import Count, Max
from django.db.models.functions import TruncYear

from ..paginations import UnlimitedPagination
from ..permissions import IsFGOrReadOnly, IsFG, IsFgOrPostOnly, IsFgOrHusfolk
from rest_framework.permissions import AllowAny
from . import models, serializers, filters


Statistics = namedtuple(
    'Statistics',
    ('photos', 'tags', 'scanned', 'albums', 'splash', 'orders', 'photos_by_year', 'photos_per_album')
)

SearchData = namedtuple(
    'SearchData',
    ('motives',)
)

IDInfo = namedtuple(
    'IDInfo',
    ('photo_ids',)
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


@api_view()
def get_latest_image_number_and_page_number ( request, album_id='', analog=False ):
    try:
        if album_id:
            latest_album = models.Photo.objects.filter(
                album=album_id.strip()).latest('date_taken').album
        elif analog: # TODO or FIX: currently no need for this
            latest_album = models.Photo.objects.exclude(
                album__name__startswith='DIG').latest('date_taken').album
        else:
            latest_album = models.Photo.objects.filter(
                album__name__startswith='DIG').latest('date_taken').album
        latest_page = models.Photo.objects.filter(
            album__name=latest_album.name).aggregate(Max('page'))['page__max']
        latest_image_number = (models.Photo.objects.filter(
            album__name=latest_album.name, page=latest_page).aggregate(Max('image_number'))['image_number__max'])
        if latest_image_number >= 99:
            if latest_page < 99:
                latest_image_number = 1
                latest_page = latest_page + 1
            else:
                return Response({
                    'album': latest_album.id,
                    'latest_page': 'fullt',
                    'latest_image_number': 'fullt'
                })
        else:
            latest_image_number = latest_image_number + 1
        return Response({
            'album': latest_album.id,
            'latest_page': latest_page,
            'latest_image_number': latest_image_number
        })
    except ObjectDoesNotExist as e:
        print(e)
        return Response({
            'album': 0,
            'latest:page': 1,
            'latest_image_number': 1
        })


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


class PhotoListFromAlbumPageAndImageNumber(ViewSet):
    permission_classes = [IsFG]

    def get_queryset ( self ):
        user = self.request.user
        if (user.groups.exists() and user.is_active and 'FG' in user.groups.all()) or user.is_superuser:
            album = self.request.query_params.get('album')
            page = self.request.query_params.get('page')
            image_numbers = self.request.query_params.get('image_numbers', []).split(',')
            photos = models.Photo.objects.filter(album=album, page=page, image_number__in=image_numbers)
            pids = []
            for photo in photos:
                pids.append(photo.id)
            return pids

        return []

    def list ( self, request ):
        ids = IDInfo(self.get_queryset())
        serializer = serializers.PhotoByIDSerializer(ids)
        return Response(serializer.data)


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
    permission_classes = [IsFG]

    def list ( self, request ):
        # Puts photos per year in list, 0-index = newest year
        photos_per_year = models.Photo.objects.annotate(
            year=TruncYear('date_taken')
        ).values('year').annotate(
            count=Count('pk')
        ).values('count', 'year')

        # TODO same thing for analog and digital photos (use filter on photos_per_year)
        # TODO This should wait until after database merge so that we have the correct pks
        # has to be in this format for graphics
        photo_per_year_list = []
        for year in photos_per_year:
            y = year.get('year').year
            photo_per_year_list.append([str(year.get('year').year), year.get('count')])
        photo_per_year_list.sort()

        # TODO sort amount of photos in each album
        photos_per_album = models.Photo.objects.values('album__name').annotate(Count('album')).order_by('album__name')

        # Puts data into named tuple to send to serializer
        statistics = Statistics(
            photos=models.Photo.objects.all().count(),
            tags=models.Tag.objects.all().count(),
            scanned=models.Photo.objects.filter(scanned=True).count(),
            albums=models.Photo.objects.all().count(),
            splash=models.Photo.objects.filter(splash=True).count(),
            orders=models.Order.objects.all().count(),
            photos_by_year=photo_per_year_list,
            photos_per_album=photos_per_album
        )
        serializer = serializers.StatisticsSerializer(statistics)
        return Response(serializer.data)


class SearchAutocompleteDataViewSet(ViewSet):
    permission_classes = [IsFGOrReadOnly]

    def extra_permission(self):
        user = self.request.user
        if user.has_perm(IsFG):
            return 3
        elif user.has_perm(IsFgOrHusfolk):
            return 2
        return 1

    def get_queryset(self):
        max_sec = self.extra_permission()
        data = SearchData(
            motives=models.Photo.objects.values_list('motive', flat=True).exclude(security_level_id__gt=max_sec),
        )
        return data

    def list ( self, request ):
        serializer = serializers.SearchAutocompleteDataSerializer(self.get_queryset())
        return Response(serializer.data)
