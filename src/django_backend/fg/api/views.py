from django.contrib.auth.models import User, Group
from rest_framework import viewsets
from . import models

from .serializers import UserSerializer, GroupSerializer, TagSerializer


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = User.objects.all().order_by('-date_joined')
    serializer_class = UserSerializer


class GroupViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows groups to be viewed or edited.
    """
    queryset = Group.objects.all()
    serializer_class = GroupSerializer


class TagViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows tags to be viewed
    """
    queryset = models.Tag.objects.all().order_by('name')
    serializer_class = TagSerializer
