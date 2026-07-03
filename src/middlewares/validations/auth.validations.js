import { isEmail, minLength, required } from "../../utils/validators.util.js";

export const registerValidation = {
  nombre: [required("Nombre"), minLength("Nombre", 3)],
  email: [required("Email"), isEmail("Email")],
  password: [required("Contraseña"), minLength("Contraseña", 6)]
};

export const loginValidation = {
  email: [required("Email"), isEmail("Email")],
  password: [required("Contraseña")]
};

export const resendVerificationValidation = {
  email: [required("Email"), isEmail("Email")]
};
