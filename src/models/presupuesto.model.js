import mongoose from "mongoose";

const resultadoBuroEntidadSchema = new mongoose.Schema({
  entidad: String,
  situacion: Number,
  monto: Number,
  diasAtrasoPago: Number,
  refinanciaciones: Boolean,
  enRevision: Boolean,
  procesoJud: Boolean
}, { _id: false });

const resultadoBuroSchema = new mongoose.Schema({
  consultado_en: {
    type: Date,
    required: true
  },
  modo: {
    type: String,
    enum: ["real", "demo"],
    required: true
  },
  sin_registros: {
    type: Boolean,
    default: false
  },
  periodo: {
    type: String,
    default: null
  },
  situacion: {
    type: Number,
    default: null
  },
  denominacion: {
    type: String,
    default: null
  },
  flags: {
    refinanciaciones: { type: Boolean, default: false },
    enRevision: { type: Boolean, default: false },
    procesoJud: { type: Boolean, default: false }
  },
  entidades: [resultadoBuroEntidadSchema]
}, { _id: false });

const presupuestoSchema = new mongoose.Schema({
  numero: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  cliente: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cliente",
    required: true
  },
  cuit: {
    type: String,
    required: true,
    trim: true
  },
  vehiculo: {
    marca: { type: String, required: true, trim: true },
    modelo: { type: String, required: true, trim: true },
    precio: { type: Number, required: true, min: 0 }
  },
  anticipo: {
    type: Number,
    required: true,
    min: 0
  },
  monto_financiado: {
    type: Number,
    required: true,
    min: 0
  },
  tasa: {
    type: Number,
    required: true,
    min: 0
  },
  plazo: {
    type: Number,
    enum: [12, 24, 36, 48, 60],
    required: true
  },
  gastos: {
    type: Number,
    default: 0,
    min: 0
  },
  seguro: {
    type: Number,
    default: 0,
    min: 0
  },
  vigencia: {
    type: Date,
    default: null
  },
  cuota_mensual: {
    type: Number,
    required: true,
    min: 0
  },
  estado: {
    type: String,
    enum: ["aprobado", "pendiente", "rechazado"],
    required: true
  },
  resultado_buro: resultadoBuroSchema,
  fecha_creacion: {
    type: Date,
    default: Date.now
  },
  activo: {
    type: Boolean,
    default: true
  }
});

export const Presupuesto = mongoose.model("Presupuesto", presupuestoSchema);
