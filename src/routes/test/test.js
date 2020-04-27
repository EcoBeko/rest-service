import { Router } from "express";
import Logger from "@/services/logger";
import openConnection from "@/middleware/openConnection";

const router = Router();

router.get("/select-table", openConnection, async (req, res) => {
  try {
    const result = await req.db.execute("select * from admin.waste_types");

    return res.send({
      result,
    });
  } catch (error) {
    Logger.error("test/select-table route", error);
    return res.sendStatus(500);
  } finally {
    req.db.close();
  }
});

export default router;
