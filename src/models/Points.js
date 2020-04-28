import oracledb from "oracledb";
import { DBService } from "@/services";

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
}

export default PointModel;
