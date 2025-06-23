// comunes/ampliconSinPCR1.js
module.exports = {
  pregunta: "Tipo de amplicon PCR1",
  opciones: ["12S", "16S", "COI", "ITS", "TRNA-LEV", "18S", "28S"],
  siguientes_pasos: {
    "12S": {
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
    "16S": {
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
    "COI": {
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
    "ITS": {
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
    "TRNA-LEV": {
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
    "18S": {
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
    "28S": {
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