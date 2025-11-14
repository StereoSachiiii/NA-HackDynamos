import mongoose from 'mongoose';

const goalProfileSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    macroSplit: {
      protein: { type: Number, default: 25 },
      carbs: { type: Number, default: 50 },
      fat: { type: Number, default: 25 }
    },
    calorieBand: {
      min: { type: Number, default: 1600 },
      max: { type: Number, default: 2200 }
    },
    cautionTags: [{ type: String }],
    seasonTag: { type: String },
    uiHints: {
      palette: { type: String, default: 'balanced' },
      glyph: { type: String, default: 'lotus' }
    }
  },
  { timestamps: false }
);

const GoalProfile = mongoose.model('GoalProfile', goalProfileSchema);

export default GoalProfile;