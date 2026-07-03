import { ServerError } from "../../utils/serverError.util.js";
import { situacionToEstado, worstSituacion } from "../../utils/riskMapping.util.js";

const BCRA_URL = "https://api.bcra.gob.ar/CentralDeDeudores/v1.0/Deudas";
const TIMEOUT_MS = 8000;

function noRecordsResult(cuit, denominacion = null) {
  return {
    cuit,
    denominacion,
    periodo: null,
    sinRegistros: true,
    situacion: null,
    estadoSugerido: "aprobado",
    flags: { refinanciaciones: false, enRevision: false, procesoJud: false },
    entidades: []
  };
}

function normalizeBcraPayload(cuit, payload) {
  const results = payload?.results;
  const latestPeriod = results?.periodos?.[0];
  const rawEntidades = latestPeriod?.entidades ?? [];

  if (!Array.isArray(rawEntidades) || rawEntidades.length === 0) {
    return noRecordsResult(cuit, results?.denominacion ?? null);
  }

  const entidades = rawEntidades.map((entidad) => ({
    entidad: entidad.entidad,
    situacion: Number(entidad.situacion),
    monto: Number(entidad.monto || 0) * 1000,
    diasAtrasoPago: Number(entidad.diasAtrasoPago || 0),
    refinanciaciones: entidad.refinanciaciones === true,
    enRevision: entidad.enRevision === true,
    procesoJud: entidad.procesoJud === true
  }));

  const situacion = worstSituacion(entidades);

  return {
    cuit,
    denominacion: results?.denominacion ?? null,
    periodo: latestPeriod?.periodo ?? null,
    sinRegistros: false,
    situacion,
    estadoSugerido: situacionToEstado(situacion),
    flags: {
      refinanciaciones: entidades.some((entidad) => entidad.refinanciaciones),
      enRevision: entidades.some((entidad) => entidad.enRevision),
      procesoJud: entidades.some((entidad) => entidad.procesoJud)
    },
    entidades
  };
}

export async function consultarDeudasReal(cuit) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(`${BCRA_URL}/${cuit}`, { signal: controller.signal });

    if (response.status === 404) {
      return noRecordsResult(cuit);
    }

    if (!response.ok) {
      throw new ServerError("No se pudo consultar BCRA en este momento", 503);
    }

    let payload;
    try {
      payload = await response.json();
    } catch (_error) {
      throw new ServerError("La respuesta de BCRA no tiene un formato válido", 503);
    }

    return normalizeBcraPayload(cuit, payload);
  } catch (error) {
    if (error instanceof ServerError) {
      throw error;
    }

    throw new ServerError("No se pudo consultar BCRA en este momento", 503);
  } finally {
    clearTimeout(timeout);
  }
}
