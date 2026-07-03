export function sendSuccess(res, status, message, data) {
  const payload = { ok: true, status, message };

  if (data !== undefined) {
    payload.data = data;
  }

  return res.status(status).json(payload);
}
