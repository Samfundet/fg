import base64
from time import sleep
from rest_framework import viewsets
from rest_framework import serializers
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login
from django.http import HttpResponse, HttpResponseForbidden, JsonResponse
from django.forms.models import model_to_dict

from . import models, serializers
from ..paginations import UnlimitedPagination
from ..permissions import IsFGOrReadOnly, IsFG


class JobViewSet(viewsets.ModelViewSet):
    queryset = models.Job.objects.all()
    serializer_class = serializers.JobSerializer
    permission_classes = [IsFGOrReadOnly]


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
    print(request.META)
    auth_header = request.META['HTTP_AUTHORIZATION']
    encoded_credentials = auth_header.split(' ')[1]
    decoded_credentials = base64.b64decode(
        encoded_credentials).decode("utf-8").split(':')
    username = decoded_credentials[0]
    password = decoded_credentials[1]
    user = authenticate(username=username, password=password)

    if user:
        if user.is_active:
            login(request, user)
            groups = []
            for g in user.groups.all():
                groups.append(g.name)
            return JsonResponse({"username": user.username, "groups": groups})
        else:
            return JsonResponse({"error": "User is inactive"}, status=403)
    else:
        sleep(1)
        return JsonResponse({"error": "User with username/password not found"}, status=403)
