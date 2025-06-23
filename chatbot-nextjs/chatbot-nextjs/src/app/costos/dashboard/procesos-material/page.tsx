"use client";
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProcesosMateriales,
  createProcesoMaterial,
  updateProcesoMaterial,
  deleteProcesoMaterial,
  getConsumibles,
  getReactivos,
  getCuantificaciones,
  getBGO,
  getProcesos
} from "../api-costos";
import {
  Button, Table, TableHead, TableRow, TableCell, TableBody,
  Dialog, DialogTitle, DialogContent, TextField,
  DialogActions, Select, MenuItem
} from "@mui/material";
import { PlusIcon, TrashIcon, PencilIcon } from "@heroicons/react/24/outline";

interface ProcesoMaterial {
  id?: number;
  proceso: number;
  consumible?: number | null;
  reactivo?: number | null;
  cuantificacion?: number | null;
  buffer_gel_oligo?: number | null;
  cantidad: number;
  costo: number;
}

interface Material {
  id: number;
  nombre: string;
  costo: number;
}

interface Proceso {
  id: number;
  nombre: string;
}

export default function ProcesoMaterialPage() {
  const queryClient = useQueryClient();
  const { data: procesos = [] } = useQuery<Proceso[]>({ queryKey: ["procesos"], queryFn: getProcesos });
  const { data: consumibles = [] } = useQuery<Material[]>({ queryKey: ["consumibles"], queryFn: getConsumibles });
  const { data: reactivos = [] } = useQuery<Material[]>({ queryKey: ["reactivos"], queryFn: getReactivos });
  const { data: cuantificaciones = [] } = useQuery<Material[]>({ queryKey: ["cuantificaciones"], queryFn: getCuantificaciones });
  const { data: bgos = [] } = useQuery<Material[]>({ queryKey: ["bgos"], queryFn: getBGO });
  const { data: materialesProceso = [] } = useQuery<ProcesoMaterial[]>({ queryKey: ["materialesProceso"], queryFn: getProcesosMateriales });

  const createMutation = useMutation({ mutationFn: createProcesoMaterial, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materialesProceso"] }) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }: { id: number; data: ProcesoMaterial }) => updateProcesoMaterial(id, data), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materialesProceso"] }) });
  const deleteMutation = useMutation({ mutationFn: deleteProcesoMaterial, onSuccess: () => queryClient.invalidateQueries({ queryKey: ["materialesProceso"] }) });

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [materialId, setMaterialId] = useState<number | null>(null);
  const [procesoId, setProcesoId] = useState<number | "">("");
  const [tipoMaterial, setTipoMaterial] = useState<"" | "consumible" | "reactivo" | "cuantificacion" | "bgo">("");
  const [material, setMaterial] = useState<number | "">("");
  const [cantidad, setCantidad] = useState<number>(0);
  const [costo, setCosto] = useState<number>(0);

  const handleOpen = () => {
    setEditando(false);
    setMaterialId(null);
    setProcesoId("");
    setTipoMaterial("");
    setMaterial("");
    setCantidad(0);
    setCosto(0);
    setOpen(true);
  };

  const handleEdit = (pm: ProcesoMaterial) => {
    setEditando(true);
    setMaterialId(pm.id ?? null);
    setProcesoId(pm.proceso);
    setCantidad(pm.cantidad);
    setCosto(pm.costo);

    const tipo = pm.consumible ? "consumible" :
      pm.reactivo ? "reactivo" :
      pm.cuantificacion ? "cuantificacion" :
      pm.buffer_gel_oligo ? "bgo" : "";

    const matId = pm.consumible || pm.reactivo || pm.cuantificacion || pm.buffer_gel_oligo || "";

    setTipoMaterial(tipo);
    setMaterial(matId);
    setOpen(true);
  };

  const handleSubmit = async () => {
    if (!procesoId || !material) return;

    const nuevo: ProcesoMaterial = {
      proceso: procesoId as number,
      cantidad: Number(cantidad),
      costo: 0,
      consumible: tipoMaterial === "consumible" ? material as number : null,
      reactivo: tipoMaterial === "reactivo" ? material as number : null,
      cuantificacion: tipoMaterial === "cuantificacion" ? material as number : null,
      buffer_gel_oligo: tipoMaterial === "bgo" ? material as number : null,
    };

    try {
      if (editando && materialId !== null) {
        await updateMutation.mutateAsync({ id: materialId, data: nuevo });
      } else {
        await createMutation.mutateAsync(nuevo);
      }
      setOpen(false);
    } catch (error) {
      console.error("❌ Error en la operación:", error);
    }
  };

  const getMaterialList = () => {
    switch (tipoMaterial) {
      case "consumible": return consumibles;
      case "reactivo": return reactivos;
      case "cuantificacion": return cuantificaciones;
      case "bgo": return bgos;
      default: return [];
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Materiales en Procesos</h2>
        <Button variant="contained" onClick={handleOpen}><PlusIcon className="h-5" /> Agregar</Button>
      </div>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Proceso</TableCell>
            <TableCell>Material</TableCell>
            <TableCell>Cantidad</TableCell>
            <TableCell>Costo</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {materialesProceso.map((pm) => (
            <TableRow key={pm.id}>
              <TableCell>{pm.id}</TableCell>
              <TableCell>{procesos.find(p => p.id === pm.proceso)?.nombre || "?"}</TableCell>
              <TableCell>{
                consumibles.find(m => m.id === pm.consumible)?.nombre ||
                reactivos.find(m => m.id === pm.reactivo)?.nombre ||
                cuantificaciones.find(m => m.id === pm.cuantificacion)?.nombre ||
                bgos.find(m => m.id === pm.buffer_gel_oligo)?.nombre || "?"
              }</TableCell>
              <TableCell>{pm.cantidad}</TableCell>
              <TableCell>${Number(pm.costo).toFixed(2)}</TableCell>
              <TableCell>
                <Button onClick={() => handleEdit(pm)}><PencilIcon className="h-5" /></Button>
                <Button onClick={() => deleteMutation.mutate(pm.id!)}><TrashIcon className="h-5 text-red-500" /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>{editando ? "Editar" : "Agregar"} Proceso Material</DialogTitle>
        <DialogContent>
          <Select fullWidth value={procesoId} onChange={(e) => setProcesoId(Number(e.target.value) || "")}>
            <MenuItem value="">Seleccionar Proceso</MenuItem>
            {procesos.map((p) => <MenuItem key={p.id} value={p.id}>{p.nombre}</MenuItem>)}
          </Select>

          <Select fullWidth value={tipoMaterial} onChange={(e) => { setTipoMaterial(e.target.value as "" | "consumible" | "reactivo" | "cuantificacion" | "bgo"); setMaterial(""); }}>
            <MenuItem value="">Tipo de Material</MenuItem>
            <MenuItem value="consumible">Consumible</MenuItem>
            <MenuItem value="reactivo">Reactivo</MenuItem>
            <MenuItem value="cuantificacion">Cuantificación</MenuItem>
            <MenuItem value="bgo">Buffer/Gel/Oligo</MenuItem>
          </Select>

          <Select fullWidth value={material} onChange={(e) => setMaterial(Number(e.target.value) || "")}>
            <MenuItem value="">Seleccionar Material</MenuItem>
            {getMaterialList().map((m) => <MenuItem key={m.id} value={m.id}>{m.nombre}</MenuItem>)}
          </Select>

                <TextField fullWidth type="number" label="Cantidad" value={cantidad} onChange={(e) => setCantidad(Number(e.target.value))} />
                <TextField fullWidth disabled label="Costo (autocalculado)" value={costo} />
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancelar</Button>
                <Button onClick={handleSubmit} variant="contained">{editando ? "Actualizar" : "Agregar"}</Button>
              </DialogActions>
            </Dialog>
              </div>
          );
    }