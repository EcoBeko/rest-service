import RouteService from "@/services/route";
import { needToken } from "@/middleware";
import { UserModel, PostModel } from "@/models";

const router = RouteService.make();

router.get("/fetch-portion/:offset", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = {};

  route.actionSync(() => {
    body.offset = +req.params["offset"];
  });

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

router.get("/fetch-one/:id", async (req, res) => {
  const post = await PostModel.fetch(req.params["id"] ? +req.params["id"] : 0);

  if (!post)
    return res.status(404).send({ status: false, message: "Post not found" });

  return res.status(200).send({
    status: true,
    message: "Success",
    post,
  });
});

export default router;
