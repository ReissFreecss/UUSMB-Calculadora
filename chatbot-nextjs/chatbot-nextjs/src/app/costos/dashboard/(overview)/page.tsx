"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPlataformas, createPlataforma, getControlCambios, createControlCambio } from "../api-costos";
import {
    Button, Table, TableHead, TableRow, TableCell, TableBody, Dialog, DialogTitle,
    DialogContent, TextField, DialogActions, Snackbar, Alert
} from "@mui/material";
import { PlusIcon } from "@heroicons/react/24/outline";
import { inter } from "@/app/costos/ui/fonts";

interface Plataforma {
    id?: number;
    nombre: string;
}

interface ControlCambio {
    id?: number;
    fecha: string;
    usuario: string;
    modificacion: string;
}

interface NotificationState {
    open: boolean;
    message: string;
    type: "success" | "error" | "warning" | "info";
}

export default function PlataformaCambiosPage() {
    const queryClient = useQueryClient();

    // Obtener plataformas
    const { data: plataformas = [], error: errorPlataformas, isLoading: isLoadingPlataformas } = useQuery({
        queryKey: ["plataformas"],
        queryFn: getPlataformas
    });

    // Obtener historial de cambios
    const { data: cambios = [], error: errorCambios, isLoading: isLoadingCambios } = useQuery({
        queryKey: ["control_cambios"],
        queryFn: getControlCambios
    });

    const createPlataformaMutation = useMutation({
        mutationFn: (data: Plataforma) => createPlataforma({ nombre: data.nombre }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["plataformas"] })
    });

    const createCambioMutation = useMutation({
        mutationFn: (data: ControlCambio) => createControlCambio({ usuario: data.usuario, modificacion: data.modificacion }),
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["control_cambios"] })
    });

    const [openPlataforma, setOpenPlataforma] = useState(false);
    const [openCambio, setOpenCambio] = useState(false);
    const [notification, setNotification] = useState<NotificationState>({ open: false, message: "", type: "success" });
    const [nuevaPlataforma, setNuevaPlataforma] = useState("");
    const [nuevoCambio, setNuevoCambio] = useState({ usuario: "", modificacion: "" });

    const handleOpenPlataforma = () => setOpenPlataforma(true);
    const handleClosePlataforma = () => setOpenPlataforma(false);

    const handleOpenCambio = () => setOpenCambio(true);
    const handleCloseCambio = () => setOpenCambio(false);

    const handleSubmitPlataforma = async () => {
        try {
            await createPlataformaMutation.mutateAsync({ nombre: nuevaPlataforma });
            setNotification({ open: true, message: "Plataforma agregada correctamente.", type: "success" });
            handleClosePlataforma();
        } catch (error) {
            setNotification({ open: true, message: "Error al agregar plataforma.", type: "error" });
        }
    };

    const handleSubmitCambio = async () => {
        try {
            await createCambioMutation.mutateAsync({ ...nuevoCambio, fecha: new Date().toISOString() });
            setNotification({ open: true, message: "Cambio registrado correctamente.", type: "success" });
            handleCloseCambio();
        } catch (error) {
            setNotification({ open: true, message: "Error al registrar cambio.", type: "error" });
        }
    };

    return (
        <div className="ml-20 md:ml-1 p-4 md:p-2 mx-auto transition-all duration-300">
            <div className="w-full">
                <h1 className={`${inter.className} text-2xl`}>Gestión de Plataformas y Control de Cambios</h1>

                {/* Sección de Plataformas */}
                <h2 className="text-lg mt-4">Plataformas Registradas</h2>
                <Button variant="contained" color="primary" onClick={handleOpenPlataforma}>
                    <PlusIcon className="h-5 md:ml-4" /> Agregar Plataforma
                </Button>

                {isLoadingPlataformas ? <p>Cargando plataformas...</p> : errorPlataformas ? <p>Error al obtener plataformas.</p> : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nombre</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {plataformas.map((plataforma: Plataforma) => (
                                <TableRow key={plataforma.id}>
                                    <TableCell>{plataforma.id}</TableCell>
                                    <TableCell>{plataforma.nombre}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Sección de Historial de Cambios */}
                <h2 className="text-lg mt-4">Historial de Cambios</h2>
                <Button variant="contained" color="primary" onClick={handleOpenCambio}>
                    <PlusIcon className="h-5 md:ml-4" /> Registrar Cambio
                </Button>

                {isLoadingCambios ? <p>Cargando historial de cambios...</p> : errorCambios ? <p>Error al obtener cambios.</p> : (
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Fecha</TableCell>
                                <TableCell>Usuario</TableCell>
                                <TableCell>Modificación</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {cambios.map((cambio: ControlCambio) => (
                                <TableRow key={cambio.id}>
                                    <TableCell>{new Date(cambio.fecha).toLocaleString()}</TableCell>
                                    <TableCell>{cambio.usuario}</TableCell>
                                    <TableCell>{cambio.modificacion}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}

                {/* Modal para agregar plataforma */}
                <Dialog open={openPlataforma} onClose={handleClosePlataforma}>
                    <DialogTitle>Agregar Plataforma</DialogTitle>
                    <DialogContent>
                        <TextField label="Nombre" fullWidth onChange={(e) => setNuevaPlataforma(e.target.value)} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClosePlataforma}>Cancelar</Button>
                        <Button onClick={handleSubmitPlataforma} variant="contained" color="primary">Guardar</Button>
                    </DialogActions>
                </Dialog>

                {/* Modal para registrar un cambio */}
                <Dialog open={openCambio} onClose={handleCloseCambio}>
                    <DialogTitle>Registrar Cambio</DialogTitle>
                    <DialogContent>
                        <TextField label="Usuario" fullWidth onChange={(e) => setNuevoCambio({ ...nuevoCambio, usuario: e.target.value })} />
                        <TextField label="Modificación" fullWidth multiline onChange={(e) => setNuevoCambio({ ...nuevoCambio, modificacion: e.target.value })} />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseCambio}>Cancelar</Button>
                        <Button onClick={handleSubmitCambio} variant="contained" color="primary">Guardar</Button>
                    </DialogActions>
                </Dialog>

                <Snackbar open={notification.open} onClose={() => setNotification({ ...notification, open: false })}>
                    <Alert severity={notification.type}>{notification.message}</Alert>
                </Snackbar>
            </div>
        </div>
    );
}


