import { UserModel } from "@/models";
import {
  RouteService,
  ValidationService,
  TokenService,
  RoleService,
} from "@/services";

const router = RouteService.make();

router.post("/register-user", async (req, res, next) => {
  const route = new RouteService(req, res, next);
  const body = route.extract({
    name: true,
    surname: true,
    password: true,
    phone: true,
    birthday: true,
    gender: false,
  });

  body.role = "user";

  route.checkValidation(ValidationService.run("users", body));

  route.action(() => {
    const user = UserModel.create(body);
    route.data.user = user;
  });

  await route.check(
    async () => await UserModel.exists(route.data.user.phone),
    "Phone number already exists",
    400
  );

  await route.action(async () => await route.data.user.save());
  route.end("User Created", 201);
});

router.post("/validate", (req, res, next) => {
  const route = new RouteService(req, res, next);
  const body = route.extract({ field: true, value: true });
  body[body.field] = body.value;

  route.checkValidation(ValidationService.run("users", body));

  route.end("Credentials are valid", 200);
});

router.get("/authenticate", async (req, res, next) => {
  const route = new RouteService(req, res, next);
  // 412
  const body = route.extract({ phone: true, password: true });

  // 406
  route.checkValidation(ValidationService.run("users", body));

  // 404
  await route.check(
    async () => !UserModel.exists(body.phone),
    "User not found",
    404
  );

  // fetch user
  await route.action(async () => {
    const user = await UserModel.fetch(body.phone, body.password);
    route.data.user = user;
  });

  // 406
  route.checkSync(() => !route.data.user, "Password is incorrect", 406);

  // 200
  route.endAction((req, res) => {
    const { role, phone } = route.data.user;

    res.status(200).send({
      status: true,
      message: "Token created",
      token: TokenService.create({
        ip: req.clientIp,
        role_level: RoleService.getLevel(role),
        phone,
      }),
    });
  });
});

export default router;
