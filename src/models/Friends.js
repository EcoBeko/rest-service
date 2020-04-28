import oracledb from "oracledb";
import { DBService } from "@/services";

const { createBinding } = DBService;

class UserStatsModel {
  constructor({ user_1_id, user_2_id, last_time, status }) {
    this.user_1_id = user_1_id;
    this.user_2_id = user_2_id;
    this.last_time = last_time;
    this.status = status;
    this.id = 0;
    this.user_1 = null;
    this.user_2 = null;
  }

  static create(data) {
    return new UserStatsModel(data);
  }
}

export default UserStatsModel;
