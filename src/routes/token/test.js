import { Router } from "express";
import TokenService from "@/services/token";

const router = Router();

router.post("/generate", (req, res) => {
  return res.status(200).send({
    token: TokenService.create(req.body)
  });
});

export default router;
