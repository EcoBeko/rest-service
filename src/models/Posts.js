import oracledb from "oracledb";
import { DBService } from "@/services";

const { createBinding } = DBService;

class PostModel {
  constructor({ id, title, article, owner_id, likes, image, time }) {
    this.id = id;
    this.title = title;
    this.article = article;
    this.likes = likes;
    this.image = image;
    this.time = time;
    this.owner = {
      owner_id: owner_id,
      name: "",
      surname: "",
      avatar: "",
    };
  }

  static create(data) {
    return new PostModel(data);
  }

  static async fetchPortion(id, offset = 0) {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `with
       postsFromFriendsAndYou AS
       (
         SELECT * FROM posts
         WHERE owner_id IN (
         SELECT DISTINCT 
         CASE 
           WHEN :id = user_1_id THEN user_2_id
           WHEN :id = user_2_id THEN user_1_id
         END user_id
         FROM relationships
         WHERE :id IN (user_1_id, user_2_id)
       ) OR owner_id = :id
       )
       SELECT * FROM postsFromFriendsAndYou
       ORDER BY TIME
       OFFSET ${offset} ROWS 
       FETCH NEXT 3 ROWS ONLY`,
      { id: createBinding(id, oracledb.NUMBER) }
    );

    db.close();
    return result;
  }

  static async fetch(id) {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT * FROM posts_owner
       WHERE id = :id`,
      { id: createBinding(id, oracledb.NUMBER) }
    );

    const rawData = result[0];

    if (!rawData) return false;

    const post = new PostModel(rawData);

    post.owner = {
      name: rawData.name,
      surname: rawData.surname,
      avatar: rawData.avatar,
      owner_id: rawData.owner_id,
    };

    db.close();
    return post;
  }
}

export default PostModel;
