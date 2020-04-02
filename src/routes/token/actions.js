import { Router } from "express";
import TokenService from "@/services/token";

const router = Router();

router.get("/validate", (req, res) => {
  const token = TokenService.bearerParser(req.headers["authorization"]);
  const result = TokenService.validate(token);

  if (result) return res.status(200).send(result);
  return res.sendStatus(406);
});

export default router;
