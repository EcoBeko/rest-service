import RouteService from "@/services/route";
import ImageService from "@/services/image";
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

export default router;
