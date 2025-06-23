// comunes/plataformasAmplicon.js
module.exports = {
  pregunta: "Tipo de secuenciación",
  opciones: ["Resecuenciación", "Secuenciación de Novo"],
  siguientes_pasos: {
    "Resecuenciación": require("./tipoOrganismoAmplicon"),
    "Secuenciación de Novo": require("./conocesOrganismoAmplicon")
  }
};