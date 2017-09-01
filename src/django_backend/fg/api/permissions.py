from rest_framework.permissions import BasePermission, SAFE_METHODS



class IsFGOrReadOnly(BasePermission):
    """
    Object-level permission to only allow read-only operations.
    """
    message = "You must be in the FG group in order to see or edit this item."
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        return request.user.groups.filter(name="FG").exists() or request.user.is_superuser

