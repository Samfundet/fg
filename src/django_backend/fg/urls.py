from django.contrib import admin
from django.conf.urls import url, include
from rest_framework import routers
from .api import views

router = routers.DefaultRouter()
router.register(r'users', views.UserViewSet)
router.register(r'groups', views.GroupViewSet)
router.register(r'tags', views.TagViewSet)
router.register(r'categories', views.CategoryViewSet)
router.register(r'mediums', views.MediaViewSet)
router.register(r'albums', views.AlbumViewSet)
router.register(r'places', views.PlaceViewSet)
router.register(r'images', views.ImageViewSet)

urlpatterns = [
    # Admin page
    url(r'^api/admin/', admin.site.urls),
    # API endpoints
    url(r'^api/', include(router.urls)),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework'))
]
