interface Paso2Props {
  siguientePaso: () => void;
  setMaterialGenetico: (value: string) => void;
}

const Paso2 = ({ siguientePaso, setMaterialGenetico }: Paso2Props) => {
    return (
      <div>
        <label className="block font-bold">Tipo de Material Genético:</label>
        <select className="w-full p-2 border" onChange={(e) => setMaterialGenetico(e.target.value)}>
          <option value="">Selecciona...</option>
          <option value="ADN">ADN</option>
          <option value="ARN">ARN</option>
        </select>
        <button onClick={siguientePaso} className="mt-4 bg-blue-500 text-white p-2 rounded">Siguiente</button>
      </div>
    );
  };
  export default Paso2;