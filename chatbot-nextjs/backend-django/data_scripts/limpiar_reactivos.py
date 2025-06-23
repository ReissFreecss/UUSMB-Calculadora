import pandas as pd

def limpiar_reactivos(ruta_archivo):
    # Cargar el archivo CSV original
    df = pd.read_csv("data_excel/reactivos.csv")

    # Columnas que deben convertirse de texto a número
    columnas_a_convertir = ['presentacion', 'precio_presentacion_iva', 'precio_unitario']

    # Limpiar y convertir columnas
    for col in columnas_a_convertir:
        df[col] = (
            df[col]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.strip()
            .replace("nan", None)
        )
        df[col] = pd.to_numeric(df[col], errors='coerce')  # Convertir a float

    # Reemplazar valores faltantes con 0 (opcional)
    df.fillna(0, inplace=True)

    return df

if __name__ == "__main__":
    archivo_csv = "reactivos.csv"  # Cambia si tu archivo tiene otro nombre
    df = limpiar_reactivos(archivo_csv)

    # Guardar el DataFrame limpio como un nuevo archivo CSV
    df.to_csv("data_excel/reactivos_limpio.csv", index=False)

    print("✔ Datos cargados y limpiados con éxito.")
    print("✔ Archivo guardado como 'reactivos_limpio.csv'\n")
    print("Primeros registros:")
    print(df.head())
