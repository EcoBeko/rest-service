import RouteService from "@/services/route";
import UserModel from "@/models/Users";
import { needToken } from "@/middleware";

const router = RouteService.make();

router.put("/update", needToken, async (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = route.extract({ phone: true, action: true });

  // fetch user and his friends
  await route.action(async () => {
    route.data.user = await UserModel.fetch(req.token.phone);
    route.data.friends = await route.data.user.getFriends();
  });

  // 404 - not phone number on the friends list
  route.checkSync(
    () => {
      const qr = route.data.friends.filter((friend) => friend.phone === body.phone);

      route.data.id = qr[0]?.id;
      return qr.length == 0;
    },
    "User not found",
    404
  );

  // update relationship status
  await route.action(async () => {
    await route.data.user.updateRelationship(route.data.id, body.action);
  });

  route.end("Updated", 200);
});

export default router;
