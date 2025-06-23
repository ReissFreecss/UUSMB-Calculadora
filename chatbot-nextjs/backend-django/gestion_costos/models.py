from django.db import models
from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver
from django.utils.timezone import now
import json

# Modelo de Plataformas
class Plataforma(models.Model):
    nombre = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.nombre

# Modelo de Consumibles
class Consumible(models.Model):
    nombre = models.CharField(max_length=255)
    tipo = models.CharField(max_length=100, blank=True, null=True)
    presentacion = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    unidad_medida = models.CharField(max_length=50, blank=True, null=True)
    rxn = models.DecimalField(max_digits=10, decimal_places=2, blank=True, null=True)
    precio_presentacion_iva = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    plataforma = models.ForeignKey(Plataforma, on_delete=models.CASCADE, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre

# Modelo de Reactivos
class Reactivo(models.Model):
    nombre = models.CharField(max_length=255)
    presentacion = models.CharField(max_length=100, blank=True, null=True)
    precio_presentacion_iva = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    precio_unitario = models.DecimalField(max_digits=10, decimal_places=2, )
    plataforma = models.ForeignKey(Plataforma, on_delete=models.CASCADE, blank=True, null=True)
    fecha_actualizacion = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.nombre










# Modelo de Cuantificaciones
class Cuantificacion(models.Model):
    nombre = models.CharField(max_length=255)
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    plataforma = models.ForeignKey('Plataforma', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.nombre

    def actualizar_costo(self):
        """Actualiza el costo total sumando los costos de los CuantificacionConsumibles relacionados."""
        total = CuantificacionConsumible.objects.filter(cuantificacion=self).aggregate(total=models.Sum('costo'))['total'] or 0
        self.costo = total
        self.save()

# Modelo de Cuantificacion Consumibles
class CuantificacionConsumible(models.Model):
    cuantificacion = models.ForeignKey(Cuantificacion, on_delete=models.CASCADE)
    consumible = models.ForeignKey('Consumible', on_delete=models.CASCADE)
    reactivo = models.ForeignKey('Reactivo', on_delete=models.CASCADE, blank=True, null=True)
    buffer_gel_oligo = models.ForeignKey('BufferGelOligo', on_delete=models.CASCADE, blank=True, null=True)

    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    costo = models.DecimalField(max_digits=10, decimal_places=2, editable=False)  # Se calcula automáticamente

    def save(self, *args, **kwargs):
        """Calcula el costo basado en el precio unitario del consumible o reactivo antes de guardar."""
        precio_unitario = 0

        if self.consumible:
            precio_unitario = self.consumible.precio_unitario  # Ajusta según el modelo Consumible
        elif self.reactivo:
            precio_unitario = self.reactivo.precio_unitario  # Ajusta según el modelo Reactivo

        self.costo = precio_unitario * self.cantidad
        super().save(*args, **kwargs)

        # Asegurar actualización en Cuantificacion
        if self.cuantificacion:
            self.cuantificacion.actualizar_costo()

    def __str__(self):
        return f"{self.cuantificacion.nombre} - {self.consumible.nombre if self.consumible else self.reactivo.nombre}"

# Señales para actualizar costo en Cuantificacion al guardar o eliminar un CuantificacionConsumible
@receiver(post_save, sender=CuantificacionConsumible)
@receiver(post_delete, sender=CuantificacionConsumible)
def actualizar_costo_cuantificacion(sender, instance, **kwargs):
    if instance.cuantificacion:
        instance.cuantificacion.actualizar_costo()









# Modelo de Buffers, Geles y Oligos
class BufferGelOligo(models.Model):
    nombre = models.CharField(max_length=255)
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    plataforma = models.ForeignKey(Plataforma, on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.nombre

    def actualizar_costo(self):
        """Actualiza el costo total sumando los costos de los BGOConsumibles relacionados."""
        total = BGOConsumibles.objects.filter(bgo=self).aggregate(total=models.Sum('costo'))['total'] or 0
        self.costo = total
        self.save()

# Relación entre Buffers, Geles, Oligos y Consumibles
class BGOConsumibles(models.Model):
    bgo = models.ForeignKey(BufferGelOligo, on_delete=models.CASCADE)

    consumible = models.ForeignKey(Consumible, on_delete=models.CASCADE, blank=True, null=True)
    reactivo = models.ForeignKey(Reactivo, on_delete=models.CASCADE, blank=True, null=True)
    cuantificacion = models.ForeignKey(Cuantificacion, on_delete=models.CASCADE, blank=True, null=True)

    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    costo = models.DecimalField(max_digits=10, decimal_places=2, editable=False)  # Se calcula automáticamente

    def save(self, *args, **kwargs):
        """Calcula el costo basado en el precio unitario del consumible o reactivo antes de guardar."""
        precio_unitario = 0

        if self.consumible:
            precio_unitario = self.consumible.precio_unitario  # Ajusta según el modelo Consumible
        elif self.reactivo:
            precio_unitario = self.reactivo.precio_unitario  # Ajusta según el modelo Reactivo

        self.costo = precio_unitario * self.cantidad
        super().save(*args, **kwargs)

        # Asegurar actualización en BufferGelOligo
        if self.bgo:
            self.bgo.actualizar_costo()

    def __str__(self):
        return f"{self.bgo.nombre} - {self.consumible.nombre if self.consumible else self.reactivo.nombre}"

# Señales para actualizar costo en BufferGelOligo al guardar o eliminar un BGOConsumibles
@receiver(post_save, sender=BGOConsumibles)
@receiver(post_delete, sender=BGOConsumibles)
def actualizar_costo_bgo(sender, instance, **kwargs):
    if instance.bgo:
        instance.bgo.actualizar_costo()












# Modelo de Procesos
class Proceso(models.Model):
    nombre = models.CharField(max_length=255)
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    plataforma = models.ForeignKey('Plataforma', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.nombre

    def actualizar_costo(self):
        """Calcula y actualiza el costo total sumando los materiales y los costos de Cuantificacion y BufferGelOligo."""
        total_materiales = ProcesoMaterial.objects.filter(proceso=self).aggregate(total=models.Sum('costo'))['total'] or 0
        total_cuantificacion = Cuantificacion.objects.filter(procesomaterial__proceso=self).aggregate(total=models.Sum('costo'))['total'] or 0
        total_buffer_gel_oligo = BufferGelOligo.objects.filter(procesomaterial__proceso=self).aggregate(total=models.Sum('costo'))['total'] or 0

        self.costo = total_materiales + total_cuantificacion + total_buffer_gel_oligo
        self.save()

# Tabla intermedia para materiales en procesos
class ProcesoMaterial(models.Model):
    proceso = models.ForeignKey(Proceso, on_delete=models.CASCADE)

    # Relaciones opcionales con cada tipo de material
    consumible = models.ForeignKey('Consumible', on_delete=models.CASCADE, blank=True, null=True)
    reactivo = models.ForeignKey('Reactivo', on_delete=models.CASCADE, blank=True, null=True)
    cuantificacion = models.ForeignKey('Cuantificacion', on_delete=models.CASCADE, blank=True, null=True)
    buffer_gel_oligo = models.ForeignKey('BufferGelOligo', on_delete=models.CASCADE, blank=True, null=True)

    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    costo = models.DecimalField(max_digits=10, decimal_places=2, editable=False)  # Se calcula automáticamente

    def save(self, *args, **kwargs):
        """Calcula el costo basado en el precio unitario de los materiales antes de guardar."""
        precio_unitario = 0

        if self.consumible:
            precio_unitario = self.consumible.precio_unitario
        elif self.reactivo:
            precio_unitario = self.reactivo.precio_unitario
        elif self.cuantificacion:
            precio_unitario = self.cuantificacion.costo
        elif self.buffer_gel_oligo:
            precio_unitario = self.buffer_gel_oligo.costo

        self.costo = precio_unitario * self.cantidad
        super().save(*args, **kwargs)

        # Asegurar actualización en Proceso
        if self.proceso:
            self.proceso.actualizar_costo()

    def __str__(self):
        return f"{self.proceso.nombre} - {self.consumible.nombre if self.consumible else (self.reactivo.nombre if self.reactivo else (self.cuantificacion.nombre if self.cuantificacion else self.buffer_gel_oligo.nombre))}"

# Señales para actualizar automáticamente el costo en Proceso
@receiver(post_save, sender=ProcesoMaterial)
@receiver(post_delete, sender=ProcesoMaterial)
def actualizar_costo_proceso(sender, instance, **kwargs):
    if instance.proceso:
        instance.proceso.actualizar_costo()















# Modelo de Servicios
class Servicio(models.Model):
    nombre = models.CharField(max_length=255)
    costo = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    plataforma = models.ForeignKey('Plataforma', on_delete=models.CASCADE, blank=True, null=True)

    def __str__(self):
        return self.nombre

    def actualizar_costo(self):
        """Calcula y actualiza automáticamente el costo total del servicio sumando los procesos asociados."""
        total_procesos = Proceso.objects.filter(servicioproceso__servicio=self).aggregate(total=models.Sum('costo'))['total'] or 0
        total_servicio_proceso = ServicioProceso.objects.filter(servicio=self).aggregate(total=models.Sum('costo'))['total'] or 0

        self.costo = total_procesos + total_servicio_proceso
        self.save()

# Relación entre Servicios y Procesos
class ServicioProceso(models.Model):
    servicio = models.ForeignKey(Servicio, on_delete=models.CASCADE)
    proceso = models.ForeignKey('Proceso', on_delete=models.CASCADE)

    cantidad = models.DecimalField(max_digits=10, decimal_places=2)
    costo = models.DecimalField(max_digits=10, decimal_places=2, editable=False)  # Se calcula automáticamente

    def save(self, *args, **kwargs):
        """Calcula el costo basado en el costo del proceso antes de guardar."""
        self.costo = self.proceso.costo * self.cantidad
        super().save(*args, **kwargs)

        # Asegurar actualización en Servicio
        if self.servicio:
            self.servicio.actualizar_costo()

    def __str__(self):
        return f"{self.servicio.nombre} - {self.proceso.nombre}"

# Señales para actualizar automáticamente el costo en `Servicio`
@receiver(post_save, sender=ServicioProceso)
@receiver(post_delete, sender=ServicioProceso)
def actualizar_costo_servicio(sender, instance, **kwargs):
    if instance.servicio:
        instance.servicio.actualizar_costo()









# Modelo de Kits de Reactivos
class KitReactivo(models.Model):
    plataforma = models.ForeignKey(Plataforma, on_delete=models.CASCADE)
    nombre = models.CharField(max_length=255)

# Modelo de Estadísticas de Kits
class EstadisticaKit(models.Model):
    kit = models.ForeignKey(KitReactivo, on_delete=models.CASCADE)
    reads = models.IntegerField()
    reads_promedio = models.DecimalField(max_digits=10, decimal_places=2)
    bibliotecas_pflowcel = models.IntegerField()

# Modelo de Costos de Kits
class CostoKit(models.Model):
    kit = models.ForeignKey(KitReactivo, on_delete=models.CASCADE)
    consumible = models.ForeignKey(Consumible, on_delete=models.CASCADE)
    precio_flowcell = models.DecimalField(max_digits=10, decimal_places=2)
    precio_ibt = models.DecimalField(max_digits=10, decimal_places=2)
    precio_secuenciacion = models.DecimalField(max_digits=10, decimal_places=2)
    costo_total = models.DecimalField(max_digits=10, decimal_places=2)
    utilidad = models.DecimalField(max_digits=10, decimal_places=2)












# Modelo de Control de Cambios
class ControlCambios(models.Model):
    fecha = models.DateTimeField(default=now)
    modificacion = models.TextField()
    usuario = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.fecha} - {self.usuario}"





# Modelo que almacena las respuestas del formulario en un solo registro
class Cotizacion(models.Model):
    tipo_usuario = models.CharField(max_length=50)
    respuestas = models.JSONField()  # Almacena todas las respuestas como JSON
    costo_total = models.FloatField(default=0)
    fecha_creacion = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Cotización {self.id} - {self.tipo_usuario}"