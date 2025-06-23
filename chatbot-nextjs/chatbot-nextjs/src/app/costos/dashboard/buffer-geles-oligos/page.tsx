"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getBGO, createBGO, updateBGO, deleteBGO, getPlataformas } from "../api-costos";
import {
    Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Snackbar, Alert, Pagination, FormControl, InputLabel, Select, MenuItem
} from "@mui/material";
import { PlusIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";
import Search from "@/app/costos/ui/search";
import { inter } from "@/app/costos/ui/fonts";

interface BufferGelOligo {
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

export default function BufferGelOligoPage() {
    const queryClient = useQueryClient();
    const { data: buffersGelOligo = [], error, isLoading } = useQuery({ queryKey: ["buffersGelOligo"], queryFn: getBGO });
    const { data: plataformas = [], error: plataformasError } = useQuery({ queryKey: ["plataformas"], queryFn: getPlataformas });

    const createMutation = useMutation({
        mutationFn: (data: BufferGelOligo) => createBGO({ nombre: data.nombre, plataforma: data.plataforma }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buffersGelOligo"] })
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: BufferGelOligo }) => updateBGO(id, { nombre: data.nombre, plataforma: data.plataforma }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buffersGelOligo"] })
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => deleteBGO(id),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["buffersGelOligo"] })
    });

    const [open, setOpen] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: "", type: "success" });
    const [editingBufferGelOligo, setEditingBufferGelOligo] = useState<BufferGelOligo | null>(null);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    const handleOpen = (bgo: BufferGelOligo | null = null) => {
        setEditingBufferGelOligo(bgo ?? { nombre: "", costo: 0, plataforma: plataformas.length ? plataformas[0].id : 0 });
        setOpen(true);
    };

    const handleClose = () => {
        setEditingBufferGelOligo(null);
        setOpen(false);
    };

    const handleSubmit = async () => {
        if (!editingBufferGelOligo) return;

        try {
            const newBGO = {
                nombre: editingBufferGelOligo.nombre,
                plataforma: editingBufferGelOligo.plataforma,
            };

            if (editingBufferGelOligo.id) {
                await updateMutation.mutateAsync({ id: editingBufferGelOligo.id, data: newBGO });
            } else {
                await createMutation.mutateAsync(newBGO);
            }

            setNotification({ open: true, message: "Buffer/Gel/Oligo guardado correctamente.", type: "success" });
            handleClose();
            queryClient.invalidateQueries({ queryKey: ["buffersGelOligo"] });

        } catch (error) {
            setNotification({ open: true, message: "Error al guardar Buffer/Gel/Oligo.", type: "error" });
        }
    };

    const handleDelete = async (id: number) => {
        try {
            await deleteMutation.mutateAsync(id);
            setNotification({ open: true, message: "Buffer/Gel/Oligo eliminado correctamente.", type: "success" });
        } catch (error) {
            setNotification({ open: true, message: "Error al eliminar Buffer/Gel/Oligo.", type: "error" });
        }
    };

    const filteredBuffersGelOligo: BufferGelOligo[] = buffersGelOligo.filter((bgo: BufferGelOligo) =>
        bgo.nombre.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <div className="flex w-full items-center justify-between">
                    <h1 className={`${inter.className} text-2xl`}>Gestión de Buffer/Gel/Oligo</h1>
                </div>
                <div className="mt-4 flex items-center justify-between gap-2 md:mt-8">
                    <Search placeholder="Buscar Buffer/Gel/Oligo..." onChange={(e) => setSearchTerm(e.target.value)} />
                    <Button variant="contained" color="primary" onClick={() => handleOpen()}>
                        <PlusIcon className="h-5 md:ml-4" />
                        Agregar Buffer/Gel/Oligo
                    </Button>
                </div>

                {isLoading ? <p>Cargando datos...</p> : error ? <p>Error al obtener Buffer/Gel/Oligo.</p> : (
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
                                {filteredBuffersGelOligo.slice((page - 1) * 5, page * 5).map((bgo: BufferGelOligo) => (
                                    <TableRow key={bgo.id}>
                                        <TableCell>{bgo.id}</TableCell>
                                        <TableCell>{bgo.nombre}</TableCell>
                                        <TableCell>${bgo.costo}</TableCell>
                                        <TableCell>{plataformas?.length
                                            ? plataformas.find((p: Plataforma) => p.id === bgo.plataforma)?.nombre || "N/A"
                                            : "Cargando..."}
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="outlined" onClick={() => handleOpen(bgo)}>
                                                <PencilIcon className="w-5" />Editar
                                            </Button>
                                            <Button variant="contained" color="error" onClick={() => handleDelete(bgo.id!)}>
                                                <TrashIcon className="w-5" />Eliminar
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                        <Pagination count={Math.ceil(buffersGelOligo.length / 5)} page={page} onChange={(e, value) => setPage(value)} />
                    </>
                )}

                <Snackbar open={notification.open} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.type}>{notification.message}</Alert>
                </Snackbar>

                <Dialog open={open} onClose={handleClose}>
                    <DialogTitle>{editingBufferGelOligo?.id ? "Editar Buffer/Gel/Oligo" : "Agregar Buffer/Gel/Oligo"}</DialogTitle>
                    <DialogContent>
                        {/* Nombre del Buffer/Gel/Oligo */}
                        <TextField
                            label="Nombre"
                            fullWidth
                            margin="dense"
                            value={editingBufferGelOligo?.nombre || ""}
                            onChange={(e) => setEditingBufferGelOligo({ ...editingBufferGelOligo!, nombre: e.target.value })}
                        />

                        {/* Costo (el backend lo maneja) */}
                        <TextField
                            label="Costo"
                            type="number"
                            fullWidth
                            margin="dense"
                            value={editingBufferGelOligo?.costo || ""}
                            disabled
                        />

                        {/* Selector de plataformas dinámico */}
                        <FormControl fullWidth margin="dense">
                            <InputLabel>Plataforma</InputLabel>
                            <Select
                                value={editingBufferGelOligo?.plataforma || ""}
                                onChange={(e) => setEditingBufferGelOligo({ ...editingBufferGelOligo!, plataforma: Number(e.target.value) })}
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
                            {editingBufferGelOligo?.id ? "Actualizar" : "Crear"}
                        </Button>
                    </DialogActions>
                </Dialog>

            </div>
        </div>
    );
}