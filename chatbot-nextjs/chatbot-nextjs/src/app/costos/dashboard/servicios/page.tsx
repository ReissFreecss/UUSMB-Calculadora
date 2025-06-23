"use client"
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getServicios,
    createServicio,
    updateServicio,
    deleteServicio,
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

interface Servicio {
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

export default function ServiciosPage() {
    const queryClient = useQueryClient();
    const { data: servicios = [], error, isLoading } = useQuery({ queryKey: ["servicios"], queryFn: getServicios });
    const { data: plataformas = [] } = useQuery({ queryKey: ["plataformas"], queryFn: getPlataformas });

    const createMutation = useMutation({
        mutationFn: (data: Servicio) => createServicio(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servicios"] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Servicio }) => updateServicio(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servicios"] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteServicio(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["servicios"] })
    });

    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: "", type: "success" });
    const [editingServicio, setEditingServicio] = useState<Servicio | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (servicio: Servicio | null = null) => {
        setEditingServicio(servicio ?? { nombre: "", costo: 0, plataforma: plataformas.length ? plataformas[0].id : 0 });
        setOpen(true);
    };

    const handleClose = () => {
        setEditingServicio(null);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!editingServicio) return;

        try {
            if (editingServicio.id) {
                await updateMutation.mutateAsync({ id: editingServicio.id, data: editingServicio });
            } else {
                await createMutation.mutateAsync(editingServicio);
            }

            setNotification({ open: true, message: "Servicio guardado correctamente.", type: "success" });
            handleClose();
        } catch (error) {
            setNotification({ open: true, message: "Error al guardar el servicio.", type: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            setNotification({ open: true, message: "Servicio eliminado correctamente.", type: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Error al eliminar el servicio.", type: "error" });
        }
    };

    const filteredServicios = servicios.filter((s: Servicio) =>
        s.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${inter.className} text-2xl`}>Gestión de Servicios</h1>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar Servicio..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        <PlusIcon className="h-5 md:ml-4" />
                        Agregar Servicio
                    </Button>
                </div>

                {isLoading ? <p>Cargando datos...</p> : error ? <p>Error al obtener servicios.</p> : (
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
                                {filteredServicios.slice((page - 1) * 5, page * 5).map((s: Servicio) => (
                                    <TableRow key={s.id}>
                                        <TableCell>{s.id}</TableCell>
                                        <TableCell>{s.nombre}</TableCell>
                                        <TableCell>${s.costo}</TableCell>
                                        <TableCell>{plataformas.find((pl: Plataforma) => pl.id === s.plataforma)?.nombre || "N/A"}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleOpen(s)}>
                                                <PencilIcon className="w-5" />Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(s.id!)}>
                                                <TrashIcon className="w-5" />Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination count={Math.ceil(servicios.length / 5)} page={page} onChange={(e, value) => setPage(value)} />
                    </>
                )}

                <Snackbar open={notification.open} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.type}>{notification.message}</Alert>
                </Snackbar>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingServicio?.id ? "Editar Servicio" : "Agregar Servicio"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Nombre"
                            fullWidth
                            margin="dense"
                            value={editingServicio?.nombre || ""}
                            onChange={(e) => setEditingServicio({ ...editingServicio!, nombre: e.target.value })}
                        />
                        <TextField
                            label="Costo"
                            type="number"
                            fullWidth
                            margin="dense"
                            value={editingServicio?.costo || ""}
                            onChange={(e) => setEditingServicio({ ...editingServicio!, costo: Number(e.target.value) })}
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Plataforma</InputLabel>
                            <Select
                                value={editingServicio?.plataforma || ""}
                                onChange={(e) => setEditingServicio({ ...editingServicio!, plataforma: Number(e.target.value) })}
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
                            {editingServicio?.id ? "Actualizar" : "Crear"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}