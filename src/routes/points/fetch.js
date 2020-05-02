import RouteService from "@/services/route";
import { PointModel } from "@/models";

const router = RouteService.make();

router.post("/fetch/:type", async (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = route.extract({ query: true });
  body.type = req.params["type"] ?? "";

  await route.action(async () => {
    route.data.points = await PointModel.fetchBy(body.type, body.query);
  });

  route.endAction((req, res) => {
    res.status(200).send({
      status: true,
      message: "Success",
      points: route.data.points,
    });
  });
});

export default router;
