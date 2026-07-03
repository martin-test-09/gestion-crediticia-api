export function getValue(source, path) {
  return path.split(".").reduce((current, key) => current?.[key], source);
}

export function setValue(target, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  let current = target;

  for (const key of keys) {
    if (!current[key] || typeof current[key] !== "object") {
      current[key] = {};
    }
    current = current[key];
  }

  current[lastKey] = value;
}

function isEmpty(value) {
  return value === undefined || value === null || value === "";
}

export function required(label) {
  return (value) => isEmpty(value) ? `${label} es obligatorio` : null;
}

export function minLength(label, min) {
  return (value) => {
    if (isEmpty(value)) return null;
    return String(value).trim().length < min ? `${label} debe tener al menos ${min} caracteres` : null;
  };
}

export function isEmail(label = "Email") {
  return (value) => {
    if (isEmpty(value)) return null;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim()) ? null : `${label} no tiene un formato válido`;
  };
}

export function isCuit(label = "CUIT") {
  return (value) => {
    if (isEmpty(value)) return null;
    return /^\d{11}$/.test(String(value).trim()) ? null : `${label} debe tener exactamente 11 dígitos`;
  };
}

export function isNumber(label) {
  return (value) => {
    if (isEmpty(value)) return null;
    return Number.isFinite(Number(value)) ? null : `${label} debe ser un número válido`;
  };
}

export function minNumber(label, min) {
  return (value) => {
    if (isEmpty(value)) return null;
    return Number(value) >= min ? null : `${label} debe ser mayor o igual a ${min}`;
  };
}

export function greaterThan(label, min) {
  return (value) => {
    if (isEmpty(value)) return null;
    return Number(value) > min ? null : `${label} debe ser mayor a ${min}`;
  };
}

export function isEnum(label, allowedValues) {
  return (value) => {
    if (isEmpty(value)) return null;
    return allowedValues.includes(value) ? null : `${label} debe ser uno de: ${allowedValues.join(", ")}`;
  };
}

export function isMongoId(label = "ID") {
  return (value) => {
    if (isEmpty(value)) return null;
    return /^[a-fA-F0-9]{24}$/.test(String(value)) ? null : `${label} inválido`;
  };
}

export function isDate(label) {
  return (value) => {
    if (isEmpty(value)) return null;
    return Number.isNaN(Date.parse(value)) ? `${label} debe ser una fecha válida` : null;
  };
}
