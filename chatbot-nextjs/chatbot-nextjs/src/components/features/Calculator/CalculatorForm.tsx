import "@/components/features/Calculator/components/style.css";
import { useState, useEffect } from 'react';
import ResumenCotizacion from "./ResumenCotizacion";
import Accordion from "./Accordion";
import Checkbox from '@mui/material/Checkbox';

type OptionType = {
    id: number;
    descripcion:string;
};

const fetchOptions = async <T extends OptionType>(
    url: string,
setState: React.Dispatch<React.SetStateAction<T[]>>
) => {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error en la API: ${response.status}`);
        const data: T[] = await response.json(); // Definimos que `data` es un array de `T`
        setState(data);
    } catch (error) {
        console.error(`Error al obtener datos de ${url}:`, error);
    }
};

export default function Form() {

    
    const [tipoUsuario, setTipoUsuario] = useState("");
    const [tiposUsuarios, setTiposUsuarios] = useState<OptionType[]>([]);  
    const [materialGenetico, setMaterialGenetico] = useState<OptionType[]>([]);

    //opciones para ADN
    const [tipoAplicacion, setTipoAplicacion] = useState("");
    const [tipoSecuenciacion, setTipoSecuenciacion] = useState("");
    const [tipoBiblioteca, setTipoBiblioteca] = useState("");
    const [conocerOrganismo, setConocerOrganismo] = useState("");
    const [tamanoGenoma, setTamanoGenoma] = useState("");
    const [tipoAmplicon, setTipoAmplicon] = useState("");
    const [tamanoAmplicon, setTamanoAmplicon] = useState("");

    //opciones para ARN
    const [tipoOrganismo, setTipoOrganismo] = useState("");
    const [analisisExpresion, setAnalisisExpresion] = useState(false);
    const [ensambleNovo, setEnsambleNovo] = useState(false);
    const [ambosServicios, setAmbosServicios] = useState(false);
    const [organismoReferencia, setOrganismoReferencia] = useState("");
    const [conocerVirus, setConocerVirus] = useState("");


    const handleChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => setter(e.target.value.toString());
    const handleCheckboxChange = (setter: React.Dispatch<React.SetStateAction<boolean>>) => (e: React.ChangeEvent<HTMLInputElement>) => setter(e.target.checked);

    
    //Cargar todas las opciones cuando se monta el formulario
    useEffect(() => {
        fetchOptions("http://127.0.0.1:8000/api/api/tipo-usuario/", setTiposUsuarios);
        fetchOptions("http://127.0.0.1:8000/api/api/material-genetico/", setMaterialGenetico);
        
        }, []);


    //plataformas
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
        ? [...plataformasBase, { id: "nanopore", label: "Nanopore" }] : plataformasBase;


    //generar PDF
    const descargarPDF = () => {
        window.open("http://127.0.0.1:8000/descargar-pdf/", "_blank");
    };

    const generarPDF = () => {
        window.open("http://127.0.0.1:8000/generar-pdf/", "_blank");
    };

    return (

        <div className="flex flex-col items-left justify-header">

            <div>
                <br />
                <h1 className="text-primary text-2xl font-bold">
                    Tipo de usuario:
                </h1>
                <select
                    value={tipoUsuario}
                    onChange={(e) => setTipoUsuario(e.target.value)}
                    className="select-tipo-usuario"
                    >
                    <option disabled>Selecciona el tipo de usuario</option>
                    <option value=""></option>
                    {tiposUsuarios.map((tipo) => (
                        <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
                    ))}
                </select>

            </div>

            <br />
            <div className="flex flex-col items-left justify-header">

                <h1 className="text-black text-4xl font-bold">
                    Datos del proyecto
                </h1>

                <div className="w-full">
                    <label htmlFor="material-genetico" className="label">
                        Tipo de material genético
                    </label>
                    <select
                        value={tipoUsuario}
                        onChange={(e) => setMaterialGenetico([{ id: parseInt(e.target.value), descripcion: "" }])}
                        className="select-tipo-usuario"
                        >
                        <option disabled>Selecciona el tipo de material genético</option>
                        <option value=""></option>
                        {materialGenetico.map((tipo) => (
                            <option key={tipo.id} value={tipo.id}>{tipo.descripcion}</option>
                        ))}
                        </select>
                </div>

                {(materialGenetico.some(option => option.descripcion === "DNA") || materialGenetico.some(option => option.descripcion === "RNA")) && (

                    <div >
                        <br />
                        <h1 className="text-black text-4xl font-bold">
                            Servicios
                        </h1>

                        <div className="flex justify-between w-full">
                            <label htmlFor="servicios" className="checkbox-label">
                                <input type="checkbox" id="extraccion" value="extraccion" className="cb" />
                                Extracción
                            </label>

                            <label htmlFor="servicios" className="checkbox-label">
                                <input type="checkbox" id="calidad" value="calidad" className="cb" />
                                Análisis de calidad
                            </label>
                        </div>
                        <br />
                    </div>
                )}

                <div className="flex flex-wrap gap-4">
                    <div className='flex justify-between w-full'>
                        {materialGenetico.some(option => option.descripcion === "DNA")  && (
                            <div className="w-full">
                                <label htmlFor="tipo-aplicacion" className="label">
                                    Tipo de aplicación
                                </label>
                                <select
                                    name="tipo-aplicacion"
                                    id="tipo-aplicacion"
                                    className="select"
                                    value={tipoAplicacion}
                                    onChange={handleChange(setTipoAplicacion)}>

                                    <option disabled>Selecciona el tipo de aplicación </option>
                                    <option value="">------</option>
                                    <option value="genomica">Genómica</option>
                                    <option value="metagenomica">Metagenómica</option>
                                </select>
                            </div>
                        )}

                        {tipoAplicacion === "genomica" && (
                            <div className="w-full">
                                <label htmlFor="tipo-secuenciacion" className="label">
                                    Tipo de secuenciación
                                </label>
                                <select
                                    name="tipo-secuenciacion"
                                    id="tipo-secuenciacion"
                                    className="select"
                                    value={tipoSecuenciacion}
                                    onChange={handleChange(setTipoSecuenciacion)}
                                >
                                    <option disabled>Selecciona el tipo de secuenciación </option>
                                    <option value="">------</option>
                                    <option value="resecuenciacion">Resecuenciación</option>
                                    <option value="secuenciacion-novo">Secuenciación de Novo</option>
                                </select>
                            </div>
                        )}

                        {tipoAplicacion === "metagenomica" && (
                            <div className="w-full">
                                <label className="label">
                                    Tipo de biblioteca
                                </label>
                                <select
                                    name="tipo-biblioteca"
                                    id="tipo-biblioteca"
                                    className="select"
                                    value={tipoBiblioteca}
                                    onChange={handleChange(setTipoBiblioteca)}
                                >
                                    <option disabled >Selecciona un tipo de biblioteca </option>
                                    <option value="">------</option>
                                    <option value="amplicon">Amplicón</option>
                                    <option value="DNA-genomico">DNA Genómico</option>
                                </select>
                            </div>
                        )}

                        {tipoBiblioteca === "amplicon" && (
                            <div className="w-full">
                                <label className="label">
                                    Tipo de amplicón
                                </label>
                                <select
                                    name="tipo-amplicon"
                                    id="tipo-amplicon"
                                    className="select"
                                    value={tipoAmplicon}
                                    onChange={handleChange(setTipoAmplicon)}
                                >
                                    <option disabled >Selecciona un tipo de amplicón </option>
                                    <option value="">------</option>
                                    <option value="16S">16S</option>
                                    <option value="ITS">ITS</option>
                                    <option value="otro">Otro</option>
                                </select>
                            </div>
                        )}


                        {tipoSecuenciacion === "secuenciacion-novo" && (
                            <div className="w-full">
                                <label className="label">
                                    ¿Conoces el organismo?
                                </label>
                                <select
                                    name="conocer-org"
                                    id="conocer-org"
                                    className="select"
                                    value={conocerOrganismo}
                                    onChange={handleChange(setConocerOrganismo)}
                                >
                                    <option disabled>¿Conoces el organismo? </option>
                                    <option value="">------</option>
                                    <option value="si">Sí</option>
                                    <option value="no">No</option>
                                </select>
                            </div>

                        )}

                        {(materialGenetico.some(option => option.descripcion === "RNA") || tipoSecuenciacion === "resecuenciacion" || conocerOrganismo === "si") && (
                            <div className="w-full">
                                <label htmlFor="tipo-organismo" className="label">
                                    Tipo de organismo
                                </label>
                                <select
                                    name="tipo-organismo"
                                    id="tipo-organismo"
                                    className="select"
                                    value={tipoOrganismo}
                                    onChange={handleChange(setTipoOrganismo)}
                                >
                                    <option disabled >Selecciona un tipo de organismo </option>
                                    <option value="">------</option>
                                    <option value="eucariotes">Eucariotes</option>
                                    <option value="procariotes">Procariotes</option>
                                    <option value="virus">Virus</option>
                                </select>
                            </div>
                        )}

                        {(materialGenetico.some(option => option.descripcion === "RNA") && (tipoOrganismo === "eucariotes" || tipoOrganismo === "procariotes")) && (
                            <div className="w-full">
                                <label className="label">
                                    Tipo de biblioteca
                                </label>
                                <select
                                    name="tipo-biblioteca"
                                    id="tipo-biblioteca"
                                    className="select"
                                    value={tipoBiblioteca}
                                    onChange={handleChange(setTipoBiblioteca)}
                                >
                                    <option disabled >Selecciona un tipo de biblioteca </option>
                                    <option value="">------</option>
                                    <option value="mRNA">mRNA</option>
                                    <option value="smallRNA">smallRNA</option>
                                </select>
                            </div>
                        )}

                        {(materialGenetico.some(option => option.descripcion === "RNA") && (tipoOrganismo === "virus")) && (
                            <div className="w-full">
                                <label className="label">
                                    Tipo de biblioteca
                                </label>
                                <select
                                    name="tipo-biblioteca"
                                    id="tipo-biblioteca"
                                    className="select"
                                    value={tipoBiblioteca}
                                    onChange={handleChange(setTipoBiblioteca)}
                                >
                                    <option disabled >Selecciona un tipo de biblioteca </option>
                                    <option value="">------</option>
                                    <option value="RNAviral">RNA Viral</option>
                                </select>
                            </div>
                        )}

                    </div>

                    {tipoBiblioteca === "RNAviral" && (
                        <div className="w-full">
                            <label className="label">
                                ¿Conoces al virus?
                            </label>
                            <select
                                name="conocer-org"
                                id="conocer-org"
                                className="select"
                                value={conocerVirus}
                                onChange={handleChange(setConocerVirus)}
                            >
                                <option disabled>¿Conoces el virus? </option>
                                <option value="">------</option>
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    )}

                    {(tipoOrganismo === "procariotes" && tipoBiblioteca === "mRNA") && (
                        <div className="w-full">
                            <label className="checkbox-label">
                                <input type="checkbox" id="iseq" className="cb" /> Servicio de limpieza RNA
                            </label>
                            <div className="flex flex-col items-left">
                                <br />
                                <h1 className="text-black text-4xl font-bold">Servicio Bioinformático</h1>
                                <label htmlFor="analisisBio" className="checkbox-label">
                                    <input type="checkbox" id="analisisExpresion" checked={analisisExpresion} onChange={handleCheckboxChange(setAnalisisExpresion)} className="cb" />
                                    Análisis de expresión diferencial
                                </label>
                            </div>
                            <br />
                        </div>
                    )}




                    {(tipoOrganismo === "eucariotes" && tipoBiblioteca === "mRNA") && (
                        <div className="flex flex-col items-left">
                            <h1 className="text-black text-4xl font-bold">
                                Servicio Bioinformático
                            </h1>
                            <br />

                            <div className='flex justify-between w-full'>
                                <label htmlFor="analisisExpresion" className="checkbox-label">
                                    <input type="checkbox" id="analisisExpresion" checked={analisisExpresion} onChange={handleCheckboxChange(setAnalisisExpresion)} className="cb" />
                                    Análisis de expresión diferencial
                                </label>

                                <label htmlFor="ensambleNovo" className="checkbox-label">
                                    <input type="checkbox" id="ensambleNovo" checked={ensambleNovo} onChange={handleCheckboxChange(setEnsambleNovo)} className="cb" />
                                    Ensamble de Novo
                                </label>

                                <label htmlFor="ambosServicios" className="checkbox-label">
                                    <input type="checkbox" id="ambosServicios" checked={ambosServicios} onChange={handleCheckboxChange(setAmbosServicios)} className="cb" />
                                    Ambos servicios
                                </label>
                            </div>
                        </div>
                    )}


                    {analisisExpresion && (
                        <div className="w-full">
                            <label htmlFor="organismo-referencia" className="label">¿Conoces un organismo de referencia?</label>
                            <select id="organismo-referencia" className="select" value={organismoReferencia} onChange={handleChange(setOrganismoReferencia)}>
                                <option disabled>Selecciona una opción</option>
                                <option value="">------</option>
                                <option value="si">Sí</option>
                                <option value="no">No</option>
                            </select>
                        </div>
                    )}





                    {(materialGenetico.some(option => option.descripcion === "DNA") && (tipoOrganismo === "eucariotes" || tipoOrganismo === "procariotes" || tipoOrganismo === "virus"))
                        || (conocerVirus === "si") || (organismoReferencia === "si") && (
                            <div className="flex justify-between w-full">
                                <div className="w-full">
                                    <label htmlFor="nombre-organismo" className="label">
                                        Organismo de referencia
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre-organismo"
                                        id="nombre-organismo"
                                        autoComplete="nombre-organismo"
                                        className="input"
                                    />
                                </div>

                                <div className="w-full">
                                    <label htmlFor="tamano-genoma" className="label">
                                        Tamaño del genóma
                                    </label>
                                    <input
                                        type="number"
                                        name="tamano-genoma"
                                        id="tamano-genoma"
                                        autoComplete="tamano-genoma"
                                        className="input"
                                        value={tamanoGenoma}
                                        onChange={handleChange(setTamanoGenoma)}

                                    />
                                    <p className="label">
                                        Mb</p>
                                </div>
                            </div>
                        )}



                    {conocerOrganismo === "no" && (
                        <div className="w-full">
                            <label htmlFor="tamano-genoma" className="label">
                                Tamaño del genóma
                            </label>
                            <input
                                type="number"
                                name="tamano-genoma"
                                id="tamano-genoma"
                                autoComplete="tamano-genoma"
                                className="input"
                                value={tamanoGenoma}
                                onChange={handleChange(setTamanoGenoma)}

                            />
                            <p className="label">
                                Mb</p>
                        </div>
                    )}


                </div>
            </div>

            {tipoAmplicon === "otro" && (
                <div className="w-full">
                    <label htmlFor="tamano-genoma" className="label">
                        Tamaño del amplicón
                    </label>
                    <input
                        type="number"
                        name="tamano-amlicon"
                        id="tamano-amplicon"
                        autoComplete="tamano-amplicon"
                        className="input"
                        value={tamanoAmplicon}
                        onChange={handleChange(setTamanoAmplicon)}
                    />
                    <p className="label">
                        bases</p>
                </div>
            )}


            {plataformasIllumina && (
                <div className="mt-4">
                    <h2 className="text-black text-2xl font-bold">Plataformas</h2>
                    <div className="flex justify-between w-full">
                        {plataformasBase.map(({ id, label }) => (
                            <label key={id} htmlFor={id} className="checkbox-label">
                                <input type="checkbox" id={id} value={id} className="cb" />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            )}

            {plataformasTodas && (
                <div className="mt-4">
                    <h2 className="text-black text-2xl font-bold">Todas las Plataformas</h2>
                    <div className="flex justify-between w-full">
                        {plataformas.map(({ id, label }) => (
                            <label key={id} htmlFor={id} className="checkbox-label">
                                <input type="checkbox" id={id} value={id} className="cb" />
                                {label}
                            </label>
                        ))}
                    </div>
                </div>
            )}



            {(materialGenetico.some(option => option.descripcion === "x")) && (
                <div>
                    <div className="flex flex-col items-left justify-header h-screen">
                        <br />
                        <h1 className="text-black text-4xl font-bold">
                            Servicios
                        </h1>
                        <br />

                        <div className="flex justify-between w-full">

                            <label htmlFor="servicios" className="checkbox-label">
                                <input type="checkbox" id="extraccion" value="extraccion" className="cb" />
                                Extracción
                            </label>

                            <label htmlFor="servicios" className="checkbox-label">
                                <input type="checkbox" id="bibliotecas" value="bibliotecas" className="cb" />
                                Construcción de bibliotecas
                            </label>

                            <label htmlFor="servicios" className="checkbox-label">
                                <input type="checkbox" id="limpieza" value="limpieza" className="cb" />
                                Limpieza
                            </label>

                            <label htmlFor="servicios" className="checkbox-label">
                                <input type="checkbox" id="calidad" value="calidad" className="cb" />
                                Análisis de calidad
                            </label>

                            <label htmlFor="servicios" className="checkbox-label">
                                <input type="checkbox" id="bioinformatico" value="bioinformatico" className="cb" />
                                Análisis bioinformático
                            </label>
                        </div>
                        <br />
                    </div>


                    <div className="flex flex-col items-left justify-header h-screen">
                        <h2 className="text-black text-4xl font-bold">
                            Illumina
                        </h2>

                        <div className="flex justify-between w-full">
                            <div className="w-full">
                                <label htmlFor="tecnica-illumina" className="label">
                                    Técnica
                                </label>
                                <select name="tecnica-illumina" id="tecnica-illumina" className="select">
                                    <option>Secuenciación completa</option>
                                    <option>Secuenciación parcial</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label htmlFor="tamano-lectura" className="label">
                                    Tamaño de lectura
                                </label>
                                <select name="tamano-lectura" id="tamano-lectura" className="select">
                                    <option>Secuenciación completa</option>
                                    <option>Secuenciación parcial</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label htmlFor="profundidad" className="label">
                                    Profundidad
                                </label>
                                <select name="profundidad" id="profundidad" className="select">
                                    <option>Secuenciación completa</option>
                                    <option>Secuenciación parcial</option>
                                </select>
                            </div>
                        </div>
                        <br />
                        <label htmlFor="rendimiento" className="label"> Rendimiento</label>
                        <br />
                    </div>


                    <div className="flex flex-col items-left justify-header h-screen">
                        <h2 className="text-black text-4xl font-bold">
                            Nanopore
                        </h2>

                        <div className="flex justify-between w-full">
                            <div className="w-full">
                                <label htmlFor="tecnica-illumina" className="label">
                                    Técnica
                                </label>
                                <select name="tecnica-illumina" id="tecnica-illumina" className="select">
                                    <option>Secuenciación completa</option>
                                    <option>Secuenciación parcial</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label htmlFor="tamano-lectura" className="label">
                                    Tamaño de lectura
                                </label>
                                <select name="tamano-lectura" id="tamano-lectura" className="select">
                                    <option>Secuenciación completa</option>
                                    <option>Secuenciación parcial</option>
                                </select>
                            </div>

                            <div className="w-full">
                                <label htmlFor="profundidad" className="label">
                                    Profundidad
                                </label>
                                <select name="profundidad" id="profundidad" className="select">
                                    <option>Secuenciación completa</option>
                                    <option>Secuenciación parcial</option>
                                </select>
                            </div>
                        </div>
                        <br />
                        <label htmlFor="rendimiento" className="label"> Rendimiento</label>
                        <br />
                    </div>

                    <div className="flex flex-col items-left justify-header h-screen">
                        <h1 className="text-black text-4xl font-bold">
                            Servicio Bioinformático
                        </h1>
                        <br />

                        <div className='flex justify-between w-full'>
                            <label className="checkbox-label">
                                <input type="checkbox" id="nextseq" value="nextseq" className="cb" />
                                Análisis de expresión diferencial
                            </label>

                            <label className="checkbox-label">
                                <input type="checkbox" id="nextseq" value="nextseq" className="cb" />
                                Ensamble de Novo
                            </label>

                            <label className="checkbox-label">
                                <input type="checkbox" id="nextseq" value="nextseq" className="cb" />
                                Ambos servicios
                            </label>
                        </div>
                    </div>
                </div>
            )
            }

            <div className="flex justify-between w-full">
                <label htmlFor="servicios" className="checkbox-label">
                    <input type="checkbox" id="bioinformatico" value="bioinformatico" className="cb" />
                    Análisis bioinformático
                </label>
            </div>

            <div className="container mx-auto flex-1 p-2 sm:p-4">
                <p className="text-lg font-bold text-black text-right">
                    <br />
                    COSTE ESTIMADO: <span className="ml-4"></span> constanteBD<br />
                    IVA: <span className="ml-4"></span> constanteBD <br />
                    INCREMENTO EXTERNO: <span className="ml-4"></span> constanteBD<br />
                    COSTO TOTAL ESTIMADO: <span className="ml-4"></span> constanteBD <br /> <br />
                </p>
            </div>

            <br />
            <Accordion/>
            <br />




            <div className="flex flex-col items-left justify-header">
                <button onClick={generarPDF} className="bg-yellow-600 text-white font-bold p-2 rounded-md">
                    Ver cotización
                </button>
                <button onClick={descargarPDF} className="bg-primary text-white font-bold p-2 rounded-md">
                    Guardar y descargar cotización
                </button>
            </div>
            <br />
        </div >
    );
}


