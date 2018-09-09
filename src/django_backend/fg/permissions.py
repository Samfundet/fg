from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.compat import is_authenticated
import _itkacl as itkacl
import logging
from logging.handlers import SysLogHandler

class IsFGOrReadOnly(BasePermission):

    """Object-level permission to only allow read-only operations."""

    def has_permission ( self, request, view ):
        # HTTP Remote user is set as username@AD.SAMFUNDET.NO
        # remove @AD.SAMFUNDET.NO to make ITKACL happy
        user = request.META.get('HTTP_REMOTE_USER').split('@')[0]
        return itkacl.check('/web/fg', user)

class IsFgOrPostOnly(BasePermission):
    """Object-level permission to only allow post-only operations by anon users"""

    def has_permission ( self, request, view ):
        user = request.META.get('HTTP_REMOTE_USER').split('@')[0]
        return itkacl.check('/web/fg', request.META.get('REMOTE_USER'))

class IsFG(BasePermission):
    """Object level permission only allowing FG users"""

    def has_permission ( self, request, view ):
        user = request.META.get('HTTP_REMOTE_USER').split('@')[0]
        return itkacl.check('/web/fg', request.META.get('REMOTE_USER'))

class IsFgOrHusfolk(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""

    def has_permission ( self, request, view ):
        user = request.META.get('HTTP_REMOTE_USER').split('@')[0]
        return itkacl.check('/web/fg', request.META.get('REMOTE_USER'))

class IsFgOrHusfolkPostOnly(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""

    def has_permission ( self, request, view ):
        user = request.META.get('HTTP_REMOTE_USER').split('@')[0]
        return itkacl.check('/web/fg', request.META.get('REMOTE_USER'))
