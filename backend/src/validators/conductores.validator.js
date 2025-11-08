import { body, param } from "express-validator";

export const conductorIdParam = [
  param("id").isInt({ gt: 0 }).withMessage("ID de conductor inválido"),
];

export const conductorBody = [
  body("nombre").trim().notEmpty().withMessage("El nombre es obligatorio"),
  body("apellido").trim().notEmpty().withMessage("El apellido es obligatorio"),
  body("dni")
    .trim()
    .notEmpty()
    .withMessage("El DNI es obligatorio"),
  body("licencia")
    .trim()
    .notEmpty()
    .withMessage("La licencia es obligatoria"),
  body("lic_vencimiento")
    .isISO8601()
    .withMessage("La fecha de vencimiento debe tener formato YYYY-MM-DD"),
];
