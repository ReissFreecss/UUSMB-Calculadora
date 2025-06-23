// subarboles/metagenomica.js
module.exports = {
  pregunta: "Tipo de biblioteca",
  opciones: ["DNA Genómico", "Amplicon"],
  siguientes_pasos: {
    "DNA Genómico": require("./comunes/metagenomicaDNA"),
    "Amplicon": require("./comunes/amplicon")
  }
};