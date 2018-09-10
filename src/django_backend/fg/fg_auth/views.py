import base64
from time import sleep
from rest_framework import viewsets
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from rest_framework.authentication import SessionAuthentication

from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.forms.models import model_to_dict
from django.utils.decorators import decorator_from_middleware

from . import models, serializers
from ..paginations import UnlimitedPagination
from ..permissions import IsFGOrReadOnly, IsFG


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = models.User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [IsFGOrReadOnly]


class FgUsersView(ListAPIView):
    """
    Retrieves all the FG users in a list
    """
    serializer_class = serializers.UserSerializer
    pagination_class = UnlimitedPagination
    permission_classes = [IsFG]

    def get_queryset(self):
        return models.User.objects.filter(groups__name="FG").all()


class PowerUsersView(ListAPIView):
    """
    Retrieves all the POWER users in a list
    """
    serializer_class = serializers.UserSerializer
    pagination_class = UnlimitedPagination
    permission_classes = [IsFG]

    def get_queryset(self):
        return models.User.objects.filter(groups__name="POWER").all()

def login_user(request):
    user = request.user
    return JsonResponse({"username": request.user.username})
