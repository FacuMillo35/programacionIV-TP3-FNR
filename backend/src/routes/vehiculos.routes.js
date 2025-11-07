import { Router } from "express";
import { pool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import { vehiculoBody, vehiculoIdParam } from "../validators/vehiculos.validator.js";
import { validationResult } from "express-validator";

const router = Router();

// 🔒 todas las rutas de vehículos requieren JWT
router.use(requireAuth);

/* ===========================
   LISTAR VEHÍCULOS
=========================== */
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM vehiculos ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   OBTENER UNO
=========================== */
router.get("/:id", vehiculoIdParam, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const [rows] = await pool.query("SELECT * FROM vehiculos WHERE id = ?", [
      req.params.id,
    ]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Vehículo no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   CREAR VEHÍCULO
=========================== */
router.post("/", vehiculoBody, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { marca, modelo, patente, anio, capacidad_carga } = req.body;

    const [dup] = await pool.query(
      "SELECT id FROM vehiculos WHERE patente = ?",
      [patente]
    );
    if (dup.length > 0)
      return res.status(409).json({ message: "La patente ya está registrada" });

    const [result] = await pool.query(
      "INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)",
      [marca, modelo, patente, anio, capacidad_carga]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   ACTUALIZAR VEHÍCULO
=========================== */
router.put("/:id", [...vehiculoIdParam, ...vehiculoBody], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { marca, modelo, patente, anio, capacidad_carga } = req.body;

    const [result] = await pool.query(
      "UPDATE vehiculos SET marca = ?, modelo = ?, patente = ?, anio = ?, capacidad_carga = ? WHERE id = ?",
      [marca, modelo, patente, anio, capacidad_carga, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Vehículo no encontrado" });

    res.json({ updated: true });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   ELIMINAR VEHÍCULO
=========================== */
router.delete("/:id", vehiculoIdParam, async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM vehiculos WHERE id = ?", [
      req.params.id,
    ]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Vehículo no encontrado" });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
