"use client"
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getCuantificaciones,
    createCuantificacion,
    updateCuantificacion,
    deleteCuantificacion,
    getPlataformas
} from "../api-costos";
import {
    Button, Table, TableHead, TableRow, TableCell, TableBody,
    Dialog, DialogTitle, DialogContent, TextField, DialogActions,
    Snackbar, Alert, Pagination, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Search from "@/app/costos/ui/search";
import { inter } from "@/app/costos/ui/fonts";

interface Cuantificacion {
    id?: number;
    nombre: string;
    costo?: number;
    plataforma?: number;
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

export default function CuantificacionesPage() {
    const queryClient = useQueryClient();
    const { data: cuantificaciones = [], error, isLoading } = useQuery({ queryKey: ["cuantificaciones"], queryFn: getCuantificaciones });
    const { data: plataformas = [] } = useQuery({ queryKey: ["plataformas"], queryFn: getPlataformas });

    const createMutation = useMutation({
        mutationFn: (data: Cuantificacion) => createCuantificacion(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuantificaciones"] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Cuantificacion }) => updateCuantificacion(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuantificaciones"] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteCuantificacion(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cuantificaciones"] })
    });

    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: "", type: "success" });
    const [editingCuantificacion, setEditingCuantificacion] = useState<Cuantificacion | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (cuant: Cuantificacion | null = null) => {
        setEditingCuantificacion(cuant ?? { nombre: "", costo: 0, plataforma: plataformas.length ? plataformas[0].id : 0 });
        setOpen(true);
    };

    const handleClose = () => {
        setEditingCuantificacion(null);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!editingCuantificacion) return;

        try {
            if (editingCuantificacion.id) {
                await updateMutation.mutateAsync({ id: editingCuantificacion.id, data: editingCuantificacion });
            } else {
                await createMutation.mutateAsync(editingCuantificacion);
            }

            setNotification({ open: true, message: "Cuantificación guardada correctamente.", type: "success" });
            handleClose();
        } catch (error) {
            setNotification({ open: true, message: "Error al guardar la cuantificación.", type: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            setNotification({ open: true, message: "Cuantificación eliminada correctamente.", type: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Error al eliminar la cuantificación.", type: "error" });
        }
    };

    const filteredCuantificaciones = cuantificaciones.filter((c: Cuantificacion) =>
        c.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${inter.className} text-2xl`}>Gestión de Cuantificaciones</h1>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar Cuantificación..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        <PlusIcon className="h-5 md:ml-4" />
                        Agregar Cuantificación
                    </Button>
                </div>

                {isLoading ? <p>Cargando datos...</p> : error ? <p>Error al obtener cuantificaciones.</p> : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Costo</TableCell>
                                    <TableCell>Plataforma</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredCuantificaciones.slice((page - 1) * 5, page * 5).map((c: Cuantificacion) => (
                                    <TableRow key={c.id}>
                                        <TableCell>{c.id}</TableCell>
                                        <TableCell>{c.nombre}</TableCell>
                                        <TableCell>${c.costo}</TableCell>
                                        <TableCell>{plataformas.find((pl: Plataforma) => pl.id === c.plataforma)?.nombre || "N/A"}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleOpen(c)}>
                                                <PencilIcon className="w-5" />Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(c.id!)}>
                                                <TrashIcon className="w-5" />Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination count={Math.ceil(cuantificaciones.length / 5)} page={page} onChange={(e, value) => setPage(value)} />
                    </>
                )}

                <Snackbar open={notification.open} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.type}>{notification.message}</Alert>
                </Snackbar>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingCuantificacion?.id ? "Editar Cuantificación" : "Agregar Cuantificación"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Nombre"
                            fullWidth
                            margin="dense"
                            value={editingCuantificacion?.nombre || ""}
                            onChange={(e) => setEditingCuantificacion({ ...editingCuantificacion!, nombre: e.target.value })}
                        />
                        <TextField
                            label="Costo"
                            type="number"
                            fullWidth
                            margin="dense"
                            value={editingCuantificacion?.costo || ""}
                            onChange={(e) => setEditingCuantificacion({ ...editingCuantificacion!, costo: Number(e.target.value) })}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Plataforma</InputLabel>
                            <Select
                                value={editingCuantificacion?.plataforma || ""}
                                onChange={(e) => setEditingCuantificacion({ ...editingCuantificacion!, plataforma: Number(e.target.value) })}
                            >
                                {plataformas.map((pl: Plataforma) => (
                                    <MenuItem key={pl.id} value={pl.id}>{pl.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button onClick={handleSubmit} variant="contained" color="primary">
                            {editingCuantificacion?.id ? "Actualizar" : "Crear"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}