import { findClienteActiveById } from "../repositories/cliente.repository.js";
import {
  createPresupuesto,
  findAllPresupuestosActive,
  findPresupuestoActiveById,
  findPresupuestoActiveByIdPopulated,
  nextNumero,
  softDeletePresupuestoActiveById,
  updatePresupuestoActiveById,
  updatePresupuestoEstadoActiveById
} from "../repositories/presupuesto.repository.js";
import { calcularCuotaMensual } from "../utils/amortization.util.js";
import { ServerError } from "../utils/serverError.util.js";
import { consultarDeudas, getBcraMode } from "./bcra/bcra.service.js";

function normalizeFinancialPayload(payload) {
  return {
    vehiculo: {
      marca: payload.vehiculo.marca.trim(),
      modelo: payload.vehiculo.modelo.trim(),
      precio: Number(payload.vehiculo.precio)
    },
    anticipo: Number(payload.anticipo),
    tasa: Number(payload.tasa),
    plazo: Number(payload.plazo),
    gastos: Number(payload.gastos),
    seguro: Number(payload.seguro),
    vigencia: payload.vigencia ? new Date(payload.vigencia) : null
  };
}

function calculateDerivedValues(data) {
  if (data.anticipo >= data.vehiculo.precio) {
    throw new ServerError("El anticipo debe ser menor al precio del vehículo", 400);
  }

  const montoFinanciado = data.vehiculo.precio - data.anticipo;
  const cuotaMensual = calcularCuotaMensual({
    montoFinanciado,
    tasaNominalAnual: data.tasa,
    plazoMeses: data.plazo
  });

  return { montoFinanciado, cuotaMensual };
}

function mapBcraSnapshot(bcraResult) {
  return {
    consultado_en: new Date(),
    modo: getBcraMode(),
    sin_registros: bcraResult.sinRegistros,
    periodo: bcraResult.periodo,
    situacion: bcraResult.situacion,
    denominacion: bcraResult.denominacion,
    flags: bcraResult.flags,
    entidades: bcraResult.entidades
  };
}

export async function listPresupuestos() {
  return findAllPresupuestosActive();
}

export async function getPresupuesto(id) {
  const presupuesto = await findPresupuestoActiveByIdPopulated(id);

  if (!presupuesto) {
    throw new ServerError("Presupuesto no encontrado", 404);
  }

  return presupuesto;
}

export async function createPresupuestoService(payload) {
  const cliente = await findClienteActiveById(payload.cliente);

  if (!cliente) {
    throw new ServerError("Cliente no encontrado", 404);
  }

  const financialData = normalizeFinancialPayload(payload);
  const { montoFinanciado, cuotaMensual } = calculateDerivedValues(financialData);
  const bcraResult = await consultarDeudas(cliente.cuit);
  const numero = await nextNumero();

  const created = await createPresupuesto({
    numero,
    cliente: cliente._id,
    cuit: cliente.cuit,
    vehiculo: financialData.vehiculo,
    anticipo: financialData.anticipo,
    monto_financiado: montoFinanciado,
    tasa: financialData.tasa,
    plazo: financialData.plazo,
    gastos: financialData.gastos,
    seguro: financialData.seguro,
    vigencia: financialData.vigencia,
    cuota_mensual: cuotaMensual,
    estado: bcraResult.estadoSugerido,
    resultado_buro: mapBcraSnapshot(bcraResult)
  });

  return findPresupuestoActiveByIdPopulated(created._id);
}

export async function updatePresupuesto(id, payload) {
  const current = await findPresupuestoActiveById(id);

  if (!current) {
    throw new ServerError("Presupuesto no encontrado", 404);
  }

  const financialData = normalizeFinancialPayload(payload);
  const { montoFinanciado, cuotaMensual } = calculateDerivedValues(financialData);

  const updated = await updatePresupuestoActiveById(id, {
    vehiculo: financialData.vehiculo,
    anticipo: financialData.anticipo,
    monto_financiado: montoFinanciado,
    tasa: financialData.tasa,
    plazo: financialData.plazo,
    gastos: financialData.gastos,
    seguro: financialData.seguro,
    vigencia: financialData.vigencia,
    cuota_mensual: cuotaMensual
  });

  if (!updated) {
    throw new ServerError("Presupuesto no encontrado", 404);
  }

  return updated;
}

export async function resolvePresupuestoEstado(id, estado) {
  if (!["aprobado", "rechazado"].includes(estado)) {
    throw new ServerError("El estado destino debe ser aprobado o rechazado", 400);
  }

  const presupuesto = await findPresupuestoActiveById(id);

  if (!presupuesto) {
    throw new ServerError("Presupuesto no encontrado", 404);
  }

  if (presupuesto.estado !== "pendiente") {
    throw new ServerError("Solo se pueden resolver presupuestos pendientes", 409);
  }

  return updatePresupuestoEstadoActiveById(id, estado);
}

export async function deletePresupuesto(id) {
  const deleted = await softDeletePresupuestoActiveById(id);

  if (!deleted) {
    throw new ServerError("Presupuesto no encontrado", 404);
  }

  return deleted;
}

export function buildPresupuestoFromSeed({ numero, cliente, financialData, bcraResult }) {
  const normalized = normalizeFinancialPayload(financialData);
  const { montoFinanciado, cuotaMensual } = calculateDerivedValues(normalized);

  return {
    numero,
    cliente: cliente._id,
    cuit: cliente.cuit,
    vehiculo: normalized.vehiculo,
    anticipo: normalized.anticipo,
    monto_financiado: montoFinanciado,
    tasa: normalized.tasa,
    plazo: normalized.plazo,
    gastos: normalized.gastos,
    seguro: normalized.seguro,
    vigencia: normalized.vigencia,
    cuota_mensual: cuotaMensual,
    estado: bcraResult.estadoSugerido,
    resultado_buro: mapBcraSnapshot(bcraResult)
  };
}
