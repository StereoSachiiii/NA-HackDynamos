import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    defaultMessage: {
      type: String,
      required: true,
    },
    localizedMessages: [
      {
        language: { type: String, required: true },
        message: { type: String, required: true },
      },
    ],
    triggerEvent: {
      type: String,
      // Examples: 'createGoal', 'highGlycemicMeal', 'fasting'
    },
    seasonTag: {
      type: String,
      // Matches GoalProfile seasonTag (e.g., 'summer', 'bulk')
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    uiHints: {
      icon: { type: String, default: 'star' },
      color: { type: String, default: 'blue' },
      emphasis: { type: String, enum: ['low', 'medium', 'high'], default: 'low' },
    },
  },
  { timestamps: true }
);

tipSchema.index({ triggerEvent: 1, seasonTag: 1, isActive: 1 });

const Tip = mongoose.model('Tip', tipSchema);

export default Tip;