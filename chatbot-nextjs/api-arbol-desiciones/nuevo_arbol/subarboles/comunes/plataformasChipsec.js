// comunes/plataformasGenomicaIllumina.js
module.exports = {
  pregunta: "Plataforma",
  opciones: ["Illumina"],
  siguientes_pasos: {
    Illumina: {
      costo_secuenciacion: 100,
      pregunta: "Opción",
      opciones: ["NEXT SEQ 500"],
      siguientes_pasos: {
        mensaje: "Este es el final del flujo. Descarga la cotización."
      }
    }
  }
};