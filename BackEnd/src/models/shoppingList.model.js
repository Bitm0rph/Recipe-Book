import mongoose from 'mongoose';

const shoppingItemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    quantity: {
        type: String,
        default: '',
        trim: true
    },
    checked: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        enum: ['planned', 'custom'],
        required: true
    }
});

const shoppingListSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weekStart: {
        type: String,
        required: true,
        match: /^\d{4}-\d{2}-\d{2}$/
    },
    items: {
        type: [shoppingItemSchema],
        default: []
    }
}, { timestamps: true });

shoppingListSchema.index({ user: 1, weekStart: 1 }, { unique: true });

export default mongoose.model('ShoppingList', shoppingListSchema);
