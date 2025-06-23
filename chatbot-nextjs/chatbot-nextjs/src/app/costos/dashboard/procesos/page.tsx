"use client"
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getProcesos,
    createProceso,
    updateProceso,
    deleteProceso,
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

interface Proceso {
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

export default function ProcesosPage() {
    const queryClient = useQueryClient();
    const { data: procesos = [], error, isLoading } = useQuery({ queryKey: ["procesos"], queryFn: getProcesos });
    const { data: plataformas = [] } = useQuery({ queryKey: ["plataformas"], queryFn: getPlataformas });

    const createMutation = useMutation({
        mutationFn: (data: Proceso) => createProceso({ nombre: data.nombre, plataforma: data.plataforma }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["procesos"] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Proceso }) => updateProceso(id, { nombre: data.nombre, plataforma: data.plataforma }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["procesos"] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteProceso(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["procesos"] })
    });

    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: "", type: "success" });
    const [editingProceso, setEditingProceso] = useState<Proceso | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (proceso: Proceso | null = null) => {
        setEditingProceso(proceso ?? { nombre: "", costo: 0, plataforma: plataformas.length ? plataformas[0].id : 0 });
        setOpen(true);
    };

    const handleClose = () => {
        setEditingProceso(null);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!editingProceso) return;

        try {
            const newProceso = {
                nombre: editingProceso.nombre,
                plataforma: editingProceso.plataforma
            };

            if (editingProceso.id) {
                await updateMutation.mutateAsync({ id: editingProceso.id, data: newProceso });
            } else {
                await createMutation.mutateAsync(newProceso);
            }

            setNotification({ open: true, message: "Proceso guardado correctamente.", type: "success" });
            handleClose();
        } catch (error) {
            setNotification({ open: true, message: "Error al guardar el proceso.", type: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            setNotification({ open: true, message: "Proceso eliminado correctamente.", type: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Error al eliminar el proceso.", type: "error" });
        }
    };

    const filteredProcesos = procesos.filter((p: Proceso) =>
        p.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${inter.className} text-2xl`}>Gestión de Procesos</h1>
                </div>

                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar Proceso..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        <PlusIcon className="h-5 md:ml-4" />
                        Agregar Proceso
                    </Button>
                </div>

                {isLoading ? <p>Cargando datos...</p> : error ? <p>Error al obtener procesos.</p> : (
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
                                {filteredProcesos.slice((page - 1) * 5, page * 5).map((p: Proceso) => (
                                    <TableRow key={p.id}>
                                        <TableCell>{p.id}</TableCell>
                                        <TableCell>{p.nombre}</TableCell>
                                        <TableCell>${p.costo}</TableCell>
                                        <TableCell>{plataformas.find((pl: Plataforma) => pl.id === p.plataforma)?.nombre || "N/A"}</TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleOpen(p)}>
                                                <PencilIcon className="w-5" />Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(p.id!)}>
                                                <TrashIcon className="w-5" />Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination count={Math.ceil(procesos.length / 5)} page={page} onChange={(e, value) => setPage(value)} />
                    </>
                )}

                <Snackbar open={notification.open} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.type}>{notification.message}</Alert>
                </Snackbar>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingProceso?.id ? "Editar Proceso" : "Agregar Proceso"}</DialogTitle>
                    <DialogContent>
                        <TextField
                            label="Nombre"
                            fullWidth
                            margin="dense"
                            value={editingProceso?.nombre || ""}
                            onChange={(e) => setEditingProceso({ ...editingProceso!, nombre: e.target.value })}
                        />
                        <TextField
                            label="Costo"
                            type="number"
                            fullWidth
                            margin="dense"
                            value={editingProceso?.costo || ""}
                            disabled
                        />
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Plataforma</InputLabel>
                            <Select
                                value={editingProceso?.plataforma || ""}
                                onChange={(e) => setEditingProceso({ ...editingProceso!, plataforma: Number(e.target.value) })}
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
                            {editingProceso?.id ? "Actualizar" : "Crear"}
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        </div>
    );
}