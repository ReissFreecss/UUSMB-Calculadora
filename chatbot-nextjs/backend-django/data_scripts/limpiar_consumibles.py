import pandas as pd

def importar_consumibles(ruta_archivo):
    # Cargar el archivo CSV original
    df = pd.read_csv("data_excel/consumibles.csv")

    # Columnas que deben convertirse de texto a número
    columnas_a_convertir = ['presentacion', 'rxn', 'precio', 'precio_unitario']

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
    archivo_csv = "consumibles.csv"  # Cambia si tu archivo tiene otro nombre
    df = importar_consumibles(archivo_csv)

    # Guardar el DataFrame limpio como un nuevo archivo CSV
    df.to_csv("consumibles_limpio.csv", index=False)

    print("✔ Datos cargados y limpiados con éxito.")
    print("✔ Archivo guardado como 'consumibles_limpio.csv'\n")
    print("Primeros registros:")
    print(df.head())
