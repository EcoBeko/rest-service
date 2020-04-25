import oracledb from "oracledb";
import config from "@/config";
import Logger from "@/services/logger";

export async function init() {
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  try {
    const connection = await oracledb.createPool({
      user: config.db_username,
      password: config.db_password,
      connectionString: config.db_connectionString,
      poolAlias: "default",
    });
    return connection;
  } catch (error) {
    Logger.error("Database", error);
    process.exit(1);
  }
}
