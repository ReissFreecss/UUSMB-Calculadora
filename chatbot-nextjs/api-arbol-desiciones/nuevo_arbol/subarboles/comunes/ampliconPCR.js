const { costo_biblioteca } = require("./genomicaDNA");

// comunes/ampliconPCR.js
module.exports = {
  costo_biblioteca : 100,
  pregunta: "¿Tiene PCR1?",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    "Sí": require("./ampliconPCR2"),
    "No": require("./ampliconSinPCR1")
  }
};
