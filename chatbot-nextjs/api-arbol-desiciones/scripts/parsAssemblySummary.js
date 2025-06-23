// scripts/parseAssemblySummary.js
const fs = require('fs');
const readline = require('readline');

async function parseAssemblySummary(filePath, tipoOrganismo) {
  const file = fs.createReadStream(filePath);
  const rl = readline.createInterface({ input: file });

  const organismos = [];

  for await (const line of rl) {
    if (line.startsWith('#')) continue;
    const fields = line.split('\t');
    const nombre = fields[7];
    const tamanoGenoma = parseInt(fields[11] || '0'); // puede variar según el archivo

    organismos.push({
      nombre,
      tipo: tipoOrganismo,
      tamano_genoma: tamanoGenoma
    });
  }

  fs.writeFileSync(`organismos_${tipoOrganismo}.json`, JSON.stringify(organismos, null, 2));
}

// Puedes llamarlo varias veces con diferentes archivos
parseAssemblySummary('assembly_summary_bacteria.txt', 'Procariote');
