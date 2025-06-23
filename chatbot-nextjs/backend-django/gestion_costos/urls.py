from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PlataformaViewSet, ConsumibleViewSet, ReactivoViewSet, CuantificacionViewSet, 
    CuantificacionConsumibleViewSet, BufferGelOligoViewSet, BGOConsumiblesViewSet, ProcesoViewSet, 
    ProcesoMaterialViewSet, ServicioViewSet, ServicioProcesoViewSet, ControlCambiosViewSet, obtener_cotizaciones, guardar_cotizacion
)

# Creación de rutas usando `DefaultRouter`
router = DefaultRouter()
router.register(r'plataformas', PlataformaViewSet)
router.register(r'consumibles', ConsumibleViewSet)
router.register(r'reactivos', ReactivoViewSet)
router.register(r'cuantificaciones', CuantificacionViewSet)
router.register(r'cuantificacion-consumibles', CuantificacionConsumibleViewSet)
router.register(r'buffers-geles-oligos', BufferGelOligoViewSet)
router.register(r'bgo-consumibles', BGOConsumiblesViewSet)
router.register(r'procesos', ProcesoViewSet)
router.register(r'procesos-materiales', ProcesoMaterialViewSet)
router.register(r'servicios', ServicioViewSet)
router.register(r'servicios-procesos', ServicioProcesoViewSet)
router.register(r'control-cambios', ControlCambiosViewSet) 

# URLs del proyecto
urlpatterns = [
    path('', include(router.urls)),
    path('cotizaciones/', obtener_cotizaciones, name='obtener_cotizaciones'),
    path('guardar-cotizacion/', guardar_cotizacion, name='guardar_cotizacion'),
]