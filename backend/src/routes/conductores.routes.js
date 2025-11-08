import { Router } from "express";
import { pool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import {
  conductorBody,
  conductorIdParam,
} from "../validators/conductores.validator.js";
import { validationResult } from "express-validator";

const router = Router();

// 🔒 Todas las rutas requieren token JWT
router.use(requireAuth);

/* ===========================
   LISTAR CONDUCTORES
=========================== */
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM conductores ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   OBTENER UNO
=========================== */
router.get("/:id", conductorIdParam, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const [rows] = await pool.query("SELECT * FROM conductores WHERE id = ?", [
      req.params.id,
    ]);

    if (rows.length === 0)
      return res.status(404).json({ message: "Conductor no encontrado" });

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   CREAR CONDUCTOR
=========================== */
router.post("/", conductorBody, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { nombre, apellido, dni, licencia, lic_vencimiento } = req.body;

    // Evitar DNI duplicado
    const [dup] = await pool.query("SELECT id FROM conductores WHERE dni = ?", [
      dni,
    ]);
    if (dup.length > 0)
      return res.status(409).json({ message: "El DNI ya está registrado" });

    const [result] = await pool.query(
      "INSERT INTO conductores (nombre, apellido, dni, licencia, lic_vencimiento) VALUES (?, ?, ?, ?, ?)",
      [nombre, apellido, dni, licencia, lic_vencimiento]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   ACTUALIZAR CONDUCTOR
=========================== */
router.put("/:id", [...conductorIdParam, ...conductorBody], async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { nombre, apellido, dni, licencia, lic_vencimiento } = req.body;

    const [result] = await pool.query(
      "UPDATE conductores SET nombre=?, apellido=?, dni=?, licencia=?, lic_vencimiento=? WHERE id=?",
      [nombre, apellido, dni, licencia, lic_vencimiento, req.params.id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Conductor no encontrado" });

    res.json({ updated: true });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   ELIMINAR CONDUCTOR
=========================== */
router.delete("/:id", conductorIdParam, async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM conductores WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Conductor no encontrado" });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
