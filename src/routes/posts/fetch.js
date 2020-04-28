import RouteService from "@/services/route";
import { needToken } from "@/middleware";
import { UserModel, PostModel } from "@/models";

const router = RouteService.make();

router.get("/fetch-portion", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = route.extract({ offset: true });

  // fetch user
  await route.action(async () => {
    route.data.user = await UserModel.fetch(req.token.phone);
  });

  // fetch posts
  await route.action(async () => {
    route.data.posts = await PostModel.fetchPortion(route.data.user.id, body.offset);
  });

  // send
  route.endAction((req, res) => {
    res.status(206).send({
      status: true,
      message: "Success",
      posts: route.data.posts,
    });
  });
});

export default router;
