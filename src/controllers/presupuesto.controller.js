import {
  createPresupuestoService,
  deletePresupuesto,
  getPresupuesto,
  listPresupuestos,
  resolvePresupuestoEstado,
  updatePresupuesto
} from "../services/presupuesto.service.js";
import { sendSuccess } from "../utils/response.util.js";

export async function listar(req, res) {
  const presupuestos = await listPresupuestos();
  return sendSuccess(res, 200, "Presupuestos obtenidos correctamente", presupuestos);
}

export async function detalle(req, res) {
  const presupuesto = await getPresupuesto(req.params.id);
  return sendSuccess(res, 200, "Presupuesto obtenido correctamente", presupuesto);
}

export async function crear(req, res) {
  const presupuesto = await createPresupuestoService(req.body);
  return sendSuccess(res, 201, "Presupuesto creado correctamente", presupuesto);
}

export async function actualizar(req, res) {
  const presupuesto = await updatePresupuesto(req.params.id, req.body);
  return sendSuccess(res, 200, "Presupuesto actualizado correctamente", presupuesto);
}

export async function actualizarEstado(req, res) {
  const presupuesto = await resolvePresupuestoEstado(req.params.id, req.body.estado);
  return sendSuccess(res, 200, "Estado actualizado correctamente", presupuesto);
}

export async function eliminar(req, res) {
  await deletePresupuesto(req.params.id);
  return sendSuccess(res, 200, "Presupuesto eliminado correctamente");
}
