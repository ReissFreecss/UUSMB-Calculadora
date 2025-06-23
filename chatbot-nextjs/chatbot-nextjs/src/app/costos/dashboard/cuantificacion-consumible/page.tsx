"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getCuantificaciones, getConsumibles, getReactivos, getBGO, getCuantiCons, createCuantiCons, updateCuantiCons, deleteCuantiCons } from "../api-costos";
import { Pagination, Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Select, MenuItem } from "@mui/material";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";
import Search from "@/app/costos/ui/search"; // Componente de búsqueda
import { inter } from '@/app/costos/ui/fonts';

interface CuantificacionConsumible {
    id?: number;
    cuantificacion: number;
    consumible?: number | null;
    reactivo?: number | null;
    buffer_gel_oligo?: number | null;
    cantidad: number;
    costo: number;
}

interface Cuantificacion {
    id: number;
    nombre: string;
}

interface Material {
    id: number;
    nombre: string;
    costo: number;
}

export default function CuantiConsPage() {
    const queryClient = useQueryClient();
    const { data: cuantificaciones = [] } = useQuery<Cuantificacion[]>({ queryKey: ["cuantificaciones"], queryFn: getCuantificaciones });
    const { data: consumibles = [] } = useQuery<Material[]>({ queryKey: ["consumibles"], queryFn: getConsumibles });
    const { data: reactivos = [] } = useQuery<Material[]>({ queryKey: ["reactivos"], queryFn: getReactivos });
    const { data: buffersGelOligo = [] } = useQuery<Material[]>({ queryKey: ["buffersGelOligo"], queryFn: getBGO });
    const { data: cuantificacionConsumibles = [] } = useQuery<CuantificacionConsumible[]>({ queryKey: ["cuantificacionConsumibles"], queryFn: getCuantiCons });

    const createMutation = useMutation({
        mutationFn: (data: CuantificacionConsumible) => createCuantiCons(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuantificacionConsumibles"] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: CuantificacionConsumible }) => updateCuantiCons(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuantificacionConsumibles"] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCuantiCons(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuantificacionConsumibles"] })
    });

    const [open, setOpen] = useState(false);
    const [editando, setEditando] = useState(false);
    const [cuantiConsId, setCuantiConsId] = useState<number | null>(null);
    const [selectedCuantificacion, setSelectedCuantificacion] = useState<number | "">("");
    const [selectedMaterial, setSelectedMaterial] = useState<{ type: string; id: number | "" }>({ type: "", id: "" });
    const [cantidad, setCantidad] = useState(0);
    const [costo, setCosto] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = () => {
        setEditando(false);
        setCuantiConsId(null);
        setSelectedCuantificacion("");
        setSelectedMaterial({ type: "", id: "" });
        setCantidad(0);
        setCosto(0);
        setOpen(true);
    };

    const handleClose = () => {
        setCuantiConsId(null);
        setEditando(false);
        setOpen(false);
    };

    const handleEdit = (cc: CuantificacionConsumible) => {
        setEditando(true);
        setCuantiConsId(cc.id && !isNaN(Number(cc.id)) ? Number(cc.id) : null);
        setSelectedCuantificacion(cc.cuantificacion);
        setCantidad(cc.cantidad);
        setCosto(cc.costo);

        const tipoMaterial =
            cc.consumible ? "consumible" :
                cc.reactivo ? "reactivo" :
                    cc.buffer_gel_oligo ? "buffer_gel_oligo" : "";

        setSelectedMaterial({ type: tipoMaterial, id: cc.consumible || cc.reactivo || cc.buffer_gel_oligo || "" });

        setOpen(true);
    };

    const handleSubmit = async () => {
        if (!selectedCuantificacion || !selectedMaterial.id) {
            console.error("❌ Error: Debes seleccionar una cuantificación y un material.");
            return;
        }

        const newCuantiCons: CuantificacionConsumible = {
            cuantificacion: selectedCuantificacion,
            cantidad: Number(cantidad),
            costo: 0, // El backend calculará el costo
            consumible: selectedMaterial.type === "consumible" ? selectedMaterial.id : null,
            reactivo: selectedMaterial.type === "reactivo" ? selectedMaterial.id : null,
            buffer_gel_oligo: selectedMaterial.type === "buffer_gel_oligo" ? selectedMaterial.id : null
        };

        try {
            if (editando && cuantiConsId !== null && !isNaN(cuantiConsId)) {
                await updateMutation.mutateAsync({ id: cuantiConsId, data: newCuantiCons });
            } else {
                await createMutation.mutateAsync(newCuantiCons);
            }

            handleClose();
            queryClient.invalidateQueries({ queryKey: ["cuantificacionConsumibles"] });
        } catch (error) {
            console.error("⚠️ Error en la mutación:", error);
        }
    };

    const getMaterialList = () => {
        switch (selectedMaterial.type) {
            case "consumible":
                return consumibles;
            case "reactivo":
                return reactivos;
            case "buffer_gel_oligo":
                return buffersGelOligo;
            default:
                return [];
        }
    };

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${inter.className} text-2xl`}>Gestión de Cuantificación Consumible</h1>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={handleOpen}>
                        <PlusIcon className="h-5 md:ml-4" />
                        Agregar
                    </Button>
                </div>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Cuantificación</TableCell>
                            <TableCell>Material</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Costo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {cuantificacionConsumibles.map((cc) => (
                            <TableRow key={cc.id}>
                                <TableCell>{cc.id}</TableCell>
                                <TableCell>{cc.cuantificacion}</TableCell>
                                <TableCell>{cc.consumible ? "Consumible" : cc.reactivo ? "Reactivo" : cc.buffer_gel_oligo ? "Buffer/Gel/Oligo" : "N/A"}</TableCell>
                                <TableCell>{cc.cantidad}</TableCell>
                                <TableCell>${cc.costo}</TableCell>
                                <TableCell>
                                    <Button variant="outlined" onClick={() => handleEdit(cc)}>
                                        <PencilIcon className="w-5" />Editar
                                    </Button>
                                    <Button variant="contained" color="error" onClick={() => deleteMutation.mutate(cc.id!)}>
                                        <TrashIcon className="w-5" />Eliminar
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editando ? "Editar Material de Cuantificación" : "Agregar Material a Cuantificación"}</DialogTitle>
                    <DialogContent>
                        {/* Selección de Cuantificación */}
                        <Select fullWidth value={selectedCuantificacion} onChange={(e) => setSelectedCuantificacion(e.target.value === "" ? "" : Number(e.target.value))}>
                            <MenuItem value="">Seleccionar Cuantificación</MenuItem>
                            {cuantificaciones.map((cuantificacion) => (
                                <MenuItem key={cuantificacion.id} value={cuantificacion.id}>{cuantificacion.nombre}</MenuItem>
                            ))}
                        </Select>

                        {/* Selección del Tipo de Material */}
                        <Select fullWidth value={selectedMaterial.type} onChange={(e) => setSelectedMaterial({ type: e.target.value, id: "" })}>
                            <MenuItem value="">Seleccionar Tipo de Material</MenuItem>
                            <MenuItem value="consumible">Consumible</MenuItem>
                            <MenuItem value="reactivo">Reactivo</MenuItem>
                            <MenuItem value="buffer_gel_oligo">Buffer, Gel u Oligo</MenuItem>
                        </Select>

                        {/* Selección del Material Específico */}
                        <Select
                            fullWidth
                            value={selectedMaterial.id}
                            onChange={(e) =>
                                setSelectedMaterial({ ...selectedMaterial, id: e.target.value === "" ? "" : Number(e.target.value) })
                            }
                        >
                            <MenuItem value="">Seleccionar Material</MenuItem>
                            {getMaterialList().map((m) => (
                                <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>
                            ))}
                        </Select>

                        {/* Cantidad */}
                        <TextField fullWidth type="number" label="Cantidad" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
                        {/* Costo (calculado por el backend) */}
                        <TextField fullWidth type="number" label="Costo" value={costo} disabled />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {editando ? "Actualizar" : "Guardar"}
                        </Button>
                    </DialogActions>
                </Dialog>


            </div>
        </div>
    );
}