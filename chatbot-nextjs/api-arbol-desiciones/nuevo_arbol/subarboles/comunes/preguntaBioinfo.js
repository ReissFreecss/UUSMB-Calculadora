// comunes/preguntaBioinfo.js
module.exports = {
  pregunta: "¿Requiere análisis bioinformático?",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    "Sí": {
      mensaje: "Este es el final del flujo. Descarga la cotización.",
      costo_analisis_bioinformatico: 500,
    },
    "No": {
      mensaje: "Este es el final del flujo. Descarga la cotización."
    }
  }
};