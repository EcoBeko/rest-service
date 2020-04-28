import oracledb from "oracledb";
import { DBService } from "@/services";
import WasteModel from "@/models/Wastes";

const { createBinding } = DBService;

class PointModel {
  constructor({
    id,
    title,
    address,
    working_time,
    latitude,
    longitude,
    site,
    type,
    phone,
    additional_info,
  }) {
    this.id = id;
    this.title = title;
    this.address = address;
    this.working_time = working_time;
    this.latitude = latitude;
    this.longitude = longitude;
    this.site = site;
    this.type = type;
    this.phone = phone;
    this.additional_info = additional_info;
    this.accepts = [];
  }

  static create(data) {
    return new PointModel(data);
  }

  static async fetchBy(type, query = []) {
    const db = await DBService.open();

    const list = query.length ? `AND waste_id IN (${query.toString()})` : "";

    const result = await db.executeSelect(
      `SELECT * FROM point_accepting_list
       WHERE type = :type ${list}
       ORDER BY point_id, waste_id`,
      { type: createBinding(type) }
    );

    let prev;
    const points = [];
    for (const raw of result) {
      // if new point
      if (raw.point_id != prev?.id) {
        prev = new PointModel(raw);
        prev.id = raw.point_id;
        points.push(prev);
      }

      const waste = new WasteModel({
        title: raw.waste_title,
        id: raw.waste_id,
        icon: raw.icon,
        type: raw.waste_type,
        price: raw.price,
      });
      prev.accepts.push(waste);
    }

    db.close();
    return points;
  }
}

export default PointModel;
