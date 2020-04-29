import oracledb from "oracledb";
import { DBService, CryptoService } from "@/services";
import { UserStatsModel } from "@/models";

const { createBinding } = DBService;
const defaultAvatar = "user-[7753ba0867cf47b9e9525cc557641a99].svg";

class UserModel {
  constructor({ name, surname, password, gender, phone, birthday, role, avatar }) {
    this.name = name;
    this.surname = surname;
    this.password = CryptoService.hashPassword(password);
    this.gender = gender;
    this.phone = phone;
    this.birthday = new Date(Date.parse(birthday));
    this.avatar = avatar;
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
    return new UserModel(data);
  }

  static async fetch(phone, password = "") {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT * FROM user_with_stats 
       WHERE phone = :phone`,
      { phone: createBinding(phone) }
    );

    const userData = result[0];
    if (!userData) return false;

    if (password && !CryptoService.validatePasswords(password, userData.password))
      return false;

    const user = new UserModel(userData);
    user.id = userData.user_id;
    user.saved = true;
    user.stats = new UserStatsModel(userData);
    user.stats.id = userData.id;

    db.close();
    return user;
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

  static async updatePhoto(phone, fileName) {
    const db = await DBService.open();

    const result = await db.executeUpdate(
      `UPDATE users
       SET avatar = :avatar
       WHERE phone = :phone`,
      {
        avatar: createBinding(fileName),
        phone: createBinding(phone),
      },
      { autoCommit: true }
    );

    db.close();
    return result;
  }

  static async updateInfo(phone, { name, surname, gender, birthday }) {
    const db = await DBService.open();

    const result = await db.executeUpdate(
      `UPDATE users
       SET name = :name, surname = :surname, gender = :gender, birthday = :birthday
       WHERE phone = :phone`,
      {
        name: createBinding(name),
        surname: createBinding(surname),
        gender: createBinding(gender, oracledb.NUMBER),
        birthday: createBinding(new Date(Date.parse(birthday)), oracledb.DATE),
        phone: createBinding(phone),
      },
      { autoCommit: true }
    );

    db.close();
    return result;
  }

  static async updateCredentials(phone, password) {
    const db = await DBService.open();

    const result = await db.executeUpdate(
      `UPDATE users
       SET password = :password
       WHERE phone = :phone`,
      {
        phone: createBinding(phone),
        password: createBinding(CryptoService.hashPassword(password)),
      },
      { autoCommit: true }
    );

    db.close();
    return result;
  }

  validatePassword(password) {
    return CryptoService.validatePasswords(password, this.password);
  }

  async getRandom() {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `WITH 
       randomUsers AS 
       (SELECT id, name, surname, avatar, phone FROM users ORDER BY DBMS_RANDOM.RANDOM),
       withoutStatus1 AS
       (SELECT * FROM randomUsers u
         WHERE u.id NOT IN (
         SELECT user_1_id FROM relationships
         WHERE user_2_id = :id
       )
       ),
       withoutStatus2 AS
       (SELECT * FROM withoutStatus1 u
         WHERE u.id NOT IN (
         SELECT user_2_id FROM relationships
         WHERE user_1_id = :id
       )
       )
       SELECT name, surname, avatar, phone FROM withoutStatus2
       WHERE id <> :id
       FETCH NEXT 4 ROWS ONLY`,
      { id: createBinding(this.id, oracledb.NUMBER) }
    );

    db.close();
    return result;
  }

  async getFriends() {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT * FROM relationships
       WHERE phone <> :phone AND :id IN (user_1_id, user_2_id)`,
      {
        id: createBinding(this.id, oracledb.NUMBER),
        phone: createBinding(this.phone),
      }
    );

    db.close();
    return result.map((item) => {
      delete item["password"];
      return item;
    });
  }

  async updateRelationship(id, action) {
    const db = await DBService.open();

    const result = await db.executeUpdate(
      `UPDATE friends
       SET status = :status
       WHERE id = :id`,
      {
        id: createBinding(id, oracledb.NUMBER),
        status: createBinding(action),
      },
      { autoCommit: true }
    );

    db.close();
  }
}

export default UserModel;
