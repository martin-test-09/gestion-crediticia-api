export class ServerError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.name = "ServerError";
    this.status = status;
  }
}
