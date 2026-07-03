import { ServerError } from "../utils/serverError.util.js";
import { getValue, isCuit, isMongoId, setValue } from "../utils/validators.util.js";

export function validate(schema) {
  return (req, _res, next) => {
    const errors = [];
    const sanitizedBody = {};

    for (const [path, checks] of Object.entries(schema)) {
      const value = getValue(req.body, path);

      for (const check of checks) {
        const error = check(value, req.body);
        if (error) {
          errors.push(error);
        }
      }

      if (value !== undefined) {
        setValue(sanitizedBody, path, value);
      }
    }

    if (errors.length > 0) {
      return next(new ServerError(errors.join(". "), 400));
    }

    req.body = sanitizedBody;
    return next();
  };
}

export function validateObjectIdParam(paramName = "id") {
  return (req, _res, next) => {
    const error = isMongoId("ID")(req.params[paramName]);

    if (error) {
      return next(new ServerError(error, 400));
    }

    return next();
  };
}

export function validateCuitParam(paramName = "cuit") {
  return (req, _res, next) => {
    const error = isCuit("CUIT")(req.params[paramName]);

    if (error) {
      return next(new ServerError(error, 400));
    }

    return next();
  };
}
