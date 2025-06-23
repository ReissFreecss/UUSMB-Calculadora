"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getConsumibles, createConsumible, updateConsumible, deleteConsumible, getPlataformas } from "../api-costos";
import {
    Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Snackbar, Alert, Pagination, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Search from "@/app/costos/ui/search";
import { inter } from "@/app/costos/ui/fonts";

interface Consumible {
    id?: number;
    nombre: string;
    tipo?: string;
    presentacion?: number;
    unidad_medida?: string;
    rxn?: number;
    precio_presentacion_iva?: number;
    precio_unitario?: number;
    plataforma?: number;
    fecha_actualizacion?: string;
}

interface Plataforma {
    id: number;
    nombre: string;
}

interface NotificationState {
    open: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

export default function ConsumiblePage() {
    const queryClient = useQueryClient();
    const { data: consumibles = [], error, isLoading } = useQuery({ queryKey: ["consumibles"], queryFn: getConsumibles });
    const { data: plataformas = [], error: plataformasError } = useQuery({ queryKey: ["plataformas"], queryFn: getPlataformas });

    const createMutation = useMutation({
        mutationFn: (data: Consumible) => createConsumible(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consumibles"] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Consumible }) => updateConsumible(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consumibles"] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteConsumible(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["consumibles"] })
    });

    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: "", type: "success" });
    const [editingConsumible, setEditingConsumible] = useState<Consumible | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (consumible: Consumible | null = null) => {
        setEditingConsumible(consumible ?? { nombre: "", tipo: "", presentacion: 0, unidad_medida: "", rxn: 0, precio_presentacion_iva: 0, precio_unitario: 0, plataforma: plataformas.length ? plataformas[0].id : 0 });
        setOpen(true);
    };

    const handleClose = () => {
        setEditingConsumible(null);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!editingConsumible) return;

        try {
            if (editingConsumible.id) {
                await updateMutation.mutateAsync({ id: editingConsumible.id, data: editingConsumible });
            } else {
                await createMutation.mutateAsync(editingConsumible);
            }

            setNotification({ open: true, message: "Consumible guardado correctamente.", type: "success" });
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["consumibles"] });

        } catch (error) {
            setNotification({ open: true, message: "Error al guardar el consumible.", type: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            setNotification({ open: true, message: "Consumible eliminado correctamente.", type: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Error al eliminar el consumible.", type: "error" });
        }
    };

    const filteredConsumibles: Consumible[] = consumibles.filter((consumible: Consumible) =>
        consumible.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${inter.className} text-2xl`}>Gestión de Consumibles</h1>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar Consumible..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        <PlusIcon className="h-5 md:ml-4" />
                        Agregar Consumible
                    </Button>
                </div>

                {isLoading ? <p>Cargando consumibles...</p> : error ? <p>Error al obtener los consumibles.</p> : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Presentación</TableCell>
                                    <TableCell>Unidad de Medida</TableCell>
                                    <TableCell>RXN</TableCell>
                                    <TableCell>Precio Presentación IVA</TableCell>
                                    <TableCell>Precio Unitario</TableCell>
                                    <TableCell>Plataforma</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredConsumibles.slice((page - 1) * 5, page * 5).map((consumible: Consumible) => (
                                    <TableRow key={consumible.id}>
                                        <TableCell>{consumible.id}</TableCell>
                                        <TableCell>{consumible.nombre}</TableCell>
                                        <TableCell>{consumible.tipo}</TableCell>
                                        <TableCell>{consumible.presentacion}</TableCell>
                                        <TableCell>{consumible.unidad_medida}</TableCell>
                                        <TableCell>{consumible.rxn}</TableCell>
                                        <TableCell>${consumible.precio_presentacion_iva}</TableCell>
                                        <TableCell>${consumible.precio_unitario}</TableCell>
                                        <TableCell>{plataformas?.length
                                            ? plataformas.find((p: Plataforma) => p.id === consumible.plataforma)?.nombre || "N/A"
                                            : "Cargando..."}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleOpen(consumible)}>
                                                <PencilIcon className="w-5" />Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(consumible.id!)}>
                                                <TrashIcon className="w-5" />Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination count={Math.ceil(consumibles.length / 5)} page={page} onChange={(e, value) => setPage(value)} />
                    </>
                )}

                <Snackbar open={notification.open} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.type}>{notification.message}</Alert>
                </Snackbar>

                <Dialog open={open} onClose={handleClose}>
    <DialogTitle>{editingConsumible?.id ? "Editar Consumible" : "Agregar Consumible"}</DialogTitle>
    <DialogContent>
        {/* Nombre */}
        <TextField
            label="Nombre"
            fullWidth
            margin="dense"
            value={editingConsumible?.nombre || ""}
            onChange={(e) => setEditingConsumible({ ...editingConsumible!, nombre: e.target.value })}
        />

        {/* Tipo */}
        <TextField
            label="Tipo"
            fullWidth
            margin="dense"
            value={editingConsumible?.tipo || ""}
            onChange={(e) => setEditingConsumible({ ...editingConsumible!, tipo: e.target.value })}
        />

        {/* Presentación */}
        <TextField
            label="Presentación"
            type="number"
            fullWidth
            margin="dense"
            value={editingConsumible?.presentacion || ""}
            onChange={(e) => setEditingConsumible({ ...editingConsumible!, presentacion: Number(e.target.value) })}
        />

        {/* Unidad de Medida */}
        <TextField
            label="Unidad de Medida"
            fullWidth
            margin="dense"
            value={editingConsumible?.unidad_medida || ""}
            onChange={(e) => setEditingConsumible({ ...editingConsumible!, unidad_medida: e.target.value })}
        />

        {/* RXN */}
        <TextField
            label="RXN"
            type="number"
            fullWidth
            margin="dense"
            value={editingConsumible?.rxn || ""}
            onChange={(e) => setEditingConsumible({ ...editingConsumible!, rxn: Number(e.target.value) })}
        />

        {/* Precio Presentación IVA */}
        <TextField
            label="Precio Presentación IVA"
            type="number"
            fullWidth
            margin="dense"
            value={editingConsumible?.precio_presentacion_iva || ""}
            onChange={(e) => setEditingConsumible({ ...editingConsumible!, precio_presentacion_iva: Number(e.target.value) })}
        />

        {/* Precio Unitario */}
        <TextField
            label="Precio Unitario"
            type="number"
            fullWidth
            margin="dense"
            value={editingConsumible?.precio_unitario || ""}
            onChange={(e) => setEditingConsumible({ ...editingConsumible!, precio_unitario: Number(e.target.value) })}
        />

        {/* Plataforma */}
        <FormControl fullWidth margin="dense">
            <InputLabel>Plataforma</InputLabel>
            <Select
                value={editingConsumible?.plataforma || ""}
                onChange={(e) => setEditingConsumible({ ...editingConsumible!, plataforma: Number(e.target.value) })}
            >
                {plataformas.map((plataforma: Plataforma) => (
                    <MenuItem key={plataforma.id} value={plataforma.id}>
                        {plataforma.nombre}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    </DialogContent>
    <DialogActions>
        <Button onClick={handleClose}>Cancelar</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
            {editingConsumible?.id ? "Actualizar" : "Guardar"}
        </Button>
    </DialogActions>
</Dialog>

            </div>
        </div>
    );
}