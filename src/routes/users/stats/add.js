import RouteService from "@/services/route";
import UserModel from "@/models/Users";
import { needToken } from "@/middleware";

const router = RouteService.make();

router.put("/add", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);
  const body = route.extract({
    trees: true,
    energy: true,
    waste: true,
  });

  await route.action(async () => {
    const user = await UserModel.fetch(req.token.phone);
    await user.stats.add(body.trees, body.energy, body.waste);
  });

  route.end("Success", 200);
});

export default router;
