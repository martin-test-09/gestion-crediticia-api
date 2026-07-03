import dotenv from "dotenv";

dotenv.config();

const requiredVariables = [
  "PORT",
  "MONGODB_URI",
  "JWT_SECRET",
  "GMAIL_USERNAME",
  "GMAIL_PASSWORD",
  "URL_FRONTEND",
  "BCRA_MODE"
];

const envValues = requiredVariables.reduce((values, key) => {
  values[key] = process.env[key]?.trim() || "";
  return values;
}, {});

const missingVariables = requiredVariables.filter((key) => !envValues[key]);

if (missingVariables.length > 0) {
  throw new Error(`Faltan variables de entorno requeridas: ${missingVariables.join(", ")}`);
}

if (!["real", "demo"].includes(envValues.BCRA_MODE)) {
  throw new Error("BCRA_MODE debe ser 'real' o 'demo'");
}

const normalizedFrontendUrl = envValues.URL_FRONTEND.replace(/\/+$/, "");

if (normalizedFrontendUrl.includes("*")) {
  throw new Error("URL_FRONTEND debe ser un origen exacto y no puede usar '*'");
}

export const environment = {
  port: Number(envValues.PORT),
  mongodbUri: envValues.MONGODB_URI,
  jwtSecret: envValues.JWT_SECRET,
  gmailUsername: envValues.GMAIL_USERNAME,
  gmailPassword: envValues.GMAIL_PASSWORD,
  urlFrontend: normalizedFrontendUrl,
  bcraMode: envValues.BCRA_MODE
};
