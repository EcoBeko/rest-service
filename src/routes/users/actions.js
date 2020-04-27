import { Router } from "express";
import { isFalsy } from "@/utils";
import { UserModel } from "@/models";

const router = Router();

router.post("/register-user", (req, res) => {
  const { name, surname, password, gender, phone, birthday } = req.body;

  if (isFalsy(name, surname, password, phone, birthday)) return res.sendStatus(412);
});

export default router;
