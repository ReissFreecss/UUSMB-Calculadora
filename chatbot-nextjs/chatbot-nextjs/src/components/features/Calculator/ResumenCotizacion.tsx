import { PlusIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';



const Contenedor = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleContenedor = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className="container mx-auto flex-1 p-2 sm:p-4 border border-gray-300 text-gray-700">
            <h1 className="flex items-center justify-between text-gray-700 text-2xl padding-10px font-bold" onClick={toggleContenedor}>
                Resumen de Cotización
                <PlusIcon className={`h-5 md:ml-4 transition-transform ${isOpen ? 'rotate-45' : ''}`} />
            </h1>

            <div className={`${isOpen ? 'block' : 'hidden'}`}>
                <br />
                <table className='min-w-full'>
                    <thead>
                        <tr>
                            <th>Concepto</th>
                            <th>Costo</th>
                            <th>IVA</th>
                            <th>Muestras</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Extracción</td>
                            <td>constanteBD</td>
                            <td>constanteBD</td>
                            <td>
                                <input
                                    type="number"
                                    name="muestras"
                                    id="muestras"
                                    autoComplete="muestras"
                                    className="input"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td>Análisis de calidad</td>
                            <td>constanteBD</td>
                        </tr>
                        <tr>
                            <td>Secuenciación completa</td>
                            <td>constanteBD</td>
                        </tr>
                        <tr>
                            <td>Ensamble de Novo</td>
                            <td>constanteBD</td>
                        </tr>
                        <tr>
                            <td>Limpieza ribosomal</td>
                            <td>constanteBD</td>
                        </tr>
                    </tbody>
                </table>
                <br />



                <div>
                    <h2>Subtotal</h2>
                    <h2>Tipo de cambio</h2>
                    <h2>Costo total</h2>
                    <p className="text-sm text-gray-600 text-left lg:text-left">
                        Los costos reflejados son con fines informativos y están sujetos a cambios sin previo aviso.</p>

                    <br />
                </div>


                <div>
                    <a
                        href="https://docs.google.com/document/d/13y2f53h-gqNjbMMIG9DniM7EgULq4nr8/edit?tab=t.0#heading=h.o121gcxtaccg"
                        className="text-sm text-black hover:text-secondary-dark underline decoration-2 decoration-gray-600 hover:decoration-secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Consideraciones sobre las muestras recibidas por la unidad
                    </a>
                    <p className="text-sm text-gray-600 text-left lg:text-left">
                        Al guardar la cotización, acepta conocer las consideraciones para las muestras de la UUSMB.</p>

                </div>

            </div>
        </div>
    );
};
export default Contenedor;