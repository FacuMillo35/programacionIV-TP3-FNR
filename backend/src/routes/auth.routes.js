import { Router } from "express";
import { registerValidator, loginValidator } from "../validators/auth.validator.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { pool } from "../config/db.js";

dotenv.config();
const router = Router();

/* ===========================
   REGISTRO DE USUARIO
=========================== */
router.post("/register", registerValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { nombre, email, password } = req.body;

    // Verificar si el email ya está registrado
    const [existing] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existing.length > 0)
      return res.status(409).json({ message: "El email ya está registrado" });

    // Encriptar contraseña
    const hash = await bcrypt.hash(password, 10);

    // Insertar nuevo usuario
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, password_hash) VALUES (?, ?, ?)",
      [nombre, email, hash]
    );

    res.status(201).json({ id: result.insertId, nombre, email });
  } catch (err) {
    next(err);
  }
});

/* ===========================
   LOGIN
=========================== */
router.post("/login", loginValidator, async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;

    // Buscar usuario
    const [rows] = await pool.query(
      "SELECT id, nombre, email, password_hash FROM usuarios WHERE email = ?",
      [email]
    );

    if (rows.length === 0)
      return res.status(401).json({ message: "Credenciales incorrectas" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match)
      return res.status(401).json({ message: "Credenciales incorrectas" });

    // Crear token
    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES || "4h" }
    );

    res.json({
      token,
      user: { id: user.id, nombre: user.nombre, email: user.email },
    });
  } catch (err) {
    next(err);
  }
});

export default router;
