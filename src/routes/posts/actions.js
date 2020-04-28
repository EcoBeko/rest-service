import RouteService from "@/services/route";
import ValidationService from "@/services/validation";
import { needToken } from "@/middleware";
import { UserModel, PostModel } from "@/models";

const router = RouteService.make();

router.post("/write", needToken, async (req, res, next) => {
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
