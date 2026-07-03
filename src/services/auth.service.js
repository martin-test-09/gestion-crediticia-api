import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { environment } from "../config/environment.config.js";
import {
  createUsuario,
  findUsuarioByEmail,
  markUsuarioEmailVerified
} from "../repositories/usuario.repository.js";
import { ServerError } from "../utils/serverError.util.js";
import { sendVerificationEmail } from "./email.service.js";

const BCRYPT_ROUNDS = 12;

function signVerificationToken(email) {
  return jwt.sign({ email, type: "verification" }, environment.jwtSecret, { expiresIn: "24h" });
}

function signAccessToken(usuario) {
  return jwt.sign(
    {
      id: usuario._id.toString(),
      nombre: usuario.nombre,
      email: usuario.email,
      type: "access"
    },
    environment.jwtSecret,
    { expiresIn: "2h" }
  );
}

export async function registerUsuario({ nombre, email, password }) {
  const normalizedEmail = String(email).toLowerCase().trim();
  const existingUsuario = await findUsuarioByEmail(normalizedEmail);

  if (existingUsuario) {
    throw new ServerError("El email ya está registrado", 409);
  }

  const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
  const usuario = await createUsuario({
    nombre: nombre.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    email_verificado: false
  });

  const verificationToken = signVerificationToken(usuario.email);

  try {
    await sendVerificationEmail({ email: usuario.email, nombre: usuario.nombre, token: verificationToken });
  } catch (_error) {
    return {
      usuario,
      message: "Usuario registrado. No se pudo enviar el email de verificación; podés solicitar un reenvío."
    };
  }

  return { usuario, message: "Usuario registrado. Revisá tu email para verificar la cuenta." };
}

export async function verifyUsuarioEmail(verificationToken) {
  if (!verificationToken) {
    throw new ServerError("Token de verificación requerido", 400);
  }

  const payload = jwt.verify(verificationToken, environment.jwtSecret);

  if (payload.type !== "verification") {
    throw new ServerError("Token de verificación inválido", 401);
  }

  const usuario = await findUsuarioByEmail(payload.email);

  if (!usuario) {
    throw new ServerError("Usuario no encontrado", 404);
  }

  if (usuario.email_verificado) {
    return "El email ya se encontraba verificado.";
  }

  await markUsuarioEmailVerified(payload.email);
  return "Email verificado correctamente.";
}

export async function resendVerification({ email }) {
  const usuario = await findUsuarioByEmail(email);

  if (!usuario) {
    throw new ServerError("No existe una cuenta registrada con ese email", 404);
  }

  if (usuario.email_verificado) {
    return "El email ya se encuentra verificado.";
  }

  const verificationToken = signVerificationToken(usuario.email);

  try {
    await sendVerificationEmail({ email: usuario.email, nombre: usuario.nombre, token: verificationToken });
  } catch (_error) {
    throw new ServerError("No se pudo reenviar el email de verificación. Intentá nuevamente más tarde.", 503);
  }

  return "Email de verificación reenviado correctamente.";
}

export async function loginUsuario({ email, password }) {
  const usuario = await findUsuarioByEmail(email);

  if (!usuario) {
    throw new ServerError("Credenciales inválidas", 401);
  }

  const validPassword = await bcrypt.compare(password, usuario.password);

  if (!validPassword) {
    throw new ServerError("Credenciales inválidas", 401);
  }

  if (!usuario.email_verificado) {
    throw new ServerError("Debés verificar tu email antes de iniciar sesión", 403);
  }

  return { access_token: signAccessToken(usuario) };
}
