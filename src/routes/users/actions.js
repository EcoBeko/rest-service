import { UserModel } from "@/models";
import { RouteService, ValidationService } from "@/services";

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

  route.action(() => {
    const user = UserModel.create(body);
    route.data.user = user;
  });

  route.checkValidation(route.data.user);

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

export default router;
