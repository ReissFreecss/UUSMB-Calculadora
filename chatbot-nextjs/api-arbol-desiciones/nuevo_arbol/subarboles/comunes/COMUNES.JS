// comunes/tipoSecuenciacion.js
module.exports = {
  "Resecuenciación": require("./tipoOrganismo"),
  "Secuenciación de Novo": require("./conocesOrganismo")
};

// comunes/tipoOrganismo.js
module.exports = {
  pregunta: "Tipo de organismo",
  opciones: ["Eucariote", "Procariote", "Virus"],
  siguientes_pasos: {
    Eucariote: require("./plataformasGenomicaIllumina"),
    Procariote: require("./plataformasGenomicaIllumina"),
    Virus: require("./plataformasGenomicaIllumina")
  }
};

// comunes/conocesOrganismo.js
module.exports = {
  pregunta: "¿Conoces el organismo?",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    "Sí": require("./tipoOrganismo"),
    "No": require("./plataformasGenomicaIllumina")
  }
};

// comunes/plataformasGenomicaIllumina.js
module.exports = {
  pregunta: "Plataforma",
  opciones: ["Illumina", "Nanopore"],
  siguientes_pasos: {
    Illumina: {
      pregunta: "Opción",
      opciones: ["NEXT SEQ 500", "ISEQ", "NEXT SEQ 1000/2000", "NOVASEQ X+"],
      siguientes_pasos: require("./costos")
    },
    Nanopore: {
      pregunta: "Opción",
      opciones: ["MINION"],
      siguientes_pasos: require("./costos")
    }
  }
};

// comunes/genomicaDNA.js
module.exports = {
  pregunta: "Tipo de secuenciación",
  opciones: ["Resecuenciación", "Secuenciación de Novo"],
  siguientes_pasos: require("./tipoSecuenciacion")
};

// comunes/metagenomicaDNA.js
module.exports = require("./genomicaDNA");

// comunes/amplicon.js
module.exports = require("./ampliconPCR");

// comunes/ampliconPCR.js
module.exports = {
  pregunta: "¿Tiene PCR1?",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    "Sí": require("./ampliconPCR2"),
    "No": require("./ampliconSinPCR1")
  }
};

// comunes/ampliconPCR2.js
module.exports = {
  pregunta: "Cuenta con secuencia:",
  opciones: ["Illumina", "Nanopore"],
  siguientes_pasos: {
    Illumina: require("./plataformasAmpliconIllumina"),
    Nanopore: require("./plataformasAmpliconNanopore")
  }
};

// comunes/ampliconSinPCR1.js
module.exports = {
  pregunta: "Tipo de amplicon PCR1",
  opciones: ["12S", "16S", "COI", "ITS", "TRNA-LEV", "18S", "28S"],
  siguientes_pasos: {
    pregunta: "Tipo de amplicon PCR2",
    opciones: ["12S", "16S", "COI", "ITS", "TRNA-LEV", "18S", "28S"],
    siguientes_pasos: require("./tipoSecuenciacion")
  }
};

// comunes/plataformasAmpliconIllumina.js
module.exports = {
  pregunta: "Tipo de secuenciación",
  opciones: ["Resecuenciación", "Secuenciación de Novo"],
  siguientes_pasos: require("./tipoOrganismoAmplicon")
};

// comunes/plataformasAmpliconNanopore.js
module.exports = require("./plataformasAmpliconIllumina");

// comunes/tipoOrganismoAmplicon.js
module.exports = {
  pregunta: "Tipo de organismo",
  opciones: ["Eucariote", "Procariote", "Virus"],
  siguientes_pasos: {
    Eucariote: require("./costos"),
    Procariote: require("./costos"),
    Virus: require("./costos")
  }
};

// comunes/arnSmallRNA.js
module.exports = {
  pregunta: "Tipo de plataforma",
  opciones: ["Illumina"],
  siguientes_pasos: {
    Illumina: {
      pregunta: "Opción",
      opciones: ["NEXT SEQ 500"],
      siguientes_pasos: require("./costos")
    }
  }
};

// comunes/arnmRNAEucariote.js
module.exports = require("./arnmRNAComun");

// comunes/arnmRNAProcariote.js
module.exports = {
  pregunta: "Su muestra tiene rRNA ribosomales",
  opciones: ["Sí", "No"],
  siguientes_pasos: require("./bioinfoProcariote")
};

// comunes/bioinfoProcariote.js
module.exports = {
  Sí: {
    costo_limpieza: "valor",
    pregunta: "Servicio bioinformático",
    opciones: ["Análisis de Expresión Diferencial"],
    siguientes_pasos: require("./expresionDiferencial")
  },
  No: {
    pregunta: "Servicio bioinformático",
    opciones: ["Análisis de Expresión Diferencial"],
    siguientes_pasos: require("./expresionDiferencial")
  }
};

// comunes/arnmRNAComun.js
module.exports = {
  pregunta: "Su muestra tiene rRNA ribosomales",
  opciones: ["Sí", "No"],
  siguientes_pasos: {
    Sí: {
      costo_limpieza: "valor",
      pregunta: "Servicio bioinformático",
      opciones: ["Ensamble de Novo", "Análisis de Expresión Diferencial", "Ambos"],
      siguientes_pasos: require("./bioInfoCompleto")
    },
    No: {
      pregunta: "Servicio bioinformático",
      opciones: ["Ensamble de Novo", "Análisis de Expresión Diferencial", "Ambos"],
      siguientes_pasos: require("./bioInfoCompleto")
    }
  }
};

// comunes/bioinfoCompleto.js
module.exports = {
  "Ensamble de Novo": {
    costo_analisis_bioinformatico: "valor",
    tipo_plataforma: "NEXT SEQ 500"
  },
  "Análisis de Expresión Diferencial": {
    costo_analisis_bioinformatico: "valor",
    tipo_plataforma: "NEXT SEQ 500"
  },
  Ambos: {
    costo_analisis_bioinformatico: "valor",
    tipo_plataforma: "NEXT SEQ 500"
  }
};

// comunes/expresionDiferencial.js
module.exports = {
  "Análisis de Expresión Diferencial": {
    costo_analisis_bioinformatico: "valor",
    tipo_plataforma: "NEXT SEQ 500"
  }
};

// comunes/arnViral.js
module.exports = {
  pregunta: "Tipo de plataforma",
  opciones: ["Illumina"],
  siguientes_pasos: {
    Illumina: {
      pregunta: "Opción",
      opciones: ["NEXT SEQ 500", "ISEQ"],
      siguientes_pasos: require("./costos")
    }
  }
};

// comunes/costos.js
module.exports = {
  costo_secuenciacion: "valor",
  costo_limpieza: "valor",
  costo_analisis_bioinformatico: "valor"
};
