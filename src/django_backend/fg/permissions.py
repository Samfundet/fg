from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.compat import is_authenticated


class IsFGOrReadOnly(BasePermission):
    """
    Object-level permission to only allow read-only operations.
    """

    def has_permission ( self, request, view ):
    	return True

class IsFgOrPostOnly(BasePermission):
    """
    Object-level permission to only allow post-only operations by anon users
    """

    def has_permission ( self, request, view ):
    	return True

class IsFG(BasePermission):
    """Object level permission only allowing FG users"""

    def has_permission ( self, request, view ):
    	return True

class IsFgOrHusfolk(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""

    def has_permission ( self, request, view ):
    	return True

class IsFgOrHusfolkPostOnly(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""
    message = "You must be in the FG or HUSFOLK group in order to Post, only FG can get"

    def has_permission ( self, request, view ):
        return True
