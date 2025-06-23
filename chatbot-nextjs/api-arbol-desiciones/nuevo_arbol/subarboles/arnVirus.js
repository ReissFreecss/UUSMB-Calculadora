// subarboles/arnVirus.js
module.exports = {
  pregunta: "Tipo de biblioteca",
  opciones: ["RNA Viral"],
  siguientes_pasos: {
    "RNA Viral": require("./comunes/arnViral")
  }
};