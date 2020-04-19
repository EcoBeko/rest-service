import mongoose from "mongoose";
import config from "@/config";
import pipe from "@/pipe";
import events from "@/pipe/names";

export async function init() {
  mongoose.connection.on("open", () => pipe.emit(events.mongo.connected));

  return await mongoose.connect(config.mongodbUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
}
