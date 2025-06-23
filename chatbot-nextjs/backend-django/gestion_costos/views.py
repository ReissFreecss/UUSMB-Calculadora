from rest_framework import viewsets
from .models import (
    Plataforma, Consumible, Reactivo, Cuantificacion, CuantificacionConsumible, BufferGelOligo, 
    BGOConsumibles, Proceso, ProcesoMaterial, Servicio, ServicioProceso, ControlCambios, Cotizacion
)
from .serializers import (
    PlataformaSerializer, ConsumibleSerializer, ReactivoSerializer, CuantificacionSerializer, 
    CuantificacionConsumibleSerializer, BufferGelOligoSerializer, BGOConsumiblesSerializer, ProcesoSerializer, 
    ProcesoMaterialSerializer, ServicioSerializer, ServicioProcesoSerializer, ControlCambiosSerializer
)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json



# Vista para Plataformas
class PlataformaViewSet(viewsets.ModelViewSet):
    queryset = Plataforma.objects.all()
    serializer_class = PlataformaSerializer

# Vista para Consumibles
class ConsumibleViewSet(viewsets.ModelViewSet):
    queryset = Consumible.objects.all()
    serializer_class = ConsumibleSerializer

# Vista para Reactivos
class ReactivoViewSet(viewsets.ModelViewSet):
    queryset = Reactivo.objects.all()
    serializer_class = ReactivoSerializer

# Vista para Cuantificaciones
class CuantificacionViewSet(viewsets.ModelViewSet):
    queryset = Cuantificacion.objects.all()
    serializer_class = CuantificacionSerializer

# Vista para Cuantificacion y Consumibles
class CuantificacionConsumibleViewSet(viewsets.ModelViewSet):
    queryset = CuantificacionConsumible.objects.all()
    serializer_class = CuantificacionConsumibleSerializer

# Vista para Buffers, Geles y Oligos
class BufferGelOligoViewSet(viewsets.ModelViewSet):
    queryset = BufferGelOligo.objects.all()
    serializer_class = BufferGelOligoSerializer

# Vista para BGOConsumibles
class BGOConsumiblesViewSet(viewsets.ModelViewSet):
    queryset = BGOConsumibles.objects.all()
    serializer_class = BGOConsumiblesSerializer

# Vista para Procesos
class ProcesoViewSet(viewsets.ModelViewSet):
    queryset = Proceso.objects.all()
    serializer_class = ProcesoSerializer

# Vista para Materiales de Procesos
class ProcesoMaterialViewSet(viewsets.ModelViewSet):
    queryset = ProcesoMaterial.objects.all()
    serializer_class = ProcesoMaterialSerializer

# Vista para Servicios
class ServicioViewSet(viewsets.ModelViewSet):
    queryset = Servicio.objects.all()
    serializer_class = ServicioSerializer

# Vista para Procesos dentro de Servicios
class ServicioProcesoViewSet(viewsets.ModelViewSet):
    queryset = ServicioProceso.objects.all()
    serializer_class = ServicioProcesoSerializer

# Vista para Control de Cambios
class ControlCambiosViewSet(viewsets.ModelViewSet):
    queryset = ControlCambios.objects.all()
    serializer_class = ControlCambiosSerializer


# Vista para cotizacion con un registro por cotización

@csrf_exempt
def guardar_cotizacion(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            tipo_usuario = data.get("tipo_usuario", "")
            respuestas = data.get("respuestas", [])
            costo_total = sum([r.get("costo", 0) for r in respuestas])  # Sumar los costos

            nueva_cotizacion = Cotizacion.objects.create(
                tipo_usuario=tipo_usuario,
                respuestas=respuestas,
                costo_total=costo_total
            )

            return JsonResponse({"mensaje": "Cotización guardada correctamente", "id": nueva_cotizacion.id}, status=201)
        except Exception as e:
            print("Error al guardar la cotización:", e)
            return JsonResponse({"error": str(e)}, status=500)

    return JsonResponse({"error": "Método no permitido"}, status=405)


# Vista para obtener la cotización
def obtener_cotizaciones(request):
    cotizaciones = Cotizacion.objects.all().values()
    return JsonResponse(list(cotizaciones), safe=False)
