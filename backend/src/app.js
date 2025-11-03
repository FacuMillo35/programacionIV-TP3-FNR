import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import passport from "./middleware/passport.js";
import createError from "http-errors";

import authRoutes from "./routes/auth.routes.js";
import vehiculosRoutes from "./routes/vehiculos.routes.js";
import conductoresRoutes from "./routes/conductores.routes.js";
import viajesRoutes from "./routes/viajes.routes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/vehiculos", vehiculosRoutes);
app.use("/api/conductores", conductoresRoutes);
app.use("/api/viajes", viajesRoutes);

// 404 handler
app.use((_req, _res, next) => next(createError(404, "Ruta no encontrada")));

// Error handler
app.use((err, req, res, next) => {
  console.error("ERROR:", err);
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor",
  });
});

app.listen(process.env.PORT, () =>
  console.log(`✅ Server running: http://localhost:${process.env.PORT}`)
);
