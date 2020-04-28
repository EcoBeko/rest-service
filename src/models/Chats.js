import oracledb from "oracledb";
import { DBService } from "@/services";

const { createBinding } = DBService;

class ChatModel {
  constructor({ id, friends_id, time }) {
    this.id = id;
    this.friend = {
      id: friends_id,
      name: "",
      surname: "",
      avatar: "",
    };
    this.time = time;
  }

  static async fetch(id, phone) {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT 
          r.id, r.last_time, r.name, r.surname, r.avatar, 
            (
              SELECT message FROM messages 
              WHERE friends_id = r.id
              ORDER BY time DESC
              FETCH NEXT 1 ROWS ONLY
            ) as message 
        FROM relationships r
        WHERE r.phone <> :phone AND :id IN (r.user_1_id, r.user_2_id)
        ORDER BY r.last_time DESC`,
      {
        id: createBinding(id, oracledb.NUMBER),
        phone: createBinding(phone),
      }
    );

    db.close();
    return result;
  }
}

export default ChatModel;
