import oracledb from "oracledb";
import { ValidationService, DBService, CryptoService } from "@/services";
import { UserStatsModel } from "@/models";

const { createBinding } = DBService;
const defaultAvatar = "user-[7753ba0867cf47b9e9525cc557641a99].svg";

class UserModel {
  constructor({ name, surname, password, gender, phone, birthday, role }) {
    this.name = name;
    this.surname = surname;
    this.password = CryptoService.hashPassword(password);
    this.gender = gender;
    this.phone = phone;
    this.birthday = new Date(Date.parse(birthday));
    this.role = role;
    this.id = 0;
    this.saved = false;
    this.stats = null;
  }

  static async exists(phone) {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT phone FROM users
       WHERE phone = :target`,
      {
        target: createBinding(phone),
      }
    );
    db.close();

    return result.length !== 0;
  }

  static create(data) {
    const result = ValidationService.run("users", data);

    if (!result.status) return result;

    return new UserModel(data);
  }

  async getId() {
    if (this.id) return this.id;

    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT id FROM users WHERE phone = :phone`,
      { phone: createBinding(this.phone) }
    );

    this.id = result[0].id;

    db.close();
    return this.id;
  }

  async save() {
    if (this.saved) return;

    const db = await DBService.open();

    const result = await db.executeInsert(
      `insert into users(name, surname, role, password, gender, phone, avatar, birthday) 
       values(:name, :surname, :role, :password, :gender, :phone, :avatar, :birthday)`,
      {
        name: createBinding(this.name),
        surname: createBinding(this.surname),
        role: createBinding(this.role),
        password: createBinding(this.password),
        gender: createBinding(this.gender, oracledb.NUMBER),
        phone: createBinding(this.phone),
        avatar: createBinding(defaultAvatar),
        birthday: createBinding(this.birthday, oracledb.DATE),
      },
      { autoCommit: true }
    );

    const userId = await this.getId();

    const stats = UserStatsModel.create({ user_id: userId });
    await stats.save();

    this.stats = stats;

    this.saved = true;

    db.close();
    return result;
  }
}

export default UserModel;
