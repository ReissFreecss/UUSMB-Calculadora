// comunes/conocesOrganismo.js
module.exports = {
  pregunta: "¿Conoces el organismo?",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    "Sí": require("./tipoOrganismoAmplicon"),
    "No": require("./plataformasGenomicaIllumina")
  }
};