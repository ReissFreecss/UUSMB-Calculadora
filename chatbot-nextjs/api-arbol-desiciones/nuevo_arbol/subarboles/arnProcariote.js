// subarboles/arnProcariote.js
module.exports = {
  pregunta: "Tipo de biblioteca",
  opciones: ["Small RNA", "mRNA"],
  siguientes_pasos: {
    "Small RNA": require("./comunes/arnSmallRNA"),
    "mRNA": require("./comunes/arnmRNAProcariote")
  }
};