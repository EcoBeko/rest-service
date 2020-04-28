import oracledb from "oracledb";
import { DBService } from "@/services";

const { createBinding } = DBService;

class WasteModel {
  constructor({ id, title, type, icon }) {
    this.id = id;
    this.title = title;
    this.type = type;
    this.icon = icon;
  }

  static create(data) {
    return new WasteModel(data);
  }
}

export default WasteModel;
