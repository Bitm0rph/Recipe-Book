import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ingredientSchema = new Schema({
    name: String,
    quantity: String
}, { _id: false });


const recipeSchema = new Schema({
    title: { type: String, required: true },
    description: String,
    ingredients: [ingredientSchema],
    steps: [String],
    imageUrl: String,
    tags: [String],
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });


export default model('Recipe', recipeSchema);