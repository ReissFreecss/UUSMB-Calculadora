module.exports = {
  pregunta: "¿Conoces el organismo?",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    "Sí": require("./tipoOrganismoChipsec"),
    "No": require("./plataformasChipsec")
  }
};
