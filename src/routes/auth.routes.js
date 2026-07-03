import { Router } from "express";
import { login, register, resend, verifyEmail } from "../controllers/auth.controller.js";
import { validate } from "../middlewares/validation.middleware.js";
import {
  loginValidation,
  registerValidation,
  resendVerificationValidation
} from "../middlewares/validations/auth.validations.js";

const router = Router();

router.post("/register", validate(registerValidation), register);
router.get("/verify-email", verifyEmail);
router.post("/resend-verification", validate(resendVerificationValidation), resend);
router.post("/login", validate(loginValidation), login);

export default router;
