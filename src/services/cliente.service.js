import {
  createCliente,
  findAllClientesActive,
  findClienteActiveByCuit,
  findClienteActiveById,
  findClienteByCuitAny,
  reactivateCliente,
  softDeleteClienteActiveById,
  updateClienteActiveById
} from "../repositories/cliente.repository.js";
import { ServerError } from "../utils/serverError.util.js";

function normalizeClientePayload(payload) {
  return {
    nombre: payload.nombre.trim(),
    email: payload.email.toLowerCase().trim(),
    cuit: payload.cuit.trim(),
    telefono: payload.telefono.trim()
  };
}

export async function listClientes() {
  return findAllClientesActive();
}

export async function getCliente(id) {
  const cliente = await findClienteActiveById(id);

  if (!cliente) {
    throw new ServerError("Cliente no encontrado", 404);
  }

  return cliente;
}

export async function createOrReactivateCliente(payload) {
  const data = normalizeClientePayload(payload);
  const existing = await findClienteByCuitAny(data.cuit);

  if (existing?.activo) {
    throw new ServerError("El CUIT ya está registrado", 409);
  }

  if (existing && !existing.activo) {
    return reactivateCliente(existing._id, data);
  }

  return createCliente(data);
}

export async function updateCliente(id, payload) {
  const current = await findClienteActiveById(id);

  if (!current) {
    throw new ServerError("Cliente no encontrado", 404);
  }

  const data = normalizeClientePayload(payload);
  const cuitOwner = await findClienteActiveByCuit(data.cuit);

  if (cuitOwner && cuitOwner._id.toString() !== id) {
    throw new ServerError("El CUIT ya está registrado", 409);
  }

  const updated = await updateClienteActiveById(id, data);
  if (!updated) {
    throw new ServerError("Cliente no encontrado", 404);
  }

  return updated;
}

export async function deleteCliente(id) {
  const deleted = await softDeleteClienteActiveById(id);

  if (!deleted) {
    throw new ServerError("Cliente no encontrado", 404);
  }

  return deleted;
}
