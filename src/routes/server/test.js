import { Router } from "express";
import pipe from "@/pipe";
import events from "@/pipe/names";
import oracledb from "oracledb";

const router = Router();

router.get("/kill", (req, res) => {
  pipe.emit(events.server.close);
  return res.end();
});

router.get("/check-connection", async (req, res) => {
  const conn = await oracledb.getConnection("default");

  const result = await conn.execute("select 1 from dual");

  conn.close();

  return res.send(result);
});

export default router;
