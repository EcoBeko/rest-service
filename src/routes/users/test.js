import { Router } from "express";
import { UserModel } from "@/models";

const router = Router();

router.get("/test/exists", async (req, res) => {
  const { phone } = req.body;

  res.send({
    exists: await UserModel.exists(phone),
  });
});

router.post("/test/create", async (req, res) => {
  const user = UserModel.create(req.body);

  res.send({
    user,
  });
});

router.post("/test/save", async (req, res) => {
  const user = UserModel.create(req.body);

  res.send({
    result: await user?.save(),
  });
});

export default router;
