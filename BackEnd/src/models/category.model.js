import mongoose from 'mongoose';
const { Schema, model } = mongoose;
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2"

const categorySchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
  });

categorySchema.plugin(mongooseAggregatePaginate)

export default model('Category', categorySchema);
