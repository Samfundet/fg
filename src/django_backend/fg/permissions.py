from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.compat import is_authenticated
import _itkacl as itkacl
import logging
from logging.handlers import SysLogHandler

class IsFGOrReadOnly(BasePermission):

    """Object-level permission to only allow read-only operations."""

    def has_permission ( self, request, view ):
        user = request.user
        return itkacl.check('/web/fg', user.username)

class IsFgOrPostOnly(BasePermission):
    """Object-level permission to only allow post-only operations by anon users"""

    def has_permission ( self, request, view ):
        user = request.user
        return itkacl.check('/web/fg', user.username)

class IsFG(BasePermission):
    """Object level permission only allowing FG users"""

    def has_permission ( self, request, view ):
        user = request.user
        return itkacl.check('/web/fg', user.username)

class IsFgOrHusfolk(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""

    def has_permission ( self, request, view ):
        user = request.user
        return itkacl.check('/web/fg', user.username)

class IsFgOrHusfolkPostOnly(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""

    def has_permission ( self, request, view ):
        user = request.user
        return itkacl.check('/web/fg', user.username)
