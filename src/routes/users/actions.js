import { Router } from "express";
import UsersService from "@/services/users";

const router = Router();

router.post("/validate-credentials", async (req, res) => {
  const { username, password } = req.body;
  const user = await UsersService.findByUsername(username);

  if (user && UsersService.validatePasswords(password, user.password)) {
    return res.status(200).send({
      status: true
    });
  }

  return res.status(user ? 406 : 404).send({
    status: false,
    err: user ? "Password is incorrect" : "User not found"
  });
});

export default router;
