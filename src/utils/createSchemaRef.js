import { Schema } from "mongoose";

export default function createSchemaRef(targetModel) {
  const target = Object.create(null);
  target.type = Schema.Types.ObjectId;
  target.ref = targetModel;
  return target;
}
