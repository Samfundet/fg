from rest_framework.pagination import BasePagination, PageNumberPagination
from rest_framework.response import Response


class UnlimitedPagination(BasePagination):
    def paginate_queryset(self, queryset, request, view=None):
        pass

class UpgradedPageNumberPagination(PageNumberPagination):
    def get_paginated_response ( self, data ):
        return Response({
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': int(self.request.query_params.get('page', 1)), # Looks better to do in backend than in frontend
            'results': data,
        })
