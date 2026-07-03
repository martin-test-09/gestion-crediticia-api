import { isCuit, isEmail, minLength, required } from "../../utils/validators.util.js";

export const clienteValidation = {
  nombre: [required("Nombre"), minLength("Nombre", 2)],
  email: [required("Email"), isEmail("Email")],
  cuit: [required("CUIT"), isCuit("CUIT")],
  telefono: [required("Teléfono"), minLength("Teléfono", 4)]
};
