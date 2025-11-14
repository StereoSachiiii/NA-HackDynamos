import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import FoodItem from '../models/FoodItem.js';
import GoalProfile from '../models/GoalProfile.js';
import Tip from '../models/Tip.js';
import MealPlanTemplate from '../models/MealPlanTemplate.js';
import logger from '../utils/logger.js';

// --- EXPANDED FOOD DATA (AT LEAST 5 RECORDS) ---
const sampleFoods = [
  {
    name: 'Kiri Bath',
    localName: 'කිරි බත්',
    category: 'Breakfast',
    servingSizeGrams: 200,
    calories: 320,
    protein: 6,
    carbs: 60,
    fat: 6,
    fiber: 1,
    glycemicLoad: 32,
    culturalNotes: 'New year special rice cooked in coconut milk',
    variants: ['With lunu miris', 'With seeni sambol'],
    tags: ['festival', 'high-carb', 'rice']
  },
  {
    name: 'Parippu Curry',
    localName: 'පරිප්පු',
    category: 'Curry',
    servingSizeGrams: 150,
    calories: 180,
    protein: 12,
    carbs: 24,
    fat: 4,
    fiber: 8,
    glycemicLoad: 14,
    culturalNotes: 'Red lentil curry cooked with coconut milk',
    tags: ['protein', 'fiber-rich', 'lentil', 'curry']
  },
  {
    name: 'Plain Hopper',
    localName: 'ආප්ප',
    category: 'Breakfast',
    servingSizeGrams: 50,
    calories: 120,
    protein: 3,
    carbs: 22,
    fat: 2.5,
    fiber: 1,
    glycemicLoad: 18,
    culturalNotes: 'Thin, crispy bowl-shaped pancake, popular dinner or breakfast item.',
    variants: ['Egg hopper', 'Milk hopper'],
    tags: ['light', 'fermented', 'rice-flour']
  },
  {
    name: 'Pol Rotti',
    localName: 'පොල් රොටි',
    category: 'Snack',
    servingSizeGrams: 75,
    calories: 250,
    protein: 5,
    carbs: 35,
    fat: 10,
    fiber: 4,
    glycemicLoad: 25,
    culturalNotes: 'Flatbread made with grated coconut, flour, and a pinch of salt. Often eaten with lunu miris.',
    tags: ['coconut', 'wheat', 'high-fat']
  },
  {
    name: 'Polos Curry',
    localName: 'පොළොස් ඇඹුල',
    category: 'Curry',
    servingSizeGrams: 150,
    calories: 150,
    protein: 4,
    carbs: 28,
    fat: 2,
    fiber: 7,
    glycemicLoad: 10,
    culturalNotes: 'Young jackfruit curry, cooked with spices until dry. Excellent vegetarian meat substitute.',
    tags: ['low-gi', 'fiber-rich', 'vegetarian', 'curry']
  }
];

const sampleGoals = [
  {
    name: 'Diabetes',
    macroSplit: { protein: 25, carbs: 45, fat: 30 },
    calorieBand: { min: 1600, max: 2000 },
    cautionTags: ['high-glycemic'],
    seasonTag: 'year-round',
    uiHints: { palette: 'teal', glyph: 'drop' }
  },
  {
    name: 'Student Focus',
    macroSplit: { protein: 20, carbs: 55, fat: 25 },
    calorieBand: { min: 1800, max: 2300 },
    cautionTags: ['late-night-snacks'],
    seasonTag: 'exam',
    uiHints: { palette: 'purple', glyph: 'book' }
  }
];

const sampleTips = [
  {
    key: 'hydration.default',
    triggerEvent: 'low-hydration',
    messageEN: 'Sip warm water with lime to stay hydrated.',
    messageSI: 'බෙල්ල වතුර කපු කුඩු කුඩු බොන්න.',
    messageTA: 'சூடான நீரில் எலுமிச்சை சேர்த்து பருகுங்கள்.',
    seasonTag: 'year-round'
  },
  {
    key: 'festival.balance',
    triggerEvent: 'festival-week',
    messageEN: 'Balance kavum with a salad or kiri kos mallung.',
    messageSI: 'කවුම් කෑමට සමබරව ඉලාපිහින් සලාද අතුලත් කරන්න.',
    messageTA: 'கவுமுடன் ஒரு சாலட் அல்லது மல்லூங் சேர்க்கவும்.',
    seasonTag: 'avurudu'
  }
];

const samplePlans = [
  {
    name: 'Balanced Avurudu Week',
    description: 'Keep tradition while managing blood sugar during Avurudu.',
    goalType: 'Diabetes',
    calorieTarget: 1900,
    macroSplit: { protein: 25, carbs: 45, fat: 30 },
    metadata: { seasonTag: 'avurudu', sourceType: 'expert' },
    days: [
      {
        day: 'Monday',
        mealType: 'Breakfast',
        foodItems: [],
        localizedMessageKey: 'mealPlan.avurudu.breakfast'
      }
    ],
    tips: ['Swap white kavum with mung kavum for better fiber.']
  }
];

const seed = async () => {
  await connectDB();

  logger.info('Deleting existing data...');
  await FoodItem.deleteMany({});
  await GoalProfile.deleteMany({});
  await Tip.deleteMany({});
  await MealPlanTemplate.deleteMany({});
  logger.info('Existing data deleted.');

  logger.info('Inserting sample data...');
  await FoodItem.insertMany(sampleFoods);
  await GoalProfile.insertMany(sampleGoals);
  await Tip.insertMany(sampleTips);
  await MealPlanTemplate.insertMany(samplePlans);

  logger.info('Seed data inserted successfully!');

  await mongoose.connection.close();
};

seed().catch(error => {
  logger.error('Seeding failed', error);
  process.exit(1);
});