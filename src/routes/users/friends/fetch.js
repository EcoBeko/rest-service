import RouteService from "@/services/route";
import UserModel from "@/models/Users";
import { needToken } from "@/middleware";

const router = RouteService.make();

router.get("/recommendations", needToken, async (req, res) => {
  const user = await UserModel.fetch(req.token.phone);

  res.status(200).send({
    status: true,
    message: "Recommendation lists",
    users: await user.getRandom(),
  });
});

export default router;
