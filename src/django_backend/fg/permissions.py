from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsFGOrReadOnly(BasePermission):
    """
    Object-level permission to only allow read-only operations.
    """
    message = "You must be in the FG group in order to edit this item."

    def has_permission(self, request, view):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in SAFE_METHODS:
            return True

        return request.user and request.user.is_authenticated and (
            request.user.groups.filter(name="FG").exists()
            or
            request.user.is_superuser
        )


class IsFgOrPostOnly(BasePermission):
    """
    Object-level permission to only allow post-only operations by anon users
    """

    def has_permission(self, request, view):
        if request.method == 'POST':
            return True

        return request.user and request.user.is_authenticated and (
            request.user.groups.filter(name="FG").exists()
            or
            request.user.is_superuser
        )


class IsFG(BasePermission):
    """Object level permission only allowing FG users"""
    message = "You must be in the FG group in order to see this item."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.groups.filter(name="FG").exists()
            or
            request.user.is_superuser
        )


class IsFgOrHusfolk(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""
    message = "You must be in the FG or HUSFOLK group in order to see this item."

    def has_permission(self, request, view):
        return request.user and request.user.is_authenticated and (
            request.user.groups.filter(
                name__in=['FG', 'HUSFOLK', 'POWER']).exists()
            or request.user.is_superuser
        )


class IsFgOrHusfolkPostOnly(BasePermission):
    """Object level permission only allowing FG users and Husfolk users"""
    message = "You must be in the FG or HUSFOLK group in order to Post, only FG can get"

    def has_permission(self, request, view):
        return (request.user and request.user.is_authenticated
                and (
                    (request.user.groups.filter(name__in=[
                     'HUSFOLK', 'POWER']).exists() and request.method == 'POST')
                    or request.user.groups.filter(name='FG').exists()))
