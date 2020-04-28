import oracledb from "oracledb";
import { DBService } from "@/services";

const { createBinding } = DBService;

class WasteModel {
  constructor({ id, title, type, icon, price }) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.icon = icon;
    this.price = price;
  }

  static create(data) {
    return new WasteModel(data);
  }

  static async fetchAll() {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT * FROM waste_types
       ORDER BY id`
    );

    db.close();
    return result;
  }
}

export default WasteModel;
