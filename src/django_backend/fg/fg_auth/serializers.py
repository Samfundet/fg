from rest_framework import serializers
from . import models

class JobSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = models.Job
        fields = '__all__'


class UserSerializer(serializers.HyperlinkedModelSerializer):
    lookup_field = 'username'
    bilde = serializers.ImageField(required=False)

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
            'gjengjobber',
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
