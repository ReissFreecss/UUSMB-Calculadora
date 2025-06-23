// comunes/bioinfoProcariote.js
module.exports = {
  Sí: {
    costo_limpieza: 70,
    pregunta: "Servicio bioinformático",
    opciones: ["Análisis de Expresión Diferencial"],
    siguientes_pasos: require("./expresionDiferencial")
  },
  No: {
    pregunta: "Servicio bioinformático",
    opciones: ["Análisis de Expresión Diferencial"],
    siguientes_pasos: require("./expresionDiferencial")
  }
};