import nodemailer from "nodemailer";
import { environment } from "./environment.config.js";

export const mailerTransport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: environment.gmailUsername,
    pass: environment.gmailPassword
  }
});
