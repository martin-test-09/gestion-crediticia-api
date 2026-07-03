import {
  createOrReactivateCliente,
  deleteCliente,
  getCliente,
  listClientes,
  updateCliente
} from "../services/cliente.service.js";
import { sendSuccess } from "../utils/response.util.js";

export async function listar(req, res) {
  const clientes = await listClientes();
  return sendSuccess(res, 200, "Clientes obtenidos correctamente", clientes);
}

export async function detalle(req, res) {
  const cliente = await getCliente(req.params.id);
  return sendSuccess(res, 200, "Cliente obtenido correctamente", cliente);
}

export async function crear(req, res) {
  const cliente = await createOrReactivateCliente(req.body);
  return sendSuccess(res, 201, "Cliente guardado correctamente", cliente);
}

export async function actualizar(req, res) {
  const cliente = await updateCliente(req.params.id, req.body);
  return sendSuccess(res, 200, "Cliente actualizado correctamente", cliente);
}

export async function eliminar(req, res) {
  await deleteCliente(req.params.id);
  return sendSuccess(res, 200, "Cliente eliminado correctamente");
}
