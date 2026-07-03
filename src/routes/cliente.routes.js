import { Router } from "express";
import { actualizar, crear, detalle, eliminar, listar } from "../controllers/cliente.controller.js";
import { validate, validateObjectIdParam } from "../middlewares/validation.middleware.js";
import { clienteValidation } from "../middlewares/validations/cliente.validations.js";

const router = Router();

router.get("/", listar);
router.get("/:id", validateObjectIdParam("id"), detalle);
router.post("/", validate(clienteValidation), crear);
router.put("/:id", validateObjectIdParam("id"), validate(clienteValidation), actualizar);
router.delete("/:id", validateObjectIdParam("id"), eliminar);

export default router;
