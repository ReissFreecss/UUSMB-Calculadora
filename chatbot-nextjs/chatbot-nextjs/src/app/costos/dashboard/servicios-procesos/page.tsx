"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getServiciosProcesos,
  createServicioProceso,
  updateServicioProceso,
  deleteServicioProceso,
  getServicios,
  getProcesos
} from "../api-costos";
import {
  Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Select, MenuItem
} from "@mui/material";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

interface ServicioProceso {
  id?: number;
  servicio: number;
  proceso: number;
  cantidad: number;
  costo: number;
}

interface Servicio {
  id: number;
  nombre: string;
}

interface Proceso {
  id: number;
  nombre: string;
}

export default function ServicioProcesoPage() {
  const queryClient = useQueryClient();
  const { data: servicios = [] } = useQuery<Servicio[]>({ queryKey: ["servicios"], queryFn: getServicios });
  const { data: procesos = [] } = useQuery<Proceso[]>({ queryKey: ["procesos"], queryFn: getProcesos });
  const { data: relaciones = [] } = useQuery<ServicioProceso[]>({ queryKey: ["serviciosProcesos"], queryFn: getServiciosProcesos });

  const createMutation = useMutation({ mutationFn: createServicioProceso, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviciosProcesos"] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: number; data: ServicioProceso }) => updateServicioProceso(id, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviciosProcesos"] }) });
  const deleteMutation = useMutation({ mutationFn: deleteServicioProceso, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["serviciosProcesos"] }) });

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [relacionId, setRelacionId] = useState<number | null>(null);
  const [servicioId, setServicioId] = useState<number | "">("");
  const [procesoId, setProcesoId] = useState<number | "">("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [costo, setCosto] = useState<number>(0);

  const handleOpen = () => {
    setEditando(false);
    setRelacionId(null);
    setServicioId("");
    setProcesoId("");
    setCantidad(0);
    setCosto(0);
    setOpen(true);
  };

  const handleEdit = (rel: ServicioProceso) => {
    setEditando(true);
    setRelacionId(rel.id ?? null);
    setServicioId(rel.servicio);
    setProcesoId(rel.proceso);
    setCantidad(rel.cantidad);
    setCosto(rel.costo);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!servicioId || !procesoId) return;

    const payload: ServicioProceso = {
      servicio: servicioId as number,
      proceso: procesoId as number,
      cantidad: Number(cantidad),
      costo: 0,
    };

    try {
      if (editando && relacionId !== null) {
        await updateMutation.mutateAsync({ id: relacionId, data: payload });
      } else {
        await createMutation.mutateAsync(payload);
      }
      setOpen(false);
    } catch (error) {
      console.error("⚠️ Error en la operación:", error);
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Servicios - Procesos</h2>
        <Button variant="contained" onClick={handleOpen}><PlusIcon className="h-5" /> Agregar</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Servicio</TableCell>
            <TableCell>Proceso</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Costo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {relaciones.map((rel) => (
            <TableRow key={rel.id}>
              <TableCell>{rel.id}</TableCell>
              <TableCell>{servicios.find(s => s.id === rel.servicio)?.nombre || "?"}</TableCell>
              <TableCell>{procesos.find(p => p.id === rel.proceso)?.nombre || "?"}</TableCell>
              <TableCell>{rel.cantidad}</TableCell>
              <TableCell>${Number(rel.costo).toFixed(2)}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(rel)}><PencilIcon className="h-5" /></Button>
                <Button onClick={() => deleteMutation.mutate(rel.id!)}><TrashIcon className="h-5 text-red-500" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editando ? "Editar" : "Agregar"} Relación Servicio - Proceso</DialogTitle>
        <DialogContent>
          <Select fullWidth value={servicioId} onChange={(e) => setServicioId(Number(e.target.value) || "")}>
            <MenuItem value="">Seleccionar Servicio</MenuItem>
            {servicios.map((s) => <MenuItem key={s.id} value={s.id}>{s.nombre}</MenuItem>)}
          </Select>

          <Select fullWidth value={procesoId} onChange={(e) => setProcesoId(Number(e.target.value) || "")}>
            <MenuItem value="">Seleccionar Proceso</MenuItem>
            {procesos.map((p) => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
          </Select>

          <TextField fullWidth type="number" label="Cantidad" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
          <TextField fullWidth disabled label="Costo (autocalculado)" value={costo.toFixed(2)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit}>{editando ? "Actualizar" : "Guardar"}</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}