import { environment } from "../../config/environment.config.js";
import { consultarDeudasDemo } from "./bcra.demo.js";
import { consultarDeudasReal } from "./bcra.real.js";

export function getBcraMode() {
  return environment.bcraMode;
}

export async function consultarDeudas(cuit) {
  if (environment.bcraMode === "demo") {
    return consultarDeudasDemo(cuit);
  }

  return consultarDeudasReal(cuit);
}
