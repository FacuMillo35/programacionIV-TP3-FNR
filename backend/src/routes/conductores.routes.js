import { Router } from "express";
const router = Router();

router.get("/test", (req, res) => {
  res.json({ msg: "Conductores funcionando" });
});

export default router;
