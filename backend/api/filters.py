from django.db.models import QuerySet
from rest_framework import filters
from rest_framework.request import Request


class PrimaryKeyFilterBackend(filters.BaseFilterBackend):
    def filter_queryset(self, request: Request, queryset: QuerySet, view):
        ids = request.query_params.get("ids")
        if ids:
            ids = list(map(int, ids.split(",")))
            queryset = queryset.filter(id__in=ids)
        return queryset
