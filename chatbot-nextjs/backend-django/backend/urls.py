from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('costos/', include('gestion_costos.urls')),  # Cambio de `api/` a `costos/`
    path('users/', include('users.urls')),
]