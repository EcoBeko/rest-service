import oracledb from "oracledb";
import Logger from "@/services/logger";
const pool = oracledb.getPool("default");

class DBService {
  constructor(connection) {
    this.connection = connection;
  }
  static async open() {
    const db = new DBService(await pool.getConnection());
    return db;
  }

  async executeSelect(query) {
    try {
      const qr = await this.connection.execute(query);

      return qr.rows.map((item) => {
        const temp = {};
        for (const key in item) temp[key.toLowerCase()] = item[key];
        return temp;
      });
    } catch (err) {
      Logger.error("DB Service", err);
      return [];
    }
  }

  close() {
    this.connection.close();
  }
}

export default DBService;
