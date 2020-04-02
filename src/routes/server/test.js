import { Router } from "express";
import pipe from "@/pipe";

const router = Router();

router.get("/kill", (req, res) => {
  pipe.emit("server::close");
  return res.end();
});

export default router;
