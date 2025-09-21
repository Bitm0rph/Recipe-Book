import mongoose from 'mongoose';
const { Schema, model } = mongoose;


const ingredientSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: String,
        required: true
    }
}, { _id: false });


const recipeSchema = new Schema({
    imageUrl: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    views: {
        type: Number,
        default: 0
    },
    isPublished: {
        type: Boolean,
        default: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    likes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    ingredients: {
        type: [ingredientSchema],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length > 0;  // must contain at least 1 ingredient
            },
            message: "A recipe must have at least one ingredient.",
        },
    },
    steps: {
        type: [String],
        required: true,
        validate: {
            validator: function (arr) {
                return arr.length > 0;  // must contain at least 1 step
            },
            message: "A recipe must have at least one step.",
        },
    },
    tags: [String],
}, { timestamps: true });


export default model('Recipe', recipeSchema);