// comunes/ampliconPCR2.js
module.exports = {
  pregunta: "Cuenta con secuencia:",
  opciones: ["Illumina", "Nanopore"],
  siguientes_pasos: {
    Illumina: {
      pregunta: "Tipo de amplicon PCR2",
    opciones: ["12S", "16S", "COI", "ITS", "TRNA-LEV", "18S", "28S"],
    siguientes_pasos: {
      "12S": require("./tipoSecAmplicon"),
      "16S": require("./tipoSecAmplicon"),
      "COI": require("./tipoSecAmplicon"),
      "ITS": require("./tipoSecAmplicon"),
      "TRNA-LEV": require("./tipoSecAmplicon"),
      "18S": require("./tipoSecAmplicon"),
      "28S": require("./tipoSecAmplicon")
    }
  },
    Nanopore: {
      pregunta: "Tipo de amplicon PCR2",
      opciones: ["12S", "16S", "COI", "ITS", "TRNA-LEV", "18S", "28S"],
      siguientes_pasos: {
        "12S": require("./tipoSecAmplicon"),
        "16S": require("./tipoSecAmplicon"),
        "COI": require("./tipoSecAmplicon"),
        "ITS": require("./tipoSecAmplicon"),
        "TRNA-LEV": require("./tipoSecAmplicon"),
        "18S": require("./tipoSecAmplicon"),
        "28S": require("./tipoSecAmplicon")
      }
    }
  }
};