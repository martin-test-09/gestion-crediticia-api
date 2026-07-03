import {
  loginUsuario,
  registerUsuario,
  resendVerification,
  verifyUsuarioEmail
} from "../services/auth.service.js";
import { sendSuccess } from "../utils/response.util.js";

export async function register(req, res) {
  const result = await registerUsuario(req.body);
  return sendSuccess(res, 201, result.message, {
    usuario: {
      id: result.usuario._id,
      nombre: result.usuario.nombre,
      email: result.usuario.email,
      email_verificado: result.usuario.email_verificado
    }
  });
}

export async function verifyEmail(req, res) {
  const message = await verifyUsuarioEmail(req.query.verification_token);
  return sendSuccess(res, 200, message);
}

export async function resend(req, res) {
  const message = await resendVerification(req.body);
  return sendSuccess(res, 200, message);
}

export async function login(req, res) {
  const data = await loginUsuario(req.body);
  return sendSuccess(res, 200, "Inicio de sesión correcto", data);
}
