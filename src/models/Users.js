import oracledb from "oracledb";
import DBService from "@/services/db";

class UserModel {
  static async exists(phone) {
    const db = await DBService.open();
  }
}

export default UserModel;
