import { Usuario } from "../models/usuario.model.js";

export async function createUsuario(data) {
  return Usuario.create(data);
}

export async function findUsuarioByEmail(email) {
  return Usuario.findOne({ email: String(email).toLowerCase().trim(), activo: true });
}

export async function markUsuarioEmailVerified(email) {
  return Usuario.findOneAndUpdate(
    { email: String(email).toLowerCase().trim(), activo: true },
    { $set: { email_verificado: true } },
    { new: true }
  );
}

export async function upsertVerifiedUsuario({ nombre, email, password }) {
  return Usuario.findOneAndUpdate(
    { email: String(email).toLowerCase().trim() },
    {
      $set: {
        nombre,
        password,
        email_verificado: true,
        activo: true
      },
      $setOnInsert: {
        fecha_creacion: new Date()
      }
    },
    { upsert: true, new: true }
  );
}
