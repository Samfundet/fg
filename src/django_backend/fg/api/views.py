from django.core.exceptions import ObjectDoesNotExist
from rest_framework_filters.backends import DjangoFilterBackend
from rest_framework.filters import OrderingFilter, SearchFilter
from rest_framework.generics import RetrieveAPIView, ListAPIView
from rest_framework.pagination import BasePagination
from rest_framework.viewsets import ModelViewSet

from ..permissions import IsFGOrReadOnly, IsFG
from . import models, serializers, filters

from django.core.mail import EmailMessage


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
    search_fields = ('motive', 'tags__name', 'album__name')
    ordering = ('-date_taken',)
    filter_class = filters.PhotoFilter

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
        self.permission_classes = [IsFG]
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
    permission_classes = [IsFGOrReadOnly]

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


class PhotoListFromIds(ListAPIView):
    """
    Retrieves a list of photos from a list of ids
    """
    serializer_class = serializers.PhotoSerializer
    permission_classes = [IsFGOrReadOnly]

    def get_queryset(self):
        user = self.request.user

        if (user.groups.exists() and user.is_active and 'FG' in user.groups.all()) or user.is_superuser:
            ids = self.request.query_params.get('ids', []).split(',')
            return models.Photo.objects.filter(id__in=ids)

        return models.Photo.objects.none()

def sendOrderMail(request, name, addr, postnum, place, from_email, size, get_or_post, images):
    if request.method == 'POST':
        email = EmailMessage('Bildebestilling ' + name,  # Subject
                             'Navn: ' + name + '\n' +  # Body begins here
                             'Addresse: ' + addr + '\n' +
                             'Postnummer: ' + postnum + '\n' +
                             'Sted: ' + place + '\n' +
                             'Størrelse: ' + size + '\n' +
                             'Hente selv: ' + get_or_post + '\n' +
                             'Bilder: ' + images,  # Body ends here
                             from_email=from_email,  # Users email
                             to=['mikkel.sandsbraaten@gmail.com'], # FG email
                             headers={'Message-ID': 'foo'} # Headers TODO
                             )
        email.send()
