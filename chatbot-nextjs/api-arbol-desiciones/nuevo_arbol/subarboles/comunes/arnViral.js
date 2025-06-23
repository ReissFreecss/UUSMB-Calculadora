
// comunes/arnViral.js
module.exports = {
  costo_biblioteca: 500, 
  pregunta: "Tipo de plataforma",
  opciones: ["Illumina"],
  siguientes_pasos: {
    Illumina: {
      costo_secuenciacion: 500,
      pregunta: "Opción",
      opciones: ["NEXT SEQ 500", "ISEQ"],
      mensaje:  "Este es el final del flujo. Descarga la cotización."
    }
  }
};