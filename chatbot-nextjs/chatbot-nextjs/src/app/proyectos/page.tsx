"use client";

import { useEffect, useState } from "react";

interface Cotizacion {
  id: number;
  tipo_usuario: string;
  respuestas: any[];
  costo_total: number;
  fecha_creacion: string;
}

export default function Proyectos() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/costos/cotizaciones/");
        const text = await res.text(); // Verificar el contenido antes de convertirlo a JSON

        console.log("Respuesta sin procesar:", text);

        const data = JSON.parse(text); // Convertir a JSON solo si es válido
        setCotizaciones(data);
      } catch (error) {
        console.error("Error al obtener cotizaciones:", error);
      }
    };

    fetchCotizaciones();
  }, []);

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Proyectos</h2>

      {cotizaciones.length === 0 ? (
        <p>No hay cotizaciones registradas.</p>
      ) : (
        cotizaciones.map((cotizacion) => (
          <div key={cotizacion.id} className="border p-4 mb-4 bg-gray-100">
            <p>
              <strong>Tipo de Usuario:</strong> {cotizacion.tipo_usuario}
            </p>
            <p>
              <strong>Costo Total:</strong> ${cotizacion.costo_total}
            </p>
            <p>
              <strong>Fecha de Creación:</strong>{" "}
              {new Date(cotizacion.fecha_creacion).toLocaleString()}
            </p>
            <strong>Respuestas:</strong>
            <ul className="list-disc pl-5">
              {cotizacion.respuestas.map((resp, index) => (
                <li key={index}>
                  {resp.pregunta}: {resp.respuesta}
                  {resp.costo > 0 ? ` ($${resp.costo})` : ""}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}