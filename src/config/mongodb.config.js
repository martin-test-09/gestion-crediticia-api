import mongoose from "mongoose";
import { environment } from "./environment.config.js";

export async function connectDatabase() {
  await mongoose.connect(environment.mongodbUri);
  console.log("MongoDB conectado");
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
