from rest_framework import serializers
from . import models


class UserSerializer(serializers.HyperlinkedModelSerializer):
    lookup_field = 'username'
    bilde = serializers.ImageField(required=False)



    # FIXME is ther a way to default set all to required false?

    class Meta:
        model = models.User
        fields = [
            'id',
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
