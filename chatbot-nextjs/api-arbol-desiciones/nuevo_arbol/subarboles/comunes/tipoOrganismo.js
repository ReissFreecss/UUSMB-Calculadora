// comunes/tipoOrganismo.js
module.exports = {
  pregunta: "Tipo de organismo",
  opciones: ["Eucariote", "Procariote", "Virus"],
  siguientes_pasos: {
    Eucariote: require("./plataformasGenomicaIllumina"),
    Procariote: require("./plataformasGenomicaIllumina"),
    Virus: require("./plataformasGenomicaIllumina")
  }
};