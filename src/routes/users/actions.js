import { Router } from "express";
import { UserModel } from "@/models";
import { isFalsy } from "@/utils";

const router = Router();

router.post("/register-user", async (req, res) => {
  const { name, surname, password, gender, phone, birthday } = req.body;

  if (isFalsy(name, surname, password, birthday))
    return res.status(412).send({
      status: false,
      message: "Request conditions are not met",
    });

  if (!UserModel.exists(phone))
    return res.status(400).send({
      status: false,
      message: "Phone number already exists",
    });

  req.body.role = "user";
  const user = UserModel.create(req.body);

  if (!user)
    return res.status(406).send({
      status: false,
      message: "Data validation error",
    });

  await user.save();
  return res.status(201).send({
    status: true,
    message: "User created",
  });
});

export default router;
