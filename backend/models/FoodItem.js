import mongoose from 'mongoose';

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    localName: {
      type: String,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    servingSizeGrams: {
      type: Number,
      default: 100,
      min: 0
    },
    calories: {
      type: Number,
      required: true,
      min: 0
    },
    protein: {
      type: Number,
      default: 0,
      min: 0
    },
    carbs: {
      type: Number,
      default: 0,
      min: 0
    },
    fat: {
      type: Number,
      default: 0,
      min: 0
    },
    fiber: {
      type: Number,
      default: 0,
      min: 0
    },
    glycemicLoad: {
      type: Number,
      required: true,
      min: 0
    },
    culturalNotes: String,
    variants: [
      {
        type: String,
        trim: true
      }
    ],
    tags: [
      {
        type: String,
        trim: true
      }
    ],
    uiHints: {
      palette: { type: String, default: 'sunrise' },
      icon: { type: String }
    }
  },
  {
    timestamps: true
  }
);

// Create text index for searching across primary fields
foodItemSchema.index({ name: 'text', localName: 'text', category: 'text' });

const FoodItem = mongoose.model('FoodItem', foodItemSchema);

export default FoodItem;