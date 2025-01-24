"""
URL configuration for pong project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.contrib import admin
from django.urls import path, include  # For defining routes and including app-specific URL configurations.
                                        #include(): Imports routes from individual apps to keep the structure modular.
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)  #Generate API schema and interactive documentation.

from django.conf import settings
from django.conf.urls.static import static  #Serves media files during development.

urlpatterns = [
    path("admin/", admin.site.urls),

    # TicTacToe app
    path("api/tictactoe/", include("tictactoe.urls")),
    # GameLog app
    path("api/", include("gamelog.urls")),
    # Users app
    path("api/", include("users.urls")),

    # API Schema and AutoDocs
    path("api/schema/", SpectacularAPIView.as_view(), name="api-schema"),
    path(
        "api/docs/", SpectacularSwaggerView.as_view(url_name="api-schema"), name="api-docs"
    ),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
