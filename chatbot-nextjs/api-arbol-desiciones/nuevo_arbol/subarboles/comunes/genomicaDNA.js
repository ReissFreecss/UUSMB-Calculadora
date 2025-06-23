// comunes/genomicaDNA.js
module.exports = {
  costo_biblioteca: 100,
  pregunta: "Tipo de secuenciación",
  opciones: ["Resecuenciación", "Secuenciación de Novo"],
  siguientes_pasos: require("./tipoSecuenciacion")
};