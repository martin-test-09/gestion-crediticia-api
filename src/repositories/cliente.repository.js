import { Cliente } from "../models/cliente.model.js";

export async function findAllClientesActive() {
  return Cliente.find({ activo: true }).sort({ fecha_creacion: -1 });
}

export async function findClienteActiveById(id) {
  return Cliente.findOne({ _id: id, activo: true });
}

export async function findClienteByCuitAny(cuit) {
  return Cliente.findOne({ cuit: String(cuit).trim() });
}

export async function findClienteActiveByCuit(cuit) {
  return Cliente.findOne({ cuit: String(cuit).trim(), activo: true });
}

export async function createCliente(data) {
  return Cliente.create(data);
}

export async function reactivateCliente(id, data) {
  return Cliente.findByIdAndUpdate(
    id,
    { $set: { ...data, activo: true } },
    { new: true, runValidators: true }
  );
}

export async function updateClienteActiveById(id, data) {
  return Cliente.findOneAndUpdate(
    { _id: id, activo: true },
    { $set: data },
    { new: true, runValidators: true }
  );
}

export async function softDeleteClienteActiveById(id) {
  return Cliente.findOneAndUpdate(
    { _id: id, activo: true },
    { $set: { activo: false } },
    { new: true }
  );
}
