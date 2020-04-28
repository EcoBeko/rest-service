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

router.post("/:id/comments/fetch", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = route.extract({ title: true, article: true, image: true });

  // validating user input
  route.checkValidation(ValidationService.run("posts", body));

  // fetch user
  await route.action(async () => {
    route.data.user = await UserModel.fetch(req.token.phone);
  });

  // fetch posts
  await route.action(async () => {
    const post = PostModel.create(body);
    post.owner.owner_id = route.data.user.id;
    await post.save();
  });

  route.end("Article Created", 201);
});

export default router;
