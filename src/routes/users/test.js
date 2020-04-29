import { UserModel } from "@/models";
import RouteService from "@/services/route";

const router = RouteService.make();

router.get("/test/exists", async (req, res, next) => {
  const route = new RouteService(req, res, next);
  const body = route.extract(["phone"]);

  res.send({
    exists: false,
  });
});

router.post("/test/create", async (req, res, next) => {
  const route = new RouteService(req, res, next);
  const user = UserModel.create(req.body);

  res.send({
    user,
  });
});

router.post("/test/save", async (req, res, next) => {
  const route = new RouteService(req, res, next);
  const user = UserModel.create(req.body);

  res.send({
    result: await user?.save(),
  });
});

export default router;
