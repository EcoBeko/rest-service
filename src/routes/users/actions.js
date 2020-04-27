import { UserModel } from "@/models";
import { isFalsy } from "@/utils";
import RouteService from "@/services/route";

const router = RouteService.make();

router.post("/register-user", RouteService.wrapper(), async (req, res) => {
  const { name, surname, password, phone, birthday } = req.body;
  const route = new RouteService(res);

  route.checkParameters(name, surname, password, phone, birthday);

  req.body.role = "user";
  const user = UserModel.create(req.body);

  route.checkValidation(user);
  route.check(await UserModel.exists(phone), "Phone number already exists", 400);

  await user.save();
  route.end("User Created", 201);
});

router.post("/validate", RouteService.wrapper(), (req, res) => {
  const { field, value } = req.body;
  const route = new RouteService(res);
});

export default router;
