import mongoose from 'mongoose';

const foodEntrySchema = new mongoose.Schema(
  {
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true
    },
    quantity: {
      type: Number,
      default: 1
    },
    servingType: {
      type: String,
      default: 'standard'
    },
    notes: String
  },
  { _id: false }
);

const summarySchema = new mongoose.Schema(
  {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number,
    glycemicLoad: Number
  },
  { _id: false }
);

const mealLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    date: {
      type: Date,
      default: Date.now
    },
    mealType: {
type: String,
enum: [
           'Breakfast', 
           'Lunch', 
           'Dinner', 
           'Snack', 
           'Supper', 
           'Pre-Workout', 
           'Post-Workout', 
           'Brunch',      // New
           'Elevenses',  // New
           'Tea',         // New
           'Late-Night Snack', // New
           'Other'
        ], // <- EXPANDED ENUM
required: true
 },
    foodEntries: {
      type: [foodEntrySchema],
      default: []
    },
    notes: String,
    summaryCache: summarySchema,
    photoEntries: [
      {
        photoUrl: String,
        status: {
          type: String,
          enum: ['pending', 'processed', 'failed'],
          default: 'pending'
        },
        detectedItems: [String]
      }
    ]
  },
  { timestamps: true }
);

mealLogSchema.index({ user: 1, date: -1 });

const MealLog = mongoose.model('MealLog', mealLogSchema);

export default MealLog;