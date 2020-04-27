import { Router } from "express";
import TokenService from "@/services/token";
import { needToken } from "@/middleware";

const router = Router();

router.get("/need-token", needToken, (req, res) => {
  res.sendStatus(200);
});

router.get("/new-token", (req, res) => {
  const { role_level, phone } = req.body;
  const { clientIp } = req;

  const token = TokenService.create(
    {
      role_level,
      phone,
      ip: clientIp,
    },
    "3h"
  );

  res.send({
    token,
  });
});

export default router;
