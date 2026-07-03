import mongoose from "mongoose";

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  email_verificado: {
    type: Boolean,
    default: false
  },
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

export const Usuario = mongoose.model("Usuario", usuarioSchema);
