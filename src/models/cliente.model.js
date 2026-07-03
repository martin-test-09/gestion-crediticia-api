import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  cuit: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  telefono: {
    type: String,
    required: true,
    trim: true
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

export const Cliente = mongoose.model("Cliente", clienteSchema);
