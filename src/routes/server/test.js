import { Router } from "express";
import pipe from "@/pipe";
import events from "@/pipe/names";

const router = Router();

router.get("/kill", (req, res) => {
  pipe.emit(events.server.close);
  return res.end();
});

export default router;
