import cors from "cors";
import express from "express";
import { environment } from "./config/environment.config.js";
import { connectDatabase } from "./config/mongodb.config.js";
import { errorHandler, notFoundHandler } from "./middlewares/error.middleware.js";
import indexRoutes from "./routes/index.routes.js";

const app = express();

app.use(cors({ origin: environment.urlFrontend }));
app.use(express.json());

app.use("/api", indexRoutes);

app.use(notFoundHandler);
app.use(errorHandler);

connectDatabase()
  .then(() => {
    app.listen(environment.port, () => {
      console.log(`Servidor iniciado en puerto ${environment.port}`);
    });
  })
  .catch((error) => {
    console.error("No se pudo iniciar el servidor", error);
    process.exit(1);
  });

export default app;
