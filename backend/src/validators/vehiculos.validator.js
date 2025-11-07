import { body, param } from "express-validator";

export const vehiculoIdParam = [
  param("id").isInt({ gt: 0 }).withMessage("ID de vehículo inválido"),
];

export const vehiculoBody = [
  body("marca").trim().notEmpty().withMessage("La marca es obligatoria"),
  body("modelo").trim().notEmpty().withMessage("El modelo es obligatorio"),
  body("patente").trim().notEmpty().withMessage("La patente es obligatoria"),
  body("anio")
    .isInt({ min: 1900, max: 2100 })
    .withMessage("El año debe estar entre 1900 y 2100"),
  body("capacidad_carga")
    .isFloat({ min: 0 })
    .withMessage("La capacidad de carga debe ser un número positivo"),
];
