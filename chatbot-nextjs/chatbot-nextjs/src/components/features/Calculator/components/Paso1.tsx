const Paso1 = ({ siguientePaso, setTipoUsuario }: { siguientePaso: () => void; setTipoUsuario: (value: string) => void }) => {
    return (
      <div>
        <label className="block font-bold">Tipo de usuario:</label>
        <select className="w-full p-2 border" onChange={(e) => setTipoUsuario(e.target.value)}>
          <option value="">Selecciona...</option>
          <option value="investigador">Investigador</option>
          <option value="empresa">Empresa</option>
        </select>
        <button onClick={siguientePaso} className="mt-4 bg-blue-500 text-white p-2 rounded">Siguiente</button>
      </div>
    );
  };
  export default Paso1;