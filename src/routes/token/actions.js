import RouteService from "@/services/route";
import TokenService from "@/services/token";

const router = RouteService.make();

router.post("/validate", (req, res, next) => {
  const route = new RouteService(req, res, next);

  const body = route.extract({ token: true });

  route.checkSync(() => !TokenService.validate(body.token), "Bad Token", 406);

  route.end("Token is valid", 200);
});

export default router;
