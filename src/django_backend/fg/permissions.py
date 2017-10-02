from rest_framework.permissions import BasePermission, SAFE_METHODS
from rest_framework.compat import is_authenticated


class IsFGOrReadOnly(BasePermission):
    """
    Object-level permission to only allow read-only operations.
    """
    message = "You must be in the FG group in order to see or edit this item."

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        return request.user and is_authenticated(request.user) and (
            request.user.groups.filter(name="FG").exists()
            or
            request.user.is_superuser
        )


class IsFG(BasePermission):
    def has_permission(self, request, view):
        return request.user and is_authenticated(request.user) and (
            request.user.groups.filter(name="FG").exists()
            or
            request.user.is_superuser
        )
