"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getReactivos,
    createReactivo,
    updateReactivo,
    deleteReactivo,
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

interface Reactivo {
    id?: number;
    nombre: string;
    presentacion: string;
    precio_presentacion_iva: number;
    precio_unitario: number;
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

export default function ReactivoPage() {
    const queryClient = useQueryClient();
    const { data: reactivos = [], error, isLoading } = useQuery({ queryKey: ["reactivos"], queryFn: getReactivos });
    const { data: plataformas = [], error: plataformasError } = useQuery({ queryKey: ["plataformas"], queryFn: getPlataformas });

    const createMutation = useMutation({
        mutationFn: (data: Reactivo) => createReactivo(data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reactivos"] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Reactivo }) => updateReactivo(id, data),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reactivos"] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteReactivo(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["reactivos"] })
    });

    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: "", type: "success" });
    const [editingReactivo, setEditingReactivo] = useState<Reactivo | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (reactivo: Reactivo | null = null) => {
        setEditingReactivo(
            reactivo ?? {
                nombre: "",
                presentacion: "",
                precio_presentacion_iva: 0,
                precio_unitario: 0,
                plataforma: plataformas.length ? plataformas[0].id : undefined
            }
        );
        setOpen(true);
    };

    const handleClose = () => {
        setEditingReactivo(null);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!editingReactivo) return;

        try {
            if (editingReactivo.id) {
                await updateMutation.mutateAsync({ id: editingReactivo.id, data: editingReactivo });
            } else {
                await createMutation.mutateAsync(editingReactivo);
            }
            setNotification({ open: true, message: "Reactivo guardado correctamente.", type: "success" });
            handleClose();
        } catch (error) {
            setNotification({ open: true, message: "Error al guardar el reactivo.", type: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            setNotification({ open: true, message: "Reactivo eliminado correctamente.", type: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Error al eliminar el reactivo.", type: "error" });
        }
    };

    const filteredReactivos = reactivos.filter((r: Reactivo) =>
        r.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${inter.className} text-2xl`}>Gestión de Reactivos</h1>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar Reactivo..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        <PlusIcon className="h-5 md:ml-4" />
                        Agregar Reactivo
                    </Button>
                </div>

                {isLoading ? <p>Cargando reactivos...</p> : error ? <p>Error al obtener los reactivos.</p> : (
                    <>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>ID</TableCell>
                                    <TableCell>Nombre</TableCell>
                                    <TableCell>Presentación</TableCell>
                                    <TableCell>Precio Presentación IVA</TableCell>
                                    <TableCell>Precio Unitario</TableCell>
                                    <TableCell>Plataforma</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {filteredReactivos.slice((page - 1) * 5, page * 5).map((r: Reactivo) => (
                                    <TableRow key={r.id}>
                                        <TableCell>{r.id}</TableCell>
                                        <TableCell>{r.nombre}</TableCell>
                                        <TableCell>{r.presentacion}</TableCell>
                                        <TableCell>${r.precio_presentacion_iva}</TableCell>
                                        <TableCell>${r.precio_unitario}</TableCell>
                                        <TableCell>
                                            {plataformas.length
                                                ? plataformas.find((p: Plataforma) => p.id === r.plataforma)?.nombre || "N/A"
                                                : "Cargando..."}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleOpen(r)}>
                                                <PencilIcon className="w-5" />Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(r.id!)}>
                                                <TrashIcon className="w-5" />Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination count={Math.ceil(reactivos.length / 5)} page={page} onChange={(e, val) => setPage(val)} />
                    </>
                )}

                <Snackbar open={notification.open} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.type}>{notification.message}</Alert>
                </Snackbar>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingReactivo?.id ? "Editar Reactivo" : "Agregar Reactivo"}</DialogTitle>
                    <DialogContent>
                        <TextField label="Nombre" fullWidth margin="dense" value={editingReactivo?.nombre || ""} onChange={(e) => setEditingReactivo({ ...editingReactivo!, nombre: e.target.value })} />
                        <TextField label="Presentación" fullWidth margin="dense" value={editingReactivo?.presentacion || ""} onChange={(e) => setEditingReactivo({ ...editingReactivo!, presentacion: e.target.value })} />
                        <TextField label="Precio Presentación IVA" type="number" fullWidth margin="dense" value={editingReactivo?.precio_presentacion_iva || 0} onChange={(e) => setEditingReactivo({ ...editingReactivo!, precio_presentacion_iva: parseFloat(e.target.value) })} />
                        <TextField label="Precio Unitario" type="number" fullWidth margin="dense" value={editingReactivo?.precio_unitario || 0} onChange={(e) => setEditingReactivo({ ...editingReactivo!, precio_unitario: parseFloat(e.target.value) })} />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Plataforma</InputLabel>
                            <Select value={editingReactivo?.plataforma || ""} onChange={(e) => setEditingReactivo({ ...editingReactivo!, plataforma: Number(e.target.value) })}>
                                {plataformas.map((p: Plataforma) => (
                                    <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
                            </DialogActions>
                            </Dialog>
                        </div>
                    </div>
                );
        }