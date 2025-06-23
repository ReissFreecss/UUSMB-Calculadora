const express = require("express");
const router = express.Router();

const { pregunta, siguientes_pasos } = require("..");

const arbolDecisiones = {
  inicio: {
    pregunta: "Tipo de material genético",
    opciones: ["ADN", "ARN"],
    siguientes_pasos: {
      ADN: {
        pregunta: "¿Requiere extracción de ADN?",
        opciones: ["Sí", "No"],
        siguientes_pasos: {
          Sí: {
            costo_extraccion: 200,
            pregunta: "¿Requiere análisis de calidad?",
            opciones: ["Sí", "No"],
            siguientes_pasos: {
              Sí: {
                costo_analisis_calidad: 50,
                pregunta: "Tipo de aplicación",
                opciones: ["CHIPSEC", "GENOMICA", "METAGENOMICA"],
                siguientes_pasos: {
                  CHIPSEC: require("../nuevo_arbol/subarboles/chipSec"),
                  GENOMICA: require("../nuevo_arbol/subarboles/genomica"),
                  METAGENOMICA: require("../nuevo_arbol/subarboles/metagenomica")
                }
              },
              No: {
                pregunta: "Tipo de aplicación",
                opciones: ["CHIPSEC", "GENOMICA", "METAGENOMICA"],
                siguientes_pasos: {
                  CHIPSEC: require("../nuevo_arbol/subarboles/chipSec"),
                  GENOMICA: require("../nuevo_arbol/subarboles/genomica"),
                  METAGENOMICA: require("../nuevo_arbol/subarboles/metagenomica")
                }
              }
            }
          },
          No: {
            pregunta: "¿Requiere análisis de calidad?",
            opciones: ["Sí", "No"],
            siguientes_pasos: {
              Sí: {
                costo_analisis_calidad: 50,
                pregunta: "Tipo de aplicación",
                opciones: ["CHIPSEC", "GENOMICA", "METAGENOMICA"],
                siguientes_pasos: {
                  CHIPSEC: require("../nuevo_arbol/subarboles/chipSec"),
                  GENOMICA: require("../nuevo_arbol/subarboles/genomica"),
                  METAGENOMICA: require("../nuevo_arbol/subarboles/metagenomica")
                }
              },
              No: {
                pregunta: "Tipo de aplicación",
                opciones: ["CHIPSEC", "GENOMICA", "METAGENOMICA"],
                siguientes_pasos: {
                  CHIPSEC: require("../nuevo_arbol/subarboles/chipSec"),
                  GENOMICA: require("../nuevo_arbol/subarboles/genomica"),
                  METAGENOMICA: require("../nuevo_arbol/subarboles/metagenomica")
                }
              }
            }
          }
        }
      },
      ARN: {
        pregunta: "¿Requiere extracción de ARN?",
        opciones: ["Sí", "No"],
        siguientes_pasos: {
          Sí: {
            costo_extraccion: 300,
            pregunta: "¿Requiere análisis de calidad?",
            opciones: ["Sí", "No"],
            siguientes_pasos: {
              Sí: {
                costo_analisis_calidad: 60,
                pregunta: "Tipo de organismo",
                opciones: ["Eucariote", "Procariote", "Virus"],
                siguientes_pasos: {
                  Eucariote: require("../nuevo_arbol/subarboles/arnEucariote"),
                  Procariote: require("../nuevo_arbol/subarboles/arnProcariote"),
                  Virus: require("../nuevo_arbol/subarboles/arnVirus")
                }
              },
              No: {
                pregunta: "Tipo de organismo",
                opciones: ["Eucariote", "Procariote", "Virus"],
                siguientes_pasos: {
                  Eucariote: require("../nuevo_arbol/subarboles/arnEucariote"),
                  Procariote: require("../nuevo_arbol/subarboles/arnProcariote"),
                  Virus: require("../nuevo_arbol/subarboles/arnVirus")
                }
              }
            }
          },
          No: {
            pregunta: "¿Requiere análisis de calidad?",
            opciones: ["Sí", "No"],
            siguientes_pasos: {
              Sí: {
                costo_analisis_calidad: 60,
                pregunta: "Tipo de organismo",
                opciones: ["Eucariote", "Procariote", "Virus"],
                siguientes_pasos: {
                  Eucariote: require("../nuevo_arbol/subarboles/arnEucariote"),
                  Procariote: require("../nuevo_arbol/subarboles/arnProcariote"),
                  Virus: require("../nuevo_arbol/subarboles/arnVirus")
                }
              },
              No: {
                pregunta: "Tipo de organismo",
                opciones: ["Eucariote", "Procariote", "Virus"],
                siguientes_pasos: {
                  Eucariote: require("../nuevo_arbol/subarboles/arnEucariote"),
                  Procariote: require("../nuevo_arbol/subarboles/arnProcariote"),
                  Virus: require("../nuevo_arbol/subarboles/arnVirus")
                }
              }
            }
          }
        }
      }
    }
  }
};

router.get("/arbol", (req, res) => {
  res.json(arbolDecisiones);
});

module.exports = router;