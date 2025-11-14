import FoodItem from '../models/FoodItem.js';

const sumReducer = (acc, value = 0) => acc + value;

const computeFoodTotals = foodItems =>
  foodItems.reduce(
    (acc, entry) => {
      acc.calories += entry.calories;
      acc.protein += entry.protein;
      acc.carbs += entry.carbs;
      acc.fat += entry.fat;
      acc.fiber += entry.fiber;
      acc.glycemicLoad += entry.glycemicLoad;
      return acc;
    },
    {
      calories: 0,
      protein: 0,
      carbs: 0,
      fat: 0,
      fiber: 0,
      glycemicLoad: 0
    }
  );

const hydrateEntries = async foodEntries => {
  const ids = foodEntries.map(entry => entry.foodItem);
  const items = await FoodItem.find({ _id: { $in: ids } });
  const map = Object.fromEntries(items.map(item => [item.id, item]));

  return foodEntries.map(entry => {
    const food = map[entry.foodItem];
    if (!food) return null;

    const quantity = entry.quantity || 1;
    return {
      calories: food.calories * quantity,
      protein: food.protein * quantity,
      carbs: food.carbs * quantity,
      fat: food.fat * quantity,
      fiber: food.fiber * quantity,
      glycemicLoad: food.glycemicLoad * quantity
    };
  });
};

const computeSummary = async mealLog => {
  const hydrated = (await hydrateEntries(mealLog.foodEntries)).filter(Boolean);
  return computeFoodTotals(hydrated);
};

const aggregateDailySummary = mealLogs => {
  const totals = mealLogs.map(log => log.summaryCache || {}).reduce(
    (acc, summary) => ({
      calories: (acc.calories || 0) + (summary.calories || 0),
      protein: (acc.protein || 0) + (summary.protein || 0),
      carbs: (acc.carbs || 0) + (summary.carbs || 0),
      fat: (acc.fat || 0) + (summary.fat || 0),
      fiber: (acc.fiber || 0) + (summary.fiber || 0),
      glycemicLoad:
        (acc.glycemicLoad || 0) + (summary.glycemicLoad || 0)
    }),
    {}
  );

  const totalMacros = [totals.protein, totals.carbs, totals.fat]
    .filter(Boolean)
    .reduce(sumReducer, 0);

  const macroPercentages = totalMacros
    ? {
        protein: Math.round(((totals.protein || 0) / totalMacros) * 100),
        carbs: Math.round(((totals.carbs || 0) / totalMacros) * 100),
        fat: Math.round(((totals.fat || 0) / totalMacros) * 100)
      }
    : {};

  return { totals, macroPercentages };
};

export { computeSummary, aggregateDailySummary };


