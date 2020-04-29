import RouteService from "@/services/route";
import ValidationService from "@/services/validation";
import { needToken } from "@/middleware";
import { UserModel, PostModel } from "@/models";

const router = RouteService.make();

router.get("/:id/comments/fetch", async (req, res) => {
  const post = await PostModel.fetch(req.params["id"] ? +req.params["id"] : 0);

  if (!post)
    return res.status(404).send({ status: false, message: "Post not found" });

  return res.status(200).send({
    status: true,
    message: "Success",
    comment: await post.getComments(),
  });
});

router.post("/:id/comments/write", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = route.extract({ comment: true });
  body.id = req.params["id"] ? +req.params["id"] : 0;

  // fetch user and post
  await route.action(async () => {
    route.data.user = await UserModel.fetch(req.token.phone);
    route.data.post = await PostModel.fetch(body.id);
  });

  // add comment
  await route.action(async () => {
    await route.data.post.addComment(body.comment, route.data.user.id);
  });

  route.end("Comment Added", 201);
});

export default router;
