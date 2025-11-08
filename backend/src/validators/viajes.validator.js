import { body, param, query } from "express-validator";

export const viajeIdParam = [
  param("id").isInt({ gt: 0 }).withMessage("ID de viaje inválido"),
];

export const viajeBody = [
  body("vehiculo_id")
    .isInt({ gt: 0 })
    .withMessage("Debe especificar un ID de vehículo válido"),
  body("conductor_id")
    .isInt({ gt: 0 })
    .withMessage("Debe especificar un ID de conductor válido"),
  body("fecha_salida")
    .isISO8601()
    .withMessage("Formato de fecha_salida inválido (YYYY-MM-DD HH:MM:SS)"),
  body("fecha_llegada")
    .isISO8601()
    .withMessage("Formato de fecha_llegada inválido (YYYY-MM-DD HH:MM:SS)"),
  body("origen").trim().notEmpty().withMessage("El origen es obligatorio"),
  body("destino").trim().notEmpty().withMessage("El destino es obligatorio"),
  body("kilometros")
    .isFloat({ min: 0 })
    .withMessage("Los kilómetros deben ser un número positivo"),
  body("observaciones")
    .optional()
    .isString()
    .withMessage("Las observaciones deben ser texto"),
];

export const filtroHistorial = [
  query("vehiculo_id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El ID de vehículo debe ser numérico"),
  query("conductor_id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("El ID de conductor debe ser numérico"),
];
