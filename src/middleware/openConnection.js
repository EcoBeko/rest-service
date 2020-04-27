import oracledb from "oracledb";
import Logger from "@/services/logger";
const pool = oracledb.getPool("default");

export default async (req, res, next) => {
  try {
    req.db = await pool.getConnection();
    next();
  } catch (err) {
    Logger.error(err);
    return res.sendStatus(500);
  }
};
