import RouteService from "@/services/route";
import RoleService from "@/services/role";
import UserModel from "@/models/Users";
import { needToken } from "@/middleware";

const router = RouteService.make();

router.get("/fetch-data", needToken, async (req, res) => {
  const user = await UserModel.fetch(req.token.phone);
  user.modules = RoleService.getModules(req.token.role_level);
  delete user["role"];
  delete user["password"];
  delete user["saved"];

  res.status(200).send({
    status: true,
    message: "Data Fetched",
    user,
  });
});

export default router;
