// comunes/arnSmallRNA.js
module.exports = {
  costo_biblioteca: 300,
  pregunta: "Tipo de plataforma",
  opciones: ["Illumina"],
  siguientes_pasos: {
    Illumina: {
      costo_secuenciacion: 500,
      pregunta: "Opción",
      opciones: ["NEXT SEQ 500"],
      mensaje: "Este es el final del flujo. Descarga la cotización.",
    }
  }
};