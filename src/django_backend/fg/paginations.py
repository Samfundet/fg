from rest_framework.pagination import BasePagination


class UnlimitedPagination(BasePagination):
    def paginate_queryset(self, queryset, request, view=None):
        pass
