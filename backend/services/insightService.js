import Insight from '../models/Insight.js';
import { pickLocalizedMessage } from './localizationService.js';

const MACRO_THRESHOLDS = {
  protein: 15,
  carbs: 60,
  fat: 30
};

const deriveMacroPercentages = summary => {
  if (summary?.macroPercentages) return summary.macroPercentages;

  const totals = summary || {};
  const macroTotal =
    (totals.protein || 0) + (totals.carbs || 0) + (totals.fat || 0);

  if (!macroTotal) return null;

  return {
    protein: Math.round(((totals.protein || 0) / macroTotal) * 100),
    carbs: Math.round(((totals.carbs || 0) / macroTotal) * 100),
    fat: Math.round(((totals.fat || 0) / macroTotal) * 100)
  };
};

const createMacroInsight = async ({ userId, summary }) => {
  const macroPercentages = deriveMacroPercentages(summary);
  if (!macroPercentages) return null;

  let message = null;
  let severity = 'info';

  if ((macroPercentages.carbs || 0) > MACRO_THRESHOLDS.carbs) {
    severity = 'warning';
    message = 'Carbohydrate intake trending high—try adding dhal or polos.';
  } else if ((macroPercentages.protein || 0) < MACRO_THRESHOLDS.protein) {
    severity = 'warning';
    message =
      'Protein looks low. Consider adding an egg curry or chickpeas to meals.';
  }

  if (!message) return null;

  return Insight.create({
    user: userId,
    type: 'macro',
    severity,
    message,
    localizedMessages: {
      EN: message,
      SI: message,
      TA: message
    },
    metadata: summary,
    uiHints: {
      palette: severity === 'warning' ? 'sunset' : 'balanced',
      glyph: 'macro',
      messageKey: 'insight.macro'
    }
  });
};

const getInsightsForUser = async ({ userId, language = 'EN' }) => {
  const insights = await Insight.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(20);

  return insights.map(insight => ({
    id: insight.id,
    type: insight.type,
    severity: insight.severity,
    message: pickLocalizedMessage(
      {
        messageEN: insight.localizedMessages?.EN || insight.message,
        messageSI: insight.localizedMessages?.SI,
        messageTA: insight.localizedMessages?.TA
      },
      language
    ),
    metadata: insight.metadata,
    uiHints: insight.uiHints,
    createdAt: insight.createdAt
  }));
};

export { createMacroInsight, getInsightsForUser };

