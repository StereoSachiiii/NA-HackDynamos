import mongoose from 'mongoose';

const macroSplitSchema = new mongoose.Schema(
  {
    protein: { type: Number, default: 25 },
    carbs: { type: Number, default: 50 },
    fat: { type: Number, default: 25 }
  },
  { _id: false }
);

const uiHintsSchema = new mongoose.Schema(
  {
    palette: String,
    glyph: String,
    messageKey: String,
    emphasis: { type: String, default: 'default' }
  },
  { _id: false }
);

const nutritionGoalSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    goalType: {
      type: String,
      required: true,
      trim: true
    },
    targetCalories: {
      type: Number,
      required: true
    },
    targetMacroSplit: {
      type: macroSplitSchema,
      required: true
    },
    isActive: {
      type: Boolean,
      default: true
    },
    uiHints: uiHintsSchema
  },
  { timestamps: true }
);

nutritionGoalSchema.index({ user: 1, isActive: -1 });

const NutritionGoal = mongoose.model('NutritionGoal', nutritionGoalSchema);

export default NutritionGoal;