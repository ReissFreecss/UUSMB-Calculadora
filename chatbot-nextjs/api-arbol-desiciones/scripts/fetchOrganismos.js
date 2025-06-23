const axios = require("axios");
const fs = require("fs");
const path = require("path");

const TIPO_QUERY = {
  "Eucariote": "txid2759[Organism:exp]",
  "Procariote": "txid2[Organism:exp]",
  "Virus": "txid10239[Organism:exp]"
};

async function fetchOrganismos(tipo) {
  try {
    const query = TIPO_QUERY[tipo];
    if (!query) throw new Error(`Tipo desconocido: ${tipo}`);

    const esearchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi`;
    const esummaryUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esummary.fcgi`;

    // Paso 1: Obtener IDs
    const searchRes = await axios.get(esearchUrl, {
      params: {
        db: "genome",
        term: query,
        retmax: 500, // Aumentamos el límite de resultados
        retmode: "json"
      }
    });

    const ids = searchRes.data.esearchresult.idlist;
    if (ids.length === 0) return;

    // Paso 2: Obtener nombres y tamaños
    const summaryRes = await axios.get(esummaryUrl, {
      params: {
        db: "assembly",
        id: ids.join(","),
        retmode: "json"
      }
    });

    if (!summaryRes.data.result) return;

    // Extraer organismos con tamaño de genoma
    const organismos = Object.values(summaryRes.data.result)
      .filter(org => org.organism && (org.total_length || org.contign50 || org.scaffoldn50 || org.ungapped_length))
      .map(org => ({
        nombre: org.organism,
        tamaño_genoma: org.total_length ? parseInt(org.total_length) :
                       org.contign50 ? parseInt(org.contign50) :
                       org.scaffoldn50 ? parseInt(org.scaffoldn50) :
                       org.ungapped_length ? parseInt(org.ungapped_length) : "Desconocido"
      }));

    if (organismos.length === 0) return;

    // Asegurar que la carpeta 'data' exista
    const dataDir = path.join(__dirname, "../data");
    if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

    const filePath = path.join(dataDir, `${tipo.toLowerCase()}.json`);
    fs.writeFileSync(filePath, JSON.stringify(organismos, null, 2));
  } catch (error) {
    console.error(`❌ Error al obtener datos para ${tipo}:`, error.message);
  }
}

// Ejecutar secuencialmente para evitar saturar NCBI
async function main() {
  for (const tipo of ["Eucariote", "Procariote", "Virus"]) {
    await fetchOrganismos(tipo);
    await new Promise(res => setTimeout(res, 1000)); // Pausa para evitar bloqueos por límite de peticiones
  }
}

main();