import { Router } from "express";

const router = Router();

router.post("/register", (req, res) => {
  const { name, surname, password, gender, phone, birthday } = req.body;
});

export default router;
