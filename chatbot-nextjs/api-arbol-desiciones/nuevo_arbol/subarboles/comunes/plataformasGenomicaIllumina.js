// comunes/plataformasGenomicaIllumina.js
module.exports = {
  pregunta: "Plataforma",
  opciones: ["Illumina", "Nanopore"],
  siguientes_pasos: {
    Illumina: {
      costo_secuenciacion: 1000,
      pregunta: "Opción",
      opciones: ["NEXT SEQ 500", "ISEQ", "NEXT SEQ 1000/2000", "NOVASEQ X+"],
      siguientes_pasos: {
        "NEXT SEQ 500": require("./preguntaBioinfo"),
        ISEQ: require("./preguntaBioinfo"),
        "NEXT SEQ 1000/2000": require("./preguntaBioinfo"),
        "NOVASEQ X+": require("./preguntaBioinfo")
      }
    },
    Nanopore: {
      costo_secuenciacion: 1500,
      pregunta: "Opción",
      opciones: ["MINION"],
      siguientes_pasos: {
        MINION: require("./preguntaBioinfo")
      }
    }
  }
};