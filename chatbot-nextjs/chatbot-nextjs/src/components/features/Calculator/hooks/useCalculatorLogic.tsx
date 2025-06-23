export const useCalculatorLogic = (materialGenetico: string, tipoBiblioteca: string, tamanoGenoma: string, ensambleNovo: boolean, ambosServicios: boolean, organismoReferencia: string, tamanoAmplicon: string) => {
    const plataformasIllumina =
        tipoBiblioteca === "DNA-genomico"
        || tipoBiblioteca === "smallRNA"
        || (tipoBiblioteca === "mRNA" && (Number(tamanoGenoma) > 0))
        || ensambleNovo
        || ambosServicios
        || organismoReferencia === "no";

    const plataformasTodas =
        ((tipoBiblioteca !== "mRNA" && tamanoGenoma !== "" && Number(tamanoGenoma) > 0)
            || (tamanoAmplicon !== "" && Number(tamanoAmplicon) > 0));

    const plataformasBase = [
        { id: "nextseq", label: "Illumina NextSeq 500" },
        { id: "miseq", label: "Illumina MiSeq" },
        { id: "iseq", label: "Illumina iSeq" },
    ];

    const plataformas = plataformasTodas
        ? [...plataformasBase, { id: "nanopore", label: "Nanopore" }]
        : plataformasBase;

    return { plataformas, plataformasIllumina, plataformasTodas };
};
