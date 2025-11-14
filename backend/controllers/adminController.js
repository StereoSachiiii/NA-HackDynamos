import asyncHandler from '../utils/asyncHandler.js';
import FoodItem from '../models/FoodItem.js';
import GoalProfile from '../models/GoalProfile.js';
import Tip from '../models/Tip.js';
import createHttpError from '../utils/createHttpError.js';

const listCollections = asyncHandler(async (_req, res) => {
  const [foods, goals, tips] = await Promise.all([
    FoodItem.countDocuments(),
    GoalProfile.countDocuments(),
    Tip.countDocuments()
  ]);

  res.json({
    success: true,
    data: { foods, goals, tips }
  });
});

const upsertFactory = Model =>
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const data = req.body;

    const doc = id
      ? await Model.findByIdAndUpdate(id, data, { new: true })
      : await Model.create(data);

    res.json({
      success: true,
      data: doc
    });
  });

const upsertFoodItem = upsertFactory(FoodItem);
const upsertGoalProfile = upsertFactory(GoalProfile);
const upsertTip = upsertFactory(Tip);

const removeDocument = (Model, label) =>
  asyncHandler(async (req, res) => {
    const deleted = await Model.findByIdAndDelete(req.params.id);
    if (!deleted) {
      throw createHttpError(404, `${label} not found`);
    }
    res.json({ success: true });
  });

export {
  listCollections,
  upsertFoodItem,
  upsertGoalProfile,
  upsertTip,
  removeDocument
};

