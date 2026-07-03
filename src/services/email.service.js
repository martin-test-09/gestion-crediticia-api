import { environment } from "../config/environment.config.js";
import { mailerTransport } from "../config/mailer.config.js";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "\"": "&quot;",
    "'": "&#39;"
  }[character]));
}

export async function sendVerificationEmail({ email, nombre, token }) {
  const verificationLink = `${environment.urlFrontend}/verificar-email?token=${encodeURIComponent(token)}`;
  const safeNombre = escapeHtml(nombre);
  const safeVerificationLink = escapeHtml(verificationLink);

  return mailerTransport.sendMail({
    from: `Gestión Crediticia <${environment.gmailUsername}>`,
    to: email,
    subject: "Verificación de email - Gestión Crediticia",
    html: `
      <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
        <h2>Hola ${safeNombre}</h2>
        <p>Para activar tu cuenta en Gestión Crediticia, ingresá al siguiente enlace:</p>
        <p><a href="${safeVerificationLink}" style="color:#1d4ed8;">Verificar email</a></p>
        <p>El enlace vence en 24 horas.</p>
      </div>
    `
  });
}
