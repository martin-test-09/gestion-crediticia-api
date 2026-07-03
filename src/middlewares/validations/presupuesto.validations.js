import {
  greaterThan,
  isDate,
  isEnum,
  isMongoId,
  isNumber,
  minNumber,
  required
} from "../../utils/validators.util.js";

const plazoValues = [12, 24, 36, 48, 60];

function normalizeEnumNumber(allowedValues) {
  return (value) => {
    if (value === undefined || value === null || value === "") return null;
    return allowedValues.includes(Number(value)) ? null : `Plazo debe ser uno de: ${allowedValues.join(", ")}`;
  };
}

export const createPresupuestoValidation = {
  cliente: [required("Cliente"), isMongoId("Cliente")],
  "vehiculo.marca": [required("Marca")],
  "vehiculo.modelo": [required("Modelo")],
  "vehiculo.precio": [required("Precio"), isNumber("Precio"), greaterThan("Precio", 0)],
  anticipo: [required("Anticipo"), isNumber("Anticipo"), minNumber("Anticipo", 0)],
  tasa: [required("Tasa"), isNumber("Tasa"), greaterThan("Tasa", 0)],
  plazo: [required("Plazo"), isNumber("Plazo"), normalizeEnumNumber(plazoValues)],
  gastos: [required("Gastos"), isNumber("Gastos"), minNumber("Gastos", 0)],
  seguro: [required("Seguro"), isNumber("Seguro"), minNumber("Seguro", 0)],
  vigencia: [isDate("Vigencia")]
};

export const updatePresupuestoValidation = {
  "vehiculo.marca": [required("Marca")],
  "vehiculo.modelo": [required("Modelo")],
  "vehiculo.precio": [required("Precio"), isNumber("Precio"), greaterThan("Precio", 0)],
  anticipo: [required("Anticipo"), isNumber("Anticipo"), minNumber("Anticipo", 0)],
  tasa: [required("Tasa"), isNumber("Tasa"), greaterThan("Tasa", 0)],
  plazo: [required("Plazo"), isNumber("Plazo"), normalizeEnumNumber(plazoValues)],
  gastos: [required("Gastos"), isNumber("Gastos"), minNumber("Gastos", 0)],
  seguro: [required("Seguro"), isNumber("Seguro"), minNumber("Seguro", 0)],
  vigencia: [isDate("Vigencia")]
};

export const updateEstadoValidation = {
  estado: [required("Estado"), isEnum("Estado", ["aprobado", "rechazado"])]
};
