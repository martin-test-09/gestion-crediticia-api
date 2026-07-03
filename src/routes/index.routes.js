import { Router } from "express";
import mongoose from "mongoose";
import authRoutes from "./auth.routes.js";
import bcraRoutes from "./bcra.routes.js";
import clienteRoutes from "./cliente.routes.js";
import presupuestoRoutes from "./presupuesto.routes.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";
import { sendSuccess } from "../utils/response.util.js";

const router = Router();

const mongoStatuses = {
  0: "disconnected",
  1: "connected",
  2: "connecting",
  3: "disconnecting"
};

router.get("/health", (_req, res) => {
  const readyState = mongoose.connection.readyState;
  const data = {
    service: "credit-api",
    timestamp: new Date().toISOString(),
    mongodb: {
      ready: readyState === 1,
      status: mongoStatuses[readyState] || "unknown",
      readyState
    }
  };

  if (!data.mongodb.ready) {
    return res.status(503).json({
      ok: false,
      status: 503,
      message: "API sin conexión a MongoDB",
      data
    });
  }

  return sendSuccess(res, 200, "API funcionando correctamente", data);
});

router.use("/auth", authRoutes);
router.use("/clientes", authMiddleware, clienteRoutes);
router.use("/presupuestos", authMiddleware, presupuestoRoutes);
router.use("/bcra", authMiddleware, bcraRoutes);

export default router;
