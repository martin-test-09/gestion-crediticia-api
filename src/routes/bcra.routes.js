import { Router } from "express";
import { consultar } from "../controllers/bcra.controller.js";
import { validateCuitParam } from "../middlewares/validation.middleware.js";

const router = Router();

router.get("/:cuit", validateCuitParam("cuit"), consultar);

export default router;
