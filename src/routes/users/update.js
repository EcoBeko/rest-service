import RouteService from "@/services/route";
import ImageService from "@/services/image";
import ValidationService from "@/services/validation";
import CryptoService from "@/services/crypto";
import UserModel from "@/models/Users";
import { needToken } from "@/middleware";

const router = RouteService.make();

router.put("/update-photo", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);
  const file = req.files.file;

  route.checkParameters(file);

  await route.action(async () => {
    const fileName = await ImageService.add(file);

    await UserModel.updatePhoto(req.token.phone, fileName);
  });

  route.end("Avatar Updated", 200);
});

router.put("/update-info", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);
  // 412
  const body = route.extract({
    name: true,
    surname: true,
    gender: false,
    birthday: true,
  });

  // 406
  route.checkValidation(ValidationService.run("users", body));

  await route.action(async () => {
    await UserModel.updateInfo(req.token.phone, body);
  });

  route.end("User updated", 200);
});

router.put("/update-credentials", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);

  // 412
  const body = route.extract({
    oldPassword: true,
    newPassword: true,
  });

  // 406
  route.checkValidation(
    ValidationService.run("users", { password: body.newPassword })
  );

  await route.action(async () => {
    const user = await UserModel.fetch(req.token.phone, body.oldPassword);
    route.data.user = user;
  });

  // 406
  route.checkSync(() => !route.data.user, "Old password is incorrect", 406);

  await route.action(async () => {
    await UserModel.updateCredentials(req.token.phone, body.newPassword);
  });

  route.end("User's password updated", 200);
});

export default router;
