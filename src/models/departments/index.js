import { Schema, model } from "mongoose";
import models from "@/models/names";
import createSchemaRef from "@/utils/createSchemaRef";

const Departments = new Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  title: Object,
  prefixes: [String],
  managers: [createSchemaRef(models.users)],
});

const DepartmentsModel = model(models.departments, Departments);
export default DepartmentsModel;
