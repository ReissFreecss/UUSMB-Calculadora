// comunes/arnmRNAComun.js
module.exports = {
  costo_biblioteca: 200,
  pregunta: "Su muestra tiene rRNA ribosomales",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    Sí: {
      pregunta: "¿Requiere servicio de limpieza?",
      opciones: ["Sí"],
      siguientes_pasos: {
        Sí: {
          costo_limpieza: 200,
          pregunta: "Servicio bioinformático",
          opciones: ["Ensamble de Novo", "Análisis de Expresión Diferencial", "Ambos"],
          siguientes_pasos: {
            "Ensamble de Novo": {
              costo_analisis_bioinformatico: 100,
              pregunta: "Plataforma",
              opciones: ["Illumina"],
              siguientes_pasos: {
                Illumina: {
                  costo_secuenciacion: 500,
                  pregunta: "Opción",
                  opciones: ["NEXT SEQ 500"],
                  mensaje: "Este es el final del flujo. Descarga la cotización."
                }
              }
            },
            "Análisis de Expresión Diferencial": {
              costo_analisis_bioinformatico: 200,
              pregunta: "Plataforma",
              opciones: ["Illumina"],
              siguientes_pasos: {
                Illumina: {
                  costo_secuenciacion: 400,
                  pregunta: "Opción",
                  opciones: ["NEXT SEQ 500"],
                  mensaje: "Este es el final del flujo. Descarga la cotización."
                }
              }
            },
            Ambos: {
              costo_analisis_bioinformatico: 300,
              pregunta: "Plataforma",
              opciones: ["Illumina"],
              siguientes_pasos: {
                Illumina: {
                  costo_secuenciacion: 600,
                  pregunta: "Opción",
                  opciones: ["NEXT SEQ 500"],
                  mensaje: "Este es el final del flujo. Descarga la cotización."
                }
              }
            }
          }
        }
      }
    },
    No: {
      pregunta: "Servicio bioinformático",
      opciones: ["Ensamble de Novo", "Análisis de Expresión Diferencial", "Ambos"],
      siguientes_pasos: {
        "Ensamble de Novo": {
          costo_analisis_bioinformatico: 100,
          pregunta: "Plataforma",
          opciones: ["Illumina"],
          siguientes_pasos: {
            Illumina: {
              costo_secuenciacion: 500,
              pregunta: "Opción",
              opciones: ["NEXT SEQ 500"],
              mensaje: "Este es el final del flujo. Descarga la cotización."
            }
          }
        },
        "Análisis de Expresión Diferencial": {
          costo_analisis_bioinformatico: 200,
          pregunta: "Plataforma",
          opciones: ["Illumina"],
          siguientes_pasos: {
            Illumina: {
              costo_secuenciacion: 400,
              pregunta: "Opción",
              opciones: ["NEXT SEQ 500"],
              mensaje: "Este es el final del flujo. Descarga la cotización."
            }
          }
        },
        Ambos: {
          costo_analisis_bioinformatico: 300,
          pregunta: "Plataforma",
          opciones: ["Illumina"],
          siguientes_pasos: {
            Illumina: {
              costo_secuenciacion: 600,
              pregunta: "Opción",
              opciones: ["NEXT SEQ 500"],
              mensaje: "Este es el final del flujo. Descarga la cotización."
            }
          }
        }
      }
    }
  }
};
