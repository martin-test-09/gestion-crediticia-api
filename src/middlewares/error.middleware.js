import { ServerError } from "../utils/serverError.util.js";

function duplicateKeyMessage(error) {
  const field = Object.keys(error.keyValue || error.keyPattern || {})[0] || "campo";

  const messages = {
    email: "El email ya está registrado",
    cuit: "El CUIT ya está registrado",
    numero: "El número de presupuesto ya existe"
  };

  return messages[field] || `El valor del campo ${field} ya existe`;
}

export function notFoundHandler(_req, _res, next) {
  return next(new ServerError("Recurso no encontrado", 404));
}

export function errorHandler(err, _req, res, _next) {
  console.error(err);

  if (err instanceof ServerError) {
    return res.status(err.status).json({ ok: false, status: err.status, message: err.message });
  }

  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ ok: false, status: 401, message: "Token expirado" });
  }

  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ ok: false, status: 401, message: "Token inválido" });
  }

  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((error) => error.message).join(". ");
    return res.status(400).json({ ok: false, status: 400, message });
  }

  if (err.name === "CastError") {
    return res.status(400).json({ ok: false, status: 400, message: "ID inválido" });
  }

  if (err.code === 11000) {
    return res.status(409).json({ ok: false, status: 409, message: duplicateKeyMessage(err) });
  }

  return res.status(500).json({
    ok: false,
    status: 500,
    message: "Ocurrió un error inesperado"
  });
}
