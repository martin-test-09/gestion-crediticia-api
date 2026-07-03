import { situacionToEstado, worstSituacion } from "../../utils/riskMapping.util.js";
import { bcraFixtures } from "./bcra.fixtures.js";

function normalizeDemoFixture(cuit, fixture) {
  if (!fixture) {
    return {
      cuit,
      denominacion: null,
      periodo: null,
      sinRegistros: true,
      situacion: null,
      estadoSugerido: "aprobado",
      flags: { refinanciaciones: false, enRevision: false, procesoJud: false },
      entidades: []
    };
  }

  const situacion = worstSituacion(fixture.entidades);

  return {
    cuit,
    denominacion: fixture.denominacion,
    periodo: fixture.periodo,
    sinRegistros: false,
    situacion,
    estadoSugerido: situacionToEstado(situacion),
    flags: {
      refinanciaciones: fixture.entidades.some((entidad) => entidad.refinanciaciones === true),
      enRevision: fixture.entidades.some((entidad) => entidad.enRevision === true),
      procesoJud: fixture.entidades.some((entidad) => entidad.procesoJud === true)
    },
    entidades: fixture.entidades
  };
}

export async function consultarDeudasDemo(cuit) {
  return normalizeDemoFixture(cuit, bcraFixtures[cuit]);
}
