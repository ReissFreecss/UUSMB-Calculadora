module.exports = {
  pregunta: "Tipo de organismo",
  opciones: ["Eucariote", "Procariote"],
  siguientes_pasos: {
    Eucariote: require("./plataformasChipsec"),
    Procariote: require("./plataformasChipsec")
  }
};
