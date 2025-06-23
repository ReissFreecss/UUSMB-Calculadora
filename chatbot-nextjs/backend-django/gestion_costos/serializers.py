from rest_framework import serializers
from .models import (
    Plataforma, Consumible, Reactivo, Cuantificacion, CuantificacionConsumible, BufferGelOligo, 
    BGOConsumibles, Proceso, ProcesoMaterial, Servicio, ServicioProceso, ControlCambios
)

# Serializador de Plataformas
class PlataformaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plataforma
        fields = '__all__'

# Serializador de Consumibles
class ConsumibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Consumible
        fields = '__all__'

# Serializador de Reactivos
class ReactivoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reactivo
        fields = '__all__'

# Serializador de Cuantificaciones
class CuantificacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cuantificacion
        fields = '__all__'

# Serializador de Cuantificacion y Consumibles
class CuantificacionConsumibleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuantificacionConsumible
        fields = '__all__'

# Serializador de Buffers, Geles y Oligos
class BufferGelOligoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BufferGelOligo
        fields = '__all__'

# Serializador de BGOConsumibles
class BGOConsumiblesSerializer(serializers.ModelSerializer):
    class Meta:
        model = BGOConsumibles
        fields = '__all__'

# Serializador de Procesos
class ProcesoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Proceso
        fields = '__all__'

# Serializador de Materiales de Procesos
class ProcesoMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProcesoMaterial
        fields = '__all__'

# Serializador de Servicios
class ServicioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Servicio
        fields = '__all__'

# Serializador de Procesos dentro de Servicios
class ServicioProcesoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ServicioProceso
        fields = '__all__'

# Serializador Control Cambios
class ControlCambiosSerializer(serializers.ModelSerializer):
    class Meta:
        model = ControlCambios
        fields = '__all__'