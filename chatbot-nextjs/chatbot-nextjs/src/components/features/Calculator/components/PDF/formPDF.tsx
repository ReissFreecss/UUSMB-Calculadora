import { useState } from "react";
import dynamic from "next/dynamic";

const PDFPreview = dynamic(() => import("./PDFPreview"), { ssr: false });

export default function Formulario() {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    servicio: "",
    precio: 0,
  });

  const precios = {
    "Secuenciación": 5000,
    "Análisis": 3000,
    "Bioinformática": 2000,
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newPrice = precios[value as keyof typeof precios] || formData.precio; // Actualiza el precio si es un servicio
    setFormData({ ...formData, [name]: value, precio: newPrice });
  };

  return (
    <div>
      <form>
        <input type="text" name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
        <select name="servicio" onChange={handleChange}>
          <option value="">Selecciona un servicio</option>
          <option value="Secuenciación">Secuenciación - $5000</option>
          <option value="Análisis">Análisis - $3000</option>
          <option value="Bioinformática">Bioinformática - $2000</option>
        </select>
      </form>

      <h3>Total: ${formData.precio}</h3>

      <PDFPreview data={formData} />
    </div>
  );
}