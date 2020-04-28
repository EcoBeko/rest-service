import RouteService from "@/services/route";
import { needToken } from "@/middleware";
import { UserModel } from "@/models";

const router = RouteService.make();

router.get("/fetch-chat/:id", needToken, (req, res) => {
  const id = +req.params["id"];

  const user = await UserModel.fetch(req.token.phone);
});

export default router;
