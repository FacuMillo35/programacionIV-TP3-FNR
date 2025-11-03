import { Router } from "express";
const router = Router();

// Temporal: para probar que carga
router.get("/test", (req, res) => {
  res.json({ msg: "Auth funcionando" });
});

export default router;
