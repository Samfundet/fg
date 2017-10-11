from rest_framework import authentication
from rest_framework import viewsets
from rest_framework import exceptions
from . import models, serializers
from django.contrib.auth import get_user_model
from ..permissions import IsFGOrReadOnly


class UserViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows users to be viewed or edited.
    """
    queryset = models.User.objects.all().order_by('-date_joined')
    serializer_class = serializers.UserSerializer
    permission_classes = [IsFGOrReadOnly]


class KerberosAuthentication(authentication.BaseAuthentication):
    User = get_user_model()

    def authenticate(self, request):
        username = request.META.get('REMOTE_USER') or request.META.get('HTTP_REMOTE_USER')
        if not username:
            return None

        try:
            user = self.User.objects.get(username=username)
        except self.User.DoesNotExist:
            raise exceptions.AuthenticationFailed('No such user')

        return (user, None)
