// subarboles/chipSec.js
module.exports = {
  pregunta: "Tipo de biblioteca",
  opciones: ["DNA Genómico"],
  siguientes_pasos: {
    "DNA Genómico": {
      costo_biblioteca: 100,
      pregunta: "Tipo de secuenciación",
      opciones: ["Resecuenciación", "Secuenciación de Novo"],
      siguientes_pasos:
      {
        "Resecuenciación": require("./comunes/tipoOrganismoChipsec"),
        "Secuenciación de Novo": require("./comunes/conocesOrganismoChipseq")
      }
    }
  }
};