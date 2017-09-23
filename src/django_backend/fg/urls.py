from django.contrib import admin
from django.conf.urls import url, include
from rest_framework import routers
from .api import views as api_views
from .fg_auth import views as auth_views

router = routers.DefaultRouter()
# Auth
router.register(r'users', auth_views.UserViewSet)
# Api
router.register(r'tags', api_views.TagViewSet)
router.register(r'categories', api_views.CategoryViewSet)
router.register(r'mediums', api_views.MediaViewSet)
router.register(r'albums', api_views.AlbumViewSet)
router.register(r'places', api_views.PlaceViewSet)
router.register(r'security-levels', api_views.SecurityLevelViewSet)
router.register(r'photos', api_views.PhotoViewSet, base_name='photo')

urlpatterns = [
    # Admin page
    url(r'^api/admin/', admin.site.urls),
    # API endpoints
    url(r'^api/', include(router.urls)),
    url(r'^api/auth/', include('rest_framework.urls', namespace='rest_framework')),
    # APIVIEW endpoints
    url(r'^api/photos/latest-splash/', api_views.LatestSplashPhotoView.as_view(), name="latest-splash")
]
