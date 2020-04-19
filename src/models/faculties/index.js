import { Schema, model } from "mongoose";
import models from "@/models/names";

const Faculties = new Schema({
  title: Object,
});

const FacultiesModel = model(models.faculties, Faculties);

export default FacultiesModel;
