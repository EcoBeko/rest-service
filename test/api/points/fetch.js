import RouteService from "@/services/route";
import ValidationService from "@/services/validation";
import { needToken } from "@/middleware";
import { UserModel, PointModel } from "@/models";

const router = RouteService.make();

router.post("/fetch:type", async (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = route.extract({ query: true });
  body.type = req.params["type"] ? +req.params["type"] : 0;

  // fetch user and post
  await route.action(async () => {});

  // add comment
  await route.action(async () => {
    await route.data.post.addComment(body.comment, route.data.user.id);
  });

  route.end("Comment Added", 201);
});

export default router;
