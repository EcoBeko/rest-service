import oracledb from "oracledb";
import Logger from "@/services/logger";
const pool = oracledb.getPool("default");

class DBService {
  constructor(connection) {
    this.connection = connection;
  }
  static async open() {
    try {
      const db = new DBService(await pool.getConnection());
      return db;
    } catch (err) {
      Logger.error("DB Service", err);
    }
  }

  async executeSelect(query, bind = {}, options = {}) {
    try {
      const qr = await this.connection.execute(query, bind, options);

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

  async executeInsert(query, bind = {}, options = {}) {
    try {
      const qr = await this.connection.execute(query, bind, options);
      return qr;
    } catch (err) {
      Logger.error("DB Service", err);
      return {
        err: "Insert error",
      };
    }
  }

  async executeUpdate(query, bind = {}, options = {}) {
    try {
      const qr = await this.connection.execute(query, bind, options);
      return qr;
    } catch (err) {
      Logger.error("DB Service", err);
      return {
        err: "Update error",
      };
    }
  }

  close() {
    this.connection.close();
  }

  static createBinding(val, type = oracledb.STRING, dir = oracledb.BIND_IN) {
    return {
      val,
      type,
      dir,
    };
  }
}

export default DBService;
