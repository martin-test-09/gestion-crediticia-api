import { Router } from "express";
import {
  actualizar,
  actualizarEstado,
  crear,
  detalle,
  eliminar,
  listar
} from "../controllers/presupuesto.controller.js";
import { validate, validateObjectIdParam } from "../middlewares/validation.middleware.js";
import {
  createPresupuestoValidation,
  updateEstadoValidation,
  updatePresupuestoValidation
} from "../middlewares/validations/presupuesto.validations.js";

const router = Router();

router.get("/", listar);
router.get("/:id", validateObjectIdParam("id"), detalle);
router.post("/", validate(createPresupuestoValidation), crear);
router.put("/:id", validateObjectIdParam("id"), validate(updatePresupuestoValidation), actualizar);
router.patch("/:id/estado", validateObjectIdParam("id"), validate(updateEstadoValidation), actualizarEstado);
router.delete("/:id", validateObjectIdParam("id"), eliminar);

export default router;
