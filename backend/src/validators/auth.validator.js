import { body } from "express-validator";

export const registerValidator = [
  body("nombre")
    .trim()
    .notEmpty()
    .withMessage("El nombre es obligatorio"),
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 caracteres"),
];

export const loginValidator = [
  body("email")
    .isEmail()
    .withMessage("Debe ser un email válido"),
  body("password")
    .notEmpty()
    .withMessage("Debe ingresar la contraseña"),
];
