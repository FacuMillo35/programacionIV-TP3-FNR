import { Router } from "express";
import { pool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";
import {
  viajeBody,
  viajeIdParam,
  filtroHistorial,
} from "../validators/viajes.validator.js";
import { validationResult } from "express-validator";

const router = Router();

// 🔒 Todas las rutas protegidas
router.use(requireAuth);

/* ===========================
   LISTAR VIAJES (con JOIN)
=========================== */
router.get("/", async (_req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT v.id, v.fecha_salida, v.fecha_llegada, v.origen, v.destino,
             v.kilometros, v.observaciones,
             ve.marca AS vehiculo_marca, ve.modelo AS vehiculo_modelo, ve.patente,
             c.nombre AS conductor_nombre, c.apellido AS conductor_apellido
      FROM viajes v
      JOIN vehiculos ve ON v.vehiculo_id = ve.id
      JOIN conductores c ON v.conductor_id = c.id
      ORDER BY v.id DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   CREAR VIAJE
=========================== */
router.post("/", viajeBody, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const {
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
      observaciones,
    } = req.body;

    // Verificar existencia de vehículo y conductor
    const [[vehiculo]] = await pool.query(
      "SELECT id FROM vehiculos WHERE id = ?",
      [vehiculo_id]
    );
    const [[conductor]] = await pool.query(
      "SELECT id FROM conductores WHERE id = ?",
      [conductor_id]
    );

    if (!vehiculo || !conductor)
      return res
        .status(400)
        .json({ message: "Vehículo o conductor inexistente" });

    const [result] = await pool.query(
      `INSERT INTO viajes (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones || null,
      ]
    );

    res.status(201).json({ id: result.insertId });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   HISTORIAL (por vehículo o conductor)
=========================== */
router.get("/historial", filtroHistorial, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { vehiculo_id, conductor_id } = req.query;

    if (!vehiculo_id && !conductor_id)
      return res
        .status(400)
        .json({ message: "Debe especificar vehiculo_id o conductor_id" });

    let sql = `
      SELECT v.*, 
             ve.marca, ve.modelo, ve.patente,
             c.nombre, c.apellido
      FROM viajes v
      JOIN vehiculos ve ON v.vehiculo_id = ve.id
      JOIN conductores c ON v.conductor_id = c.id
      WHERE 1=1
    `;
    const params = [];

    if (vehiculo_id) {
      sql += " AND v.vehiculo_id = ?";
      params.push(vehiculo_id);
    }

    if (conductor_id) {
      sql += " AND v.conductor_id = ?";
      params.push(conductor_id);
    }

    sql += " ORDER BY v.fecha_salida DESC";

    const [rows] = await pool.query(sql, params);
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   TOTAL DE KM POR VEHÍCULO
=========================== */
router.get("/km/vehiculo/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[row]] = await pool.query(
      "SELECT COALESCE(SUM(kilometros), 0) AS km_totales FROM viajes WHERE vehiculo_id = ?",
      [id]
    );
    res.json(row);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   TOTAL DE KM POR CONDUCTOR
=========================== */
router.get("/km/conductor/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const [[row]] = await pool.query(
      "SELECT COALESCE(SUM(kilometros), 0) AS km_totales FROM viajes WHERE conductor_id = ?",
      [id]
    );
    res.json(row);
  } catch (err) {
    next(err);
  }
});

/* ===========================
   ELIMINAR VIAJE
=========================== */
router.delete("/:id", viajeIdParam, async (req, res, next) => {
  try {
    const [result] = await pool.query("DELETE FROM viajes WHERE id = ?", [
      req.params.id,
    ]);

    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Viaje no encontrado" });

    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
