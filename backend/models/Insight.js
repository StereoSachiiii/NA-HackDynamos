import mongoose from 'mongoose';

const localizedMessageSchema = new mongoose.Schema(
  {
    EN: String,
    SI: String,
    TA: String
  },
  { _id: false }
);

const insightSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    type: {
      type: String,
      enum: ['macro', 'hydration', 'streak', 'festival', 'reminder'],
      required: true
    },
    severity: {
      type: String,
      enum: ['info', 'success', 'warning', 'critical'],
      default: 'info'
    },
    message: {
      type: String,
      required: true
    },
    localizedMessages: localizedMessageSchema,
    metadata: mongoose.Schema.Types.Mixed,
    uiHints: {
      palette: { type: String, default: 'balanced' },
      glyph: { type: String, default: 'lightning' }
    },
    expiresAt: Date,
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

insightSchema.index({ user: 1, createdAt: -1 });

const Insight = mongoose.model('Insight', insightSchema);

export default Insight;

