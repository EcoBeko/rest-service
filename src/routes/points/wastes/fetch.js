import RouteService from "@/services/route";
import { WasteModel } from "@/models";

const router = RouteService.make();

router.get("/fetch", async (req, res) => {
  res.send({
    status: true,
    message: "Success",
    wastes: await WasteModel.fetchAll(),
  });
});

export default router;
