from rest_framework import serializers
from . import models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    lookup_field = 'username'

    class Meta:
        model = models.User
        fields = [
            'username',
            'address',
            'zip_code',
            'city',
            'phone',
            'member_number',
            'opptaksaar',
            'gjengjobb1',
            'gjengjobb2',
            'gjengjobb3',
            'hjemmeside',
            'uker',
            'fg_kallenavn',
            'bilde',
            'aktiv_pang',
            'comments',
            'email',
            'first_name',
            'last_name',
        ]
