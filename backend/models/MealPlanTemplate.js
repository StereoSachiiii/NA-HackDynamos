import mongoose from 'mongoose';

const mealEntrySchema = new mongoose.Schema(
  {
    day: {
      type: String,
      required: true
    },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      required: true
    },
    foodItems: [
      {
        foodItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'FoodItem'
        },
        notes: String,
        substituteOptions: [String]
      }
    ],
    localizedMessageKey: String
  },
  { _id: false }
);

const metadataSchema = new mongoose.Schema(
  {
    seasonTag: String,
    sourceType: {
      type: String,
      enum: ['expert', 'community', 'festival'],
      default: 'expert'
    },
    languageOverrides: {
      EN: String,
      SI: String,
      TA: String
    }
  },
  { _id: false }
);

const mealPlanTemplateSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    goalType: { type: String, required: true, trim: true }, // Added trim
    calorieTarget: Number,
    macroSplit: {
      protein: Number,
      carbs: Number,
      fat: Number
    },
    metadata: metadataSchema,
    days: {
      type: [mealEntrySchema],
      default: []
    },
    tips: [String],
    uiHints: {
      palette: { type: String, default: 'sunrise' },
      glyph: { type: String, default: 'bowl' }
    },
    isPublished: {
      type: Boolean,
      default: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { timestamps: true }
);

/**
 * 🔒 Security Enhancement: Pre-save hook
 * Ensures custom plans created by users (community plans)
 * are always marked as 'community' source type and not published by default.
 */
mealPlanTemplateSchema.pre('save', function (next) {
  // Check if it's a new document and has a creator assigned
  if (this.isNew && this.createdBy) {
    // Initialize metadata if it doesn't exist
    if (!this.metadata) {
      this.metadata = {};
    }
    // Enforce sourceType and isPublished status for custom plans
    if (this.metadata.sourceType !== 'community') {
      this.metadata.sourceType = 'community';
    }
    if (this.isPublished !== false) {
      this.isPublished = false;
    }
  }
  next();
});

const MealPlanTemplate = mongoose.model(
  'MealPlanTemplate',
  mealPlanTemplateSchema
);

export default MealPlanTemplate;