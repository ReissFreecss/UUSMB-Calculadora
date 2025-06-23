import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/costos/",
    headers: { "Content-Type": "application/json" }
});

// Función genérica para GET
const fetchData = async (endpoint) => {
    try {
        const response = await api.get(endpoint);
        return response.data;
    } catch (error) {
        console.error("Error al obtener datos:", error);
        throw error;
    }
};

// Función genérica para POST
const createData = async (endpoint, data) => {
    try {
        await api.post(endpoint, data);
    } catch (error) {
        console.error("Error al crear:", error);
        throw error;
    }
};

// Función genérica para PUT
const updateData = async (endpoint, id, data) => {
    try {
        await api.put(`${endpoint}${id}/`, data);
    } catch (error) {
        console.error("Error al actualizar:", error);
        throw error;
    }
};

// Función genérica para DELETE
const deleteData = async (endpoint, id) => {
    try {
        await api.delete(`${endpoint}${id}/`);
    } catch (error) {
        console.error("Error al eliminar:", error);
        throw error;
    }
};

// CRUD para Plataformas
export const getPlataformas = () => fetchData("plataformas/");
export const createPlataforma = (data) => createData("plataformas/", data);
export const updatePlataforma = (id, data) => updateData("plataformas/", id, data);
export const deletePlataforma = (id) => deleteData("plataformas/", id);

// CRUD para Consumibles
export const getConsumibles = () => fetchData("consumibles/");
export const createConsumible = (data) => createData("consumibles/", data);
export const updateConsumible = (id, data) => updateData("consumibles/", id, data);
export const deleteConsumible = (id) => deleteData("consumibles/", id);

// CRUD para Reactivos
export const getReactivos = () => fetchData("reactivos/");
export const createReactivo = (data) => createData("reactivos/", data);
export const updateReactivo = (id, data) => updateData("reactivos/", id, data);
export const deleteReactivo = (id) => deleteData("reactivos/", id);

// CRUD para Cuantificaciones
export const getCuantificaciones = () => fetchData("cuantificaciones/");
export const createCuantificacion = (data) => createData("cuantificaciones/", data);
export const updateCuantificacion = (id, data) => updateData("cuantificaciones/", id, data);
export const deleteCuantificacion = (id) => deleteData("cuantificaciones/", id);

// CRUD Cuantificacion Consumibles
export const getCuantiCons = () => fetchData("cuantificacion-consumibles/");
export const createCuantiCons = (data) => createData("cuantificacion-consumibles/", data);
export const updateCuantiCons = (id, data) => updateData("cuantificacion-consumibles/", id, data);
export const deleteCuantiCons = (id) => deleteData("cuantificacion-consumibles/", id);

// CRUD para Buffers, Geles y Oligos
export const getBGO = () => fetchData("buffers-geles-oligos/");
export const createBGO = (data) => createData("buffers-geles-oligos/", data);
export const updateBGO = (id, data) => updateData("buffers-geles-oligos/", id, data);
export const deleteBGO = (id) => deleteData("buffers-geles-oligos/", id);

// CRUD para BGO Consumibles
export const getBGOConsumibles = () => fetchData("bgo-consumibles/");
export const createBGOConsumible = (data) => createData("bgo-consumibles/", data);
export const updateBGOConsumible = (id, data) => updateData("bgo-consumibles/", id, data);
export const deleteBGOConsumible = (id) => deleteData("bgo-consumibles/", id);

// CRUD para Procesos
export const getProcesos = () => fetchData("procesos/");
export const createProceso = (data) => createData("procesos/", data);
export const updateProceso = (id, data) => updateData("procesos/", id, data);
export const deleteProceso = (id) => deleteData("procesos/", id);

// CRUD para Procesos Materiales
export const getProcesosMateriales = () => fetchData("procesos-materiales/");
export const createProcesoMaterial = (data) => createData("procesos-materiales/", data);
export const updateProcesoMaterial = (id, data) => updateData("procesos-materiales/", id, data);
export const deleteProcesoMaterial = (id) => deleteData("procesos-materiales/", id);

// CRUD para Servicios
export const getServicios = () => fetchData("servicios/");
export const createServicio = (data) => createData("servicios/", data);
export const updateServicio = (id, data) => updateData("servicios/", id, data);
export const deleteServicio = (id) => deleteData("servicios/", id);

// CRUD para Servicios Procesos
export const getServiciosProcesos = () => fetchData("servicios-procesos/");
export const createServicioProceso = (data) => createData("servicios-procesos/", data);
export const updateServicioProceso = (id, data) => updateData("servicios-procesos/", id, data);
export const deleteServicioProceso = (id) => deleteData("servicios-procesos/", id);

// CRUD para Control Cambios
export const getControlCambios = () => fetchData("control-cambios/");
export const createControlCambio = (data) => createData("control-cambios/", data);
export const updateControlCambio = (id, data) => updateData("control-cambios/", id, data);
export const deleteControlCambio = (id) => deleteData("control-cambios/", id);
