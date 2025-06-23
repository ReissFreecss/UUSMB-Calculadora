"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

interface Paso {
  node: any;
  pregunta: string;
  opciones: string[];
  respuesta?: string;
}

export default function Formulario() {
  // Estados del formulario
  const [tipoUsuario, setTipoUsuario] = useState<string>("");
  const [datosArbol, setDatosArbol] = useState<any>(null);
  const [historialPreguntas, setHistorialPreguntas] = useState<Paso[]>([]);
  const [costoEstimado, setCostoEstimado] = useState<number>(0);
  const [iva, setIva] = useState<number>(0);
  const [costoTotal, setCostoTotal] = useState<number>(0);
  const [servicios, setServicios] = useState<{ etiqueta: string; costo: number }[]>([]);
  const [numMuestras, setNumMuestras] = useState<number>(1);

  // Función para calcular el costo, aplicando el multiplicador a biblioteca y secuenciación
  const calcularCosto = (nodo: any): number =>
    (nodo?.costo_extraccion ?? 0) +
    (nodo?.costo_analisis_calidad ?? 0) +
    ((nodo?.costo_biblioteca ?? 0) * numMuestras) +
    (nodo?.costo_limpieza ?? 0) +
    (nodo?.costo_analisis_bioinformatico ?? 0) +
    ((nodo?.costo_secuenciacion ?? 0) * numMuestras) +
    (nodo?.costo_bioinfo ?? 0);

  // Obtiene el árbol de decisiones
  useEffect(() => {
    fetch("http://localhost:5000/api/arbol")
      .then((r) => r.json())
      .then((data) => {
        const inicio = data.inicio;
        setDatosArbol(inicio);
        setHistorialPreguntas([
          { node: inicio, pregunta: inicio.pregunta, opciones: inicio.opciones },
        ]);
      })
      .catch((err) => console.error(err));
  }, []);

  // Suma el costo al total y recalcula IVA y Total
  const sumarCosto = (delta: number) => {
    const nuevoSubtotal = costoEstimado + delta;
    const nuevoIva = tipoUsuario === "Externo UNAM" ? nuevoSubtotal * 0.16 : 0;
    setCostoEstimado(nuevoSubtotal);
    setIva(nuevoIva);
    setCostoTotal(nuevoSubtotal + nuevoIva);
  };

  // Maneja la selección de cada pregunta
  const manejarCambio = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
    const seleccion = e.target.value;
    if (!seleccion) return;

    // Actualiza la respuesta del paso actual
    const pasosActualizados = [...historialPreguntas];
    pasosActualizados[index] = {
      ...pasosActualizados[index],
      respuesta: seleccion,
    };

    const nodoActual = pasosActualizados[index].node;
    const siguienteNodo = nodoActual.siguientes_pasos?.[seleccion];

    if (siguienteNodo) {
      // Calcula el costo generado por la respuesta seleccionada,
      // multiplicando por numMuestras en costo_biblioteca y costo_secuenciacion
      const costoNuevo = calcularCosto(siguienteNodo);

      if (costoNuevo > 0) {
        // Guarda como "servicio" la pregunta contestada y la opción seleccionada
        setServicios((prev) => [
          ...prev,
          {
            etiqueta: `${pasosActualizados[index].pregunta} → ${seleccion}`,
            costo: costoNuevo,
          },
        ]);
        sumarCosto(costoNuevo);
      }

      // Agrega la siguiente pregunta o mensaje al historial
      if (siguienteNodo.pregunta && Array.isArray(siguienteNodo.opciones)) {
        pasosActualizados.splice(index + 1); // descarta ramificación anterior
        pasosActualizados.push({
          node: siguienteNodo,
          pregunta: siguienteNodo.pregunta,
          opciones: siguienteNodo.opciones,
        });
      } else if (siguienteNodo.mensaje) {
        pasosActualizados.splice(index + 1);
        pasosActualizados.push({
          node: siguienteNodo,
          pregunta: siguienteNodo.mensaje,
          opciones: [],
        });
      }
    }

    setHistorialPreguntas(pasosActualizados);
  };

  // Reinicia el formulario
  const reiniciarFormulario = () => {
    if (!datosArbol) return;
    setTipoUsuario("");
    setHistorialPreguntas([
      { node: datosArbol, pregunta: datosArbol.pregunta, opciones: datosArbol.opciones },
    ]);
    setServicios([]);
    setCostoEstimado(0);
    setIva(0);
    setCostoTotal(0);
    setNumMuestras(1);
  };

  // Guarda la cotización en el backend enviando todas las respuestas
  const enviarCotizacion = async () => {
    await fetch("http://127.0.0.1:8000/costos/guardar-cotizacion/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        tipo_usuario: tipoUsuario,
        respuestas: historialPreguntas.map((paso) => ({
          pregunta: paso.pregunta,
          respuesta: paso.respuesta || "",
          // Se busca en los servicios el costo asociado a la pregunta; si no hay, se envía 0.
          costo: servicios.find((s) => s.etiqueta.includes(paso.pregunta))?.costo || 0,
        })),
      }),
    }).catch((err) => console.error(err));
  };

  // Genera el PDF mostrando solo los servicios con costo > 0
  const generarPDF = async () => {
    await enviarCotizacion();

    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.text("Cotización de Servicios", 20, 20);
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text(`Tipo de Usuario: ${tipoUsuario}`, 20, 30);

    let y = 45;
    // Se muestran únicamente los servicios que tengan costo mayor a 0
    servicios
      .filter((s) => s.costo > 0)
      .forEach((s) => {
        doc.text(`${s.etiqueta}: $${s.costo}`, 20, y);
        y += 8;
      });

    y += 4;
    doc.text(`Subtotal: $${costoEstimado}`, 20, y);
    doc.text(`IVA: $${iva}`, 20, y + 8);
    doc.text(`Total: $${costoTotal}`, 20, y + 16);

    doc.save("cotizacion.pdf");
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-gray-100 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Formulario para cotización</h2>

      {/* Tipo de Usuario */}
      <div className="mb-4">
        <label className="block font-bold">Tipo de Usuario</label>
        <select
          className="w-full p-2 border"
          value={tipoUsuario}
          onChange={(e) => setTipoUsuario(e.target.value)}
        >
          <option value="">Selecciona...</option>
          <option value="Interno UNAM">Interno UNAM</option>
          <option value="Externo UNAM">Externo UNAM</option>
        </select>
      </div>


      {/* Mostrar árbol de decisiones */}
      {historialPreguntas.map((paso, idx) => (
        <div key={idx} className="mb-4">
          <label className="block font-bold">
            {paso.pregunta}
            {paso.respuesta && ` (seleccionado: ${paso.respuesta})`}
          </label>
          {paso.opciones.length ? (
            <select
              className="w-full p-2 border"
              disabled={!tipoUsuario}
              value={paso.respuesta || ""}
              onChange={(e) => manejarCambio(e, idx)}
            >
              <option value="">Selecciona...</option>
              {paso.opciones.map((op) => (
                <option key={op} value={op}>
                  {op}
                </option>
              ))}
            </select>
          ) : (
            <p className="italic text-green-700 mt-1">{paso.pregunta}</p>
          )}
        </div>
      ))}


      {/* Selección de número de muestras */}
      <div className="mb-4">
        <label className="block font-bold">Número de muestras</label>
        <input
          type="number"
          className="w-full p-2 border"
          value={numMuestras}
          min={1}
          onChange={(e) => {
            // Siempre se establece el valor mínimo a 1.
            const value = parseInt(e.target.value, 10);
            setNumMuestras(value >= 1 ? value : 1);
          }}
          onKeyDown={(e) => {
            // Permite únicamente las flechitas para incrementar o decrementar.
            if (e.key !== "ArrowUp" && e.key !== "ArrowDown") {
              e.preventDefault();
            }
          }}
        />
      </div>


      {/* Desglose de totales */}
      <div className="bg-white p-3 border">
        <p>
          <strong>Subtotal:</strong> ${costoEstimado}
        </p>
        <p>
          <strong>IVA:</strong> ${iva}
        </p>
        <p>
          <strong>Total:</strong> ${costoTotal}
        </p>
      </div>

      <button
        onClick={generarPDF}
        disabled={!tipoUsuario}
        className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
      >
        Generar PDF
      </button>

      <button
        onClick={reiniciarFormulario}
        className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
      >
        Reiniciar
      </button>
    </div>
  );
}