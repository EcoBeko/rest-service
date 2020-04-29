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
         SELECT * FROM posts_owner
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

    const posts = [];
    for (const post of result) {
      const temp = new PostModel(post);
      temp.owner.owner_id = post.owner_id;
      temp.owner.name = post.name;
      temp.owner.surname = post.surname;
      temp.owner.avatar = post.avatar;
      posts.push(temp);
    }

    db.close();
    return posts;
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

  async save() {
    const db = await DBService.open();

    const result = await db.executeInsert(
      `insert into posts(title, article, owner_id, likes, image, time)
       values(:title, :article, :owner_id, 0, :image, sysdate)`,
      {
        title: createBinding(this.title),
        article: createBinding(this.article),
        owner_id: createBinding(this.owner.owner_id, oracledb.NUMBER),
        image: createBinding(this.image),
      },
      { autoCommit: true }
    );

    db.close();
    return result;
  }

  async getComments() {
    const db = await DBService.open();

    const result = await db.executeSelect(
      `SELECT * FROM comments_owner
       WHERE post_id = :post_id`,
      { post_id: createBinding(this.id, oracledb.NUMBER) }
    );

    db.close();
    return result;
  }

  async addComment(comment, user_id) {
    const db = await DBService.open();

    const result = await db.executeInsert(
      `insert into post_comments(owner_id, post_id, text, time)
       values(:owner_id, :post_id, :text, sysdate)`,
      {
        owner_id: createBinding(user_id, oracledb.NUMBER),
        post_id: createBinding(this.id, oracledb.NUMBER),
        text: createBinding(comment),
      },
      { autoCommit: true }
    );

    db.close();
    return result;
  }
}

export default PostModel;
