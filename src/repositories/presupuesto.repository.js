import { Counter } from "../models/counter.model.js";
import { Presupuesto } from "../models/presupuesto.model.js";

function formatNumero(seq) {
  return `P-${String(seq).padStart(5, "0")}`;
}

export async function nextNumero(retries = 1) {
  try {
    const counter = await Counter.findOneAndUpdate(
      { _id: "presupuesto" },
      { $inc: { seq: 1 } },
      { upsert: true, new: true }
    );

    return formatNumero(counter.seq);
  } catch (error) {
    if (error.code === 11000 && retries > 0) {
      return nextNumero(retries - 1);
    }

    throw error;
  }
}

export async function ensurePresupuestoCounter() {
  return Counter.findOneAndUpdate(
    { _id: "presupuesto" },
    { $setOnInsert: { seq: 0 } },
    { upsert: true, new: true }
  );
}

export async function ensureCounterAtLeast(seq) {
  const current = await Counter.findById("presupuesto");

  if (!current || current.seq < seq) {
    return Counter.findOneAndUpdate(
      { _id: "presupuesto" },
      { $set: { seq } },
      { upsert: true, new: true }
    );
  }

  return current;
}

export async function findAllPresupuestosActive() {
  return Presupuesto.find({ activo: true })
    .populate("cliente")
    .sort({ fecha_creacion: -1 });
}

export async function findPresupuestoActiveById(id) {
  return Presupuesto.findOne({ _id: id, activo: true });
}

export async function findPresupuestoActiveByIdPopulated(id) {
  return Presupuesto.findOne({ _id: id, activo: true }).populate("cliente");
}

export async function findPresupuestoActiveByCuit(cuit) {
  return Presupuesto.findOne({ cuit: String(cuit).trim(), activo: true }).populate("cliente");
}

export async function createPresupuesto(data) {
  return Presupuesto.create(data);
}

export async function updatePresupuestoActiveById(id, data) {
  return Presupuesto.findOneAndUpdate(
    { _id: id, activo: true },
    { $set: data },
    { new: true, runValidators: true }
  ).populate("cliente");
}

export async function updatePresupuestoEstadoActiveById(id, estado) {
  return Presupuesto.findOneAndUpdate(
    { _id: id, activo: true },
    { $set: { estado } },
    { new: true, runValidators: true }
  ).populate("cliente");
}

export async function softDeletePresupuestoActiveById(id) {
  return Presupuesto.findOneAndUpdate(
    { _id: id, activo: true },
    { $set: { activo: false } },
    { new: true }
  );
}

export async function createDemoPresupuestoIfMissing(cuit, data) {
  const existing = await Presupuesto.findOne({ cuit: String(cuit).trim(), activo: true });

  if (existing) {
    return existing;
  }

  return Presupuesto.create(data);
}
