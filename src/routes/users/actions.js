import { Router } from "express";
import { UserModel } from "@/models";
import { isFalsy, makeStatus } from "@/utils";
import { Logger } from "@/services";

const router = Router();

router.post("/register-user", async (req, res) => {
  const { name, surname, password, phone, birthday } = req.body;
  const sendOn = makeStatus(res);
  try {
    sendOn(
      isFalsy(name, surname, password, birthday),
      "Request conditions are not met",
      412
    );

    req.body.role = "user";
    const user = UserModel.create(req.body);

    sendOn(
      "status" in user && !user.status,
      "Data validation error on " + user.field,
      406
    );
    sendOn(await UserModel.exists(phone), "Phone number already exists", 400);

    await user.save();
    sendOn(true, "User Created", 201, true);
  } catch (err) {
    if (err.message !== "end") Logger.error("api/users/register-user route", err);
  }
});

export default router;
