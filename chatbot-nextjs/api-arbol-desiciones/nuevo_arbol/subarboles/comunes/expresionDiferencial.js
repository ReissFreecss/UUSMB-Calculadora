// comunes/expresionDiferencial.js
module.exports = {
  "Análisis de Expresión Diferencial": {
    costo_analisis_bioinformatico: 200,
    pregunta: "Plataforma",
    opciones: ["Illumina"],
    siguientes_pasos: {
      Illumina: {
        costo_secuenciacion: 500,
        pregunta: "Opción",
        opciones: ["NEXT SEQ 500"],
        siguientes_pasos: {
          mensaje: "Este es el final del flujo. Descarga la cotización.",
        }
      }
    }
  }
};