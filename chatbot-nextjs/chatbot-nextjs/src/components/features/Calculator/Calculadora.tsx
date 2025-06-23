// components/Calculadora.tsx
import { useState } from "react";
import DynamicSelect from "@/components/features/Calculator/components/DynamicSelect";
import { SelectChangeEvent } from "@mui/material/Select";
import { Box, Typography } from "@mui/material";

export default function Calculadora() {
  const [form, setForm] = useState({
    material_genetico_id: "",
    tipo_aplicacion_id: "",
    tipo_secuenciacion_id: "",
    // Agrega más campos si los necesitas
  });

  const handleChange = (e: SelectChangeEvent) => {
    const name = e.target.name as string;
    const value = e.target.value;

    setForm((prev) => ({
      ...prev,
      [name]: value,

      // Resetea campos dependientes cuando cambian los padres
      ...(name === "material_genetico_id" && {
        tipo_aplicacion_id: "",
        tipo_secuenciacion_id: "",
      }),
      ...(name === "tipo_aplicacion_id" && {
        tipo_secuenciacion_id: "",
      }),
    }));
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Calculadora de Secuenciación
      </Typography>

      {/* Select 1: Material genético (base para todo lo demás) */}
      <DynamicSelect
        label="Material Genético"
        name="material_genetico_id"
        endpoint="/api/opciones/material-genetico"
        dependencyValue={1} // Puedes cambiar esto si hay otro nivel superior
        value={form.material_genetico_id}
        onChange={handleChange}
      />

      {/* Select 2: Aplicación (dependiente del material genético) */}
      <DynamicSelect
        label="Aplicación"
        name="tipo_aplicacion_id"
        endpoint="/api/opciones/aplicacion-filtrada"
        dependencyValue={form.material_genetico_id}
        value={form.tipo_aplicacion_id}
        onChange={handleChange}
      />

      {/* Select 3: Tipo de Secuenciación (dependiente de la aplicación) */}
      <DynamicSelect
        label="Tipo de Secuenciación"
        name="tipo_secuenciacion_id"
        endpoint="/api/opciones/secuenciacion-filtrada"
        dependencyValue={form.tipo_aplicacion_id}
        value={form.tipo_secuenciacion_id}
        onChange={handleChange}
      />

      {/* Puedes continuar con más selects o lógica según sea necesario */}
      
    </Box>
  );
}
