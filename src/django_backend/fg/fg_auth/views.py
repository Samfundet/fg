from django.contrib.auth.models import Group
from django.contrib.auth import get_user_model
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework import viewsets
from rest_framework.views import APIView
from . import models, serializers
from ..permissions import IsFGOrReadOnly, IsFG


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = models.User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [IsFGOrReadOnly]


