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
        ORDER BY r.last_time`,
      {
        id: createBinding(id, oracledb.NUMBER),
        phone: createBinding(phone),
      }
    );

    db.close();
    return result;
  }

  static async fetchOne(id, phone, chatId) {
    const db = await DBService.open();

    const rawMessages = await db.executeSelect(
      `SELECT * FROM messages
       WHERE friends_id = 
           (
             SELECT id FROM relationships
             WHERE phone <> :phone AND 
             :user_id IN (user_1_id, user_2_id) AND
             id = :chat_id
           )
       ORDER BY time`,
      {
        user_id: createBinding(id, oracledb.NUMBER),
        phone: createBinding(phone),
        chat_id: createBinding(chatId, oracledb.NUMBER),
      }
    );

    db.close();
    return rawMessages;
  }
}

export default ChatModel;
