import pandas as pd
import math
import os
import django

# Configurar entorno Django
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from gestion_costos.models import Reactivo, Plataforma

# Eliminar todos los registros previos
Reactivo.objects.all().delete()
print("✔ Todos los registros han sido eliminados.")

# Cargar el archivo CSV
df = pd.read_csv("data_excel/reactivos_limpio.csv")

# Mapeo de ID de plataforma a nombre
PLATAFORMA_MAP = {
    1: "ILLUMINA",
    2: "NANOPORE",
    3: "AMBAS"
}

def safe_float(value, field_name, row_index):
    try:
        f = float(value)
        if math.isnan(f):
            print(f"⚠️ Valor NaN en '{field_name}' (fila {row_index}). Se usará 0.")
            return 0
        return f
    except (ValueError, TypeError):
        print(f"⚠️ Valor vacío o inválido en '{field_name}' (fila {row_index}). Se usará 0.")
        return 0

# Iterar sobre cada fila del DataFrame
for index, row in df.iterrows():
    nombre = str(row.get("nombre", "")).strip()
    presentacion = str(row.get("presentacion", "")).strip()
    precio_presentacion_iva = safe_float(row.get("precio_presentacion_iva", 0), "precio_presentacion_iva", index)
    precio_unitario = safe_float(row.get("precio_unitario", 0), "precio_unitario", index)

    plataforma = None
    plataforma_id = row.get("plataforma")

    try:
        plataforma_id = int(plataforma_id)
        nombre_plataforma = PLATAFORMA_MAP.get(plataforma_id)
        if nombre_plataforma:
            plataforma = Plataforma.objects.get(nombre=nombre_plataforma)
        else:
            print(f"⚠️ Plataforma desconocida con ID '{plataforma_id}' en fila {index}")
    except (ValueError, TypeError):
        print(f"⚠️ Plataforma inválida en fila {index}")

    try:
        consumible = Reactivo.objects.create(
            nombre=nombre,
            presentacion=presentacion,
            precio_presentacion_iva=precio_presentacion_iva,
            precio_unitario=precio_unitario,
            plataforma=plataforma
        )
        print(f"✅ Reactivo '{nombre}' creado (ID: {consumible.id})")
    except Exception as e:
        print(f"❌ Error al crear reactivo '{nombre}' en fila {index}: {e}")
