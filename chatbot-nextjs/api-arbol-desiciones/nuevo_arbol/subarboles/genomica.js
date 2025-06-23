// subarboles/genomica.js
module.exports = {
  pregunta: "Tipo de biblioteca",
  opciones: ["DNA Genómico", "Amplicon"],
  siguientes_pasos: {
    "DNA Genómico": require("./comunes/genomicaDNA"),
    "Amplicon": require("./comunes/amplicon")
  }
};