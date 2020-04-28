import oracledb from "oracledb";
import { DBService, CryptoService } from "@/services";
import { UserStatsModel } from "@/models";

const { createBinding } = DBService;

class MessageModel {
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
}

export default MessageModel;
