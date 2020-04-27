import { Router } from "express";
import DBService from "@/services/db";

const router = Router();

router.get("/select-table", async (req, res) => {
  const db = await DBService.open();

  const qr = await db.executeSelect("select * from admin.waste_types");

  res.send({
    result: qr,
  });

  return db.close();
});

export default router;
