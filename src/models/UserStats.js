import oracledb from "oracledb";
import { DBService } from "@/services";

const { createBinding } = DBService;

class UserStatsModel {
  constructor({ user_id }) {
    this.user_id = user_id;
    this.trees = this.energy = this.waste = 0.0;
  }

  static create(data) {
    return new UserStatsModel(data);
  }

  async save() {
    const db = await DBService.open();

    const result = await db.executeInsert(
      `insert into user_stats(user_id, trees, energy, waste) 
       values(:user_id, :trees, :energy, :waste)`,
      {
        user_id: createBinding(this.user_id, oracledb.NUMBER),
        trees: createBinding(this.trees, oracledb.NUMBER),
        energy: createBinding(this.energy, oracledb.NUMBER),
        waste: createBinding(this.waste, oracledb.NUMBER),
      },
      { autoCommit: true }
    );

    db.close();
    return result;
  }
}

export default UserStatsModel;
