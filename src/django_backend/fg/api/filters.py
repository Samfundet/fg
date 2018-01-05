import rest_framework_filters as drf_filters
from . import models


class PhotoFilter(drf_filters.FilterSet):
    date_taken_from = drf_filters.DateFilter(name='date_taken', lookup_expr='gte')
    date_taken_to = drf_filters.DateFilter(name='date_taken', lookup_expr='lte')

    class Meta:
        model = models.Photo
        fields = [
            'date_taken_from',
            'date_taken_to',
            'motive',
            'security_level',
            'category',
            'media',
            'album',
            'place',
            'tags',
            'scanned',
            'on_home_page',
            'splash',
            'lapel',
        ]


class OrderFilter(drf_filters.FilterSet):
    class Meta:
        model = models.Order
        fields = [
            'order_completed'
        ]
