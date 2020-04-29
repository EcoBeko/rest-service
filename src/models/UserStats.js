import oracledb from "oracledb";
import { DBService } from "@/services";

const { createBinding } = DBService;

class UserStatsModel {
  constructor({ user_id, trees, energy, waste }) {
    this.user_id = user_id;
    this.trees = trees;
    this.energy = energy;
    this.waste = waste;
    this.id = 0;
  }

  static create(data) {
    return new UserStatsModel({
      user_id: data.user_id,
      trees: 0,
      energy: 0,
      waste: 0,
    });
  }

  async add(trees, energy, waste) {
    if (!this.id) return;

    const db = await DBService.open();
    this.trees += trees;
    this.energy += energy;
    this.waste += waste;

    const result = await db.executeInsert(
      `UPDATE user_stats
       SET trees = :trees, energy = :energy, waste = :waste
       WHERE id = :id`,
      {
        trees: createBinding(this.trees, oracledb.NUMBER),
        energy: createBinding(this.energy, oracledb.NUMBER),
        waste: createBinding(this.waste, oracledb.NUMBER),
        id: createBinding(this.id, oracledb.NUMBER),
      },
      { autoCommit: true }
    );

    db.close();
    return result;
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
