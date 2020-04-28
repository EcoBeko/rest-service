import RouteService from "@/services/route";
import { needToken } from "@/middleware";
import { UserModel, ChatModel } from "@/models";

const router = RouteService.make();

router.get("/fetch", needToken, async (req, res) => {
  const friendId = +req.params["id"];
  const user = await UserModel.fetch(req.token.phone);

  res.send({
    status: true,
    message: "Success",
    chats: await ChatModel.fetch(user.id, user.phone),
  });
});

export default router;
