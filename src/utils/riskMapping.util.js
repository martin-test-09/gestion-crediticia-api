export function worstSituacion(entidades = []) {
  if (!Array.isArray(entidades) || entidades.length === 0) {
    return null;
  }

  return entidades.reduce((worst, entidad) => {
    const situacion = Number(entidad.situacion) || 0;
    return situacion > worst ? situacion : worst;
  }, 0) || null;
}

export function situacionToEstado(situacion) {
  const value = Number(situacion);

  if (!Number.isFinite(value)) {
    return "aprobado";
  }

  if (value <= 1) {
    return "aprobado";
  }

  if (value === 2 || value === 3) {
    return "pendiente";
  }

  return "rechazado";
}
