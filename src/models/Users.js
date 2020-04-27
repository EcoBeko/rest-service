import oracledb from "oracledb";
import { ValidationService, DBService, CryptoService } from "@/services";

const { createBinding } = DBService;
const defaultAvatar = "user-[7753ba0867cf47b9e9525cc557641a99].svg";

class UserModel {
  constructor(name, surname, password, gender, phone, birthday, role) {
    this.name = name;
    this.surname = surname;
    this.password = CryptoService.hashPassword(password);
    this.gender = gender;
    this.phone = phone;
    this.birthday = birthday;
    this.role = role;
  }

  static async exists(phone) {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT phone FROM users
       WHERE phone = :target`,
      {
        target: {
          val: phone,
          type: oracledb.STRING,
          dir: oracledb.BIND_IN,
        },
      }
    );
    db.close();

    return result.length;
  }

  static async create({ name, surname, password, gender, phone, birthday, role }) {
    if (
      !ValidationService.users_name(name) ||
      !ValidationService.users_surname(surname) ||
      !ValidationService.users_password(password) ||
      !ValidationService.users_gender(gender) ||
      !ValidationService.users_phone(phone) ||
      !ValidationService.users_birthday(birthday) ||
      !ValidationService.users_role(role)
    ) {
      return false;
    }

    const user = new UserModel(
      name,
      surname,
      password,
      gender,
      phone,
      birthday,
      role
    );
    return user;
  }

  async save() {
    const db = await DBService.open();

    db.executeInsert(
      `insert into users(name, surname, role, password, gender, phone, avatar, birthday) 
       values(:name, :surname, :role, :password, :gender, :phone, :avatar, :birthday);`,
      {
        name: createBinding(this.name),
        surname: createBinding(this.surname),
        role: createBinding(this.role),
        password: createBinding(this.password),
        gender: createBinding(this.gender, oracledb.NUMBER),
        phone: createBinding(this.phone),
        avatar: createBinding(defaultAvatar),
        birthday: createBinding(this.birthday, oracledb.DB_TYPE_DATE),
      },
      {
        autoCommit: true,
      }
    );

    db.close();
  }
}

export default UserModel;
