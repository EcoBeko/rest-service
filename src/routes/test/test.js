import { Router } from "express";
import { DBService, ImageService } from "@/services";
import oracledb from "oracledb";

const router = Router();

router.get("/select-table", async (req, res) => {
  const db = await DBService.open();

  const qr = await db.executeSelect("select * from admin.waste_types");

  res.send({
    result: qr,
  });

  return db.close();
});

router.post("/insert-table", async (req, res) => {
  const db = await DBService.open();

  const { title, mark, icon, types } = req.body;

  const query = `insert into waste_types(title, mark, icon, types) 
     values(:title, :mark, :icon, :types)`;

  const qr = await db.executeInsert(
    query,
    {
      title: {
        val: title,
        dir: oracledb.BIND_IN,
        type: oracledb.STRING,
      },
      mark: {
        val: mark,
        dir: oracledb.BIND_IN,
        type: oracledb.STRING,
      },
      icon: {
        val: icon,
        dir: oracledb.BIND_IN,
        type: oracledb.STRING,
      },
      types: {
        val: types,
        dir: oracledb.BIND_IN,
        type: oracledb.STRING,
      },
    },
    { autoCommit: true }
  );

  res.send({
    result: qr,
  });

  return db.close();
});

router.post("/upload", async (req, res) => {
  await ImageService.add(req.files.test);
  res.sendStatus(200);
});

export default router;
