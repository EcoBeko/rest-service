import RouteService from "@/services/route";
import { needToken } from "@/middleware";
import { UserModel, ChatModel } from "@/models";

const router = RouteService.make();

router.get("/fetch", needToken, async (req, res) => {
  const user = await UserModel.fetch(req.token.phone);

  res.send({
    status: true,
    message: "Success",
    chats: await ChatModel.fetch(user.id, user.phone),
  });
});

router.get("/:id/fetch", needToken, async (req, res) => {
  const chatId = +req.params["id"];
  const user = await UserModel.fetch(req.token.phone);

  res.send({
    status: true,
    message: "Success",
    messages: await ChatModel.fetchOne(user.id, user.phone, chatId),
  });
});

export default router;
