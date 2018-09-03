from django_filters.rest_framework import FilterSet, filters
from . import models


class PhotoFilter(FilterSet):
    date_taken_from = filters.DateFilter(field_name='date_taken', lookup_expr='gte')
    date_taken_to = filters.DateFilter(field_name='date_taken', lookup_expr='lte')

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



class OrderFilter(FilterSet):
    class Meta:
        model = models.Order
        fields = [
            'order_completed'
        ]
