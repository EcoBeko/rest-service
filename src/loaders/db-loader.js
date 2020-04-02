import mongoose from "mongoose";
import config from "@/config";
import pipe from "@/pipe";

export async function init() {
  mongoose.connection.on("open", () => pipe.emit("mongo::connected"));

  await mongoose.connect(config.mongodb.uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
}
