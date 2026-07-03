import jwt from "jsonwebtoken";
import { environment } from "../config/environment.config.js";
import { ServerError } from "../utils/serverError.util.js";

export function authMiddleware(req, _res, next) {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new ServerError("Token requerido", 401));
  }

  const token = authorization.replace("Bearer ", "").trim();
  const payload = jwt.verify(token, environment.jwtSecret);

  if (payload.type !== "access") {
    return next(new ServerError("Token inválido", 401));
  }

  req.user = payload;
  return next();
}
