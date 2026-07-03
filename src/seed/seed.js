import bcrypt from "bcrypt";
import { Cliente } from "../models/cliente.model.js";
import { Presupuesto } from "../models/presupuesto.model.js";
import { upsertVerifiedUsuario } from "../repositories/usuario.repository.js";
import {
  createDemoPresupuestoIfMissing,
  ensureCounterAtLeast,
  ensurePresupuestoCounter,
  nextNumero
} from "../repositories/presupuesto.repository.js";
import { connectDatabase, disconnectDatabase } from "../config/mongodb.config.js";
import { consultarDeudasDemo } from "../services/bcra/bcra.demo.js";
import { buildPresupuestoFromSeed } from "../services/presupuesto.service.js";

const TEST_USER = {
  nombre: "Usuario Demo",
  email: "test@test.com",
  password: "Test1234"
};

const demoClientes = [
  { nombre: "Cliente Aprobado", email: "aprobado@example.com", cuit: "20000000001", telefono: "1130000001" },
  { nombre: "Cliente Pendiente", email: "pendiente@example.com", cuit: "20000000002", telefono: "1130000002" },
  { nombre: "Cliente Rechazado", email: "rechazado@example.com", cuit: "20000000004", telefono: "1130000004" }
];

const demoFinancialData = [
  {
    vehiculo: { marca: "Toyota", modelo: "Corolla XEI", precio: 24500000 },
    anticipo: 6500000,
    tasa: 45,
    plazo: 36,
    gastos: 250000,
    seguro: 90000,
    vigencia: "2026-12-31"
  },
  {
    vehiculo: { marca: "Volkswagen", modelo: "T-Cross Comfortline", precio: 28500000 },
    anticipo: 8000000,
    tasa: 52,
    plazo: 48,
    gastos: 300000,
    seguro: 110000,
    vigencia: "2026-12-31"
  },
  {
    vehiculo: { marca: "Ford", modelo: "Ranger XLS", precio: 42000000 },
    anticipo: 14000000,
    tasa: 59,
    plazo: 60,
    gastos: 450000,
    seguro: 160000,
    vigencia: "2026-12-31"
  }
];

async function seedUser() {
  const hashedPassword = await bcrypt.hash(TEST_USER.password, 12);
  await upsertVerifiedUsuario({
    nombre: TEST_USER.nombre,
    email: TEST_USER.email,
    password: hashedPassword
  });
}

async function seedDemoData() {
  for (const [index, clienteData] of demoClientes.entries()) {
    const cliente = await Cliente.findOneAndUpdate(
      { cuit: clienteData.cuit },
      { $set: { ...clienteData, activo: true }, $setOnInsert: { fecha_creacion: new Date() } },
      { upsert: true, new: true, runValidators: true }
    );

    const existing = await Presupuesto.findOne({ cuit: cliente.cuit, activo: true });
    if (existing) {
      continue;
    }

    const numero = await nextNumero();
    const bcraResult = await consultarDeudasDemo(cliente.cuit);
    const presupuesto = buildPresupuestoFromSeed({
      numero,
      cliente,
      financialData: demoFinancialData[index],
      bcraResult
    });

    await createDemoPresupuestoIfMissing(cliente.cuit, presupuesto);
  }
}

async function syncCounterWithExistingPresupuestos() {
  const presupuestos = await Presupuesto.find({}, { numero: 1 });
  const maxSeq = presupuestos.reduce((max, presupuesto) => {
    const match = presupuesto.numero?.match(/^P-(\d{5})$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 0);

  await ensureCounterAtLeast(maxSeq);
}

async function runSeed() {
  const withDemo = process.argv.includes("--with-demo");

  await connectDatabase();
  await ensurePresupuestoCounter();
  await seedUser();

  if (withDemo) {
    await seedDemoData();
  }

  await syncCounterWithExistingPresupuestos();
  await disconnectDatabase();

  console.log("Seed ejecutado correctamente");
  console.log(`Usuario verificado: ${TEST_USER.email} / ${TEST_USER.password}`);
}

runSeed().catch(async (error) => {
  console.error("Error al ejecutar seed", error);
  await disconnectDatabase();
  process.exit(1);
});
