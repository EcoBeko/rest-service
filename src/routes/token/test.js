import { Router } from "express";
import TokenService from "@/services/token";
import { needToken } from "@/middleware";

const router = Router();

router.get("/test/content", (req, res) => {
  res.send({
    token: TokenService.validate(
      TokenService.bearerParser(req.headers["authorization"])
    ),
  });
});

router.get("/test/need-token", needToken, (req, res) => {
  res.send({
    token: req.token,
  });
});

router.post("/test/new-token", (req, res) => {
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

router.get("/test/params/:id", needToken, (req, res) => {
  res.send({
    id: req.params["id"],
  });
});

router.get("/test/:p1/between", needToken, (req, res) => {
  res.send({
    p1: req.params["p1"],
  });
});

router.get("/test/:p1/multiple/:p2", needToken, (req, res) => {
  res.send({
    p1: req.params["p1"],
    p2: req.params["p2"],
  });
});

export default router;
