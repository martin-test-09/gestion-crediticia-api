import { consultarDeudas } from "../services/bcra/bcra.service.js";
import { sendSuccess } from "../utils/response.util.js";

export async function consultar(req, res) {
  const resultado = await consultarDeudas(req.params.cuit);
  return sendSuccess(res, 200, "Consulta BCRA realizada correctamente", resultado);
}
