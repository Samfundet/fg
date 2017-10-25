from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from django.contrib.auth import authenticate, login

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


class LoginViewSet(APIView):
    permission_classes = [AllowAny]
    # TODO


def login_samfundet_user(request):
    # state = ""
    user = None
    if not request.user.is_anonymous:
        user = request.user
    else:
        try:
            username = request.META.get(
                'REMOTE_USER') or request.META.get('HTTP_REMOTE_USER')
            user = authenticate(remote_user=username)
        except KeyError:
            pass
    if user is not None and user.is_active:
        login(request, user)
        return Response('All good!')
        # if request.GET.get('next'):
        #     return redirect(request.GET.get('next'))

    return Response('Very bad!')


def login_user(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(username=username, password=password)
        if user and user.is_active:
            login(request, user)
            return Response(True)

            # if request.GET.get('next'):
            #     return Response(True)
            #     # return redirect(request.GET.get('next'))
            # else:
            #     return Response(False)
            # return redirect(reverse('fg.apps.archive.views.home'))
            # return render(request, 'registration/login.html', {'state': state})
