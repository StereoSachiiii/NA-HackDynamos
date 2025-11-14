import 'dotenv/config';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import FoodItem from '../models/FoodItem.js';
import GoalProfile from '../models/GoalProfile.js';
import Tip from '../models/Tip.js';
import MealPlanTemplate from '../models/MealPlanTemplate.js';
import MealLog from '../models/MealLog.js';
import Insight from '../models/Insight.js';
import NutritionGoal from '../models/NutritionGoal.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';

// --- FOOD ITEMS (6 records) ---
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
    tags: ['festival', 'high-carb', 'rice'],
    uiHints: { palette: 'sunrise', icon: 'rice' }
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
    tags: ['protein', 'fiber-rich', 'lentil', 'curry'],
    uiHints: { palette: 'sunset', icon: 'curry' }
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
    tags: ['light', 'fermented', 'rice-flour'],
    uiHints: { palette: 'dawn', icon: 'pancake' }
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
    tags: ['coconut', 'wheat', 'high-fat'],
    uiHints: { palette: 'earth', icon: 'bread' }
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
    tags: ['low-gi', 'fiber-rich', 'vegetarian', 'curry'],
    uiHints: { palette: 'forest', icon: 'jackfruit' }
  },
  {
    name: 'String Hoppers',
    localName: 'ඉඳි ආප්ප',
    category: 'Breakfast',
    servingSizeGrams: 100,
    calories: 180,
    protein: 4,
    carbs: 38,
    fat: 1,
    fiber: 2,
    glycemicLoad: 22,
    culturalNotes: 'Steamed rice noodle cakes, typically served with curry and coconut sambol.',
    variants: ['With curry', 'With coconut sambol'],
    tags: ['light', 'steamed', 'rice-noodle'],
    uiHints: { palette: 'mist', icon: 'noodles' }
  }
];

// --- GOAL PROFILES (6 records) ---
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
  },
  {
    name: 'Weight Loss',
    macroSplit: { protein: 30, carbs: 40, fat: 30 },
    calorieBand: { min: 1400, max: 1800 },
    cautionTags: ['high-calorie'],
    seasonTag: 'year-round',
    uiHints: { palette: 'green', glyph: 'leaf' }
  },
  {
    name: 'Muscle Gain',
    macroSplit: { protein: 35, carbs: 45, fat: 20 },
    calorieBand: { min: 2200, max: 2800 },
    cautionTags: ['insufficient-protein'],
    seasonTag: 'year-round',
    uiHints: { palette: 'orange', glyph: 'strength' }
  },
  {
    name: 'Heart Health',
    macroSplit: { protein: 25, carbs: 50, fat: 25 },
    calorieBand: { min: 1700, max: 2100 },
    cautionTags: ['high-saturated-fat'],
    seasonTag: 'year-round',
    uiHints: { palette: 'red', glyph: 'heart' }
  },
  {
    name: 'Athletic Performance',
    macroSplit: { protein: 30, carbs: 50, fat: 20 },
    calorieBand: { min: 2500, max: 3200 },
    cautionTags: ['pre-workout', 'post-workout'],
    seasonTag: 'training',
    uiHints: { palette: 'blue', glyph: 'runner' }
  }
];

// --- TIPS (6 records) ---
const sampleTips = [
  {
    key: 'hydration.default',
    defaultMessage: 'Sip warm water with lime to stay hydrated.',
    localizedMessages: [
      { language: 'EN', message: 'Sip warm water with lime to stay hydrated.' },
      { language: 'SI', message: 'බෙල්ල වතුර කපු කුඩු කුඩු බොන්න.' },
      { language: 'TA', message: 'சூடான நீரில் எலுமிச்சை சேர்த்து பருகுங்கள்.' }
    ],
    triggerEvent: 'low-hydration',
    seasonTag: 'year-round',
    isActive: true,
    uiHints: { icon: 'water', color: 'blue', emphasis: 'medium' }
  },
  {
    key: 'festival.balance',
    defaultMessage: 'Balance kavum with a salad or kiri kos mallung.',
    localizedMessages: [
      { language: 'EN', message: 'Balance kavum with a salad or kiri kos mallung.' },
      { language: 'SI', message: 'කවුම් කෑමට සමබරව ඉලාපිහින් සලාද අතුලත් කරන්න.' },
      { language: 'TA', message: 'கவுமுடன் ஒரு சாலட் அல்லது மல்லூங் சேர்க்கவும்.' }
    ],
    triggerEvent: 'festival-week',
    seasonTag: 'avurudu',
    isActive: true,
    uiHints: { icon: 'balance', color: 'green', emphasis: 'high' }
  },
  {
    key: 'protein.timing',
    defaultMessage: 'Include protein in every meal to maintain steady energy levels.',
    localizedMessages: [
      { language: 'EN', message: 'Include protein in every meal to maintain steady energy levels.' },
      { language: 'SI', message: 'ස්ථාවර ශක්ති මට්ටම් පවත්වා ගැනීමට සෑම ආහාරයකම ප්රෝටීන් ඇතුළත් කරන්න.' },
      { language: 'TA', message: 'நிலையான ஆற்றல் மட்டங்களை பராமரிக்க ஒவ்வொரு உணவிலும் புரதத்தை சேர்க்கவும்.' }
    ],
    triggerEvent: 'createGoal',
    seasonTag: 'year-round',
    isActive: true,
    uiHints: { icon: 'protein', color: 'orange', emphasis: 'medium' }
  },
  {
    key: 'fiber.importance',
    defaultMessage: 'High-fiber foods help manage blood sugar and keep you full longer.',
    localizedMessages: [
      { language: 'EN', message: 'High-fiber foods help manage blood sugar and keep you full longer.' },
      { language: 'SI', message: 'ඉහළ තන්තු සහිත ආහාර රුධිර සීනි කළමනාකරණයට උපකාරී වන අතර ඔබව දිගු කාලයක් පුරවයි.' },
      { language: 'TA', message: 'அதிக நார்ச்சத்து உணவுகள் இரத்த சர்க்கரையை நிர்வகிக்க உதவுகின்றன மற்றும் நீங்கள் நீண்ட நேரம் நிறைவாக இருக்க உதவுகின்றன.' }
    ],
    triggerEvent: 'highGlycemicMeal',
    seasonTag: 'year-round',
    isActive: true,
    uiHints: { icon: 'fiber', color: 'green', emphasis: 'high' }
  },
  {
    key: 'breakfast.essential',
    defaultMessage: 'Never skip breakfast - it kickstarts your metabolism for the day.',
    localizedMessages: [
      { language: 'EN', message: 'Never skip breakfast - it kickstarts your metabolism for the day.' },
      { language: 'SI', message: 'උදෑසන ආහාරය කිසි විටෙකත් මඟ හරින්න එපා - එය ඔබේ දිනය සඳහා චයනය ආරම්භ කරයි.' },
      { language: 'TA', message: 'காலை உணவை ஒருபோதும் தவிர்க்காதீர்கள் - அது உங்கள் வளர்சிதை மாற்றத்தை நாள் முழுவதும் தொடங்குகிறது.' }
    ],
    triggerEvent: 'fasting',
    seasonTag: 'year-round',
    isActive: true,
    uiHints: { icon: 'sunrise', color: 'yellow', emphasis: 'high' }
  },
  {
    key: 'portion.control',
    defaultMessage: 'Use smaller plates to naturally control portion sizes without feeling deprived.',
    localizedMessages: [
      { language: 'EN', message: 'Use smaller plates to naturally control portion sizes without feeling deprived.' },
      { language: 'SI', message: 'අඩුවෙන් හැඟීමකින් තොරව ස්වභාවිකව ප්රමාණයන් පාලනය කිරීමට කුඩා තහඩු භාවිතා කරන්න.' },
      { language: 'TA', message: 'குறைவாக உணர்வு இல்லாமல் இயற்கையாக பகுதி அளவுகளை கட்டுப்படுத்த சிறிய தட்டுகளை பயன்படுத்தவும்.' }
    ],
    triggerEvent: 'createGoal',
    seasonTag: 'year-round',
    isActive: true,
    uiHints: { icon: 'plate', color: 'purple', emphasis: 'low' }
  }
];

// --- MEAL PLAN TEMPLATES (6 records) ---
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
    tips: ['Swap white kavum with mung kavum for better fiber.'],
    uiHints: { palette: 'sunrise', glyph: 'bowl' },
    isPublished: true
  },
  {
    name: 'Student Exam Week Plan',
    description: 'Nutritious meals to fuel your brain during exams.',
    goalType: 'Student Focus',
    calorieTarget: 2100,
    macroSplit: { protein: 20, carbs: 55, fat: 25 },
    metadata: { seasonTag: 'exam', sourceType: 'expert' },
    days: [
      {
        day: 'Monday',
        mealType: 'Breakfast',
        foodItems: [],
        localizedMessageKey: 'mealPlan.exam.breakfast'
      }
    ],
    tips: ['Include omega-3 rich foods for brain health.', 'Stay hydrated with water and herbal teas.'],
    uiHints: { palette: 'purple', glyph: 'book' },
    isPublished: true
  },
  {
    name: 'Weight Loss Starter',
    description: 'A balanced approach to sustainable weight loss.',
    goalType: 'Weight Loss',
    calorieTarget: 1600,
    macroSplit: { protein: 30, carbs: 40, fat: 30 },
    metadata: { seasonTag: 'year-round', sourceType: 'expert' },
    days: [
      {
        day: 'Monday',
        mealType: 'Breakfast',
        foodItems: [],
        localizedMessageKey: 'mealPlan.weightloss.breakfast'
      }
    ],
    tips: ['Focus on whole foods and fiber.', 'Eat slowly and mindfully.'],
    uiHints: { palette: 'green', glyph: 'leaf' },
    isPublished: true
  },
  {
    name: 'Muscle Building Plan',
    description: 'High protein meals to support muscle growth and recovery.',
    goalType: 'Muscle Gain',
    calorieTarget: 2500,
    macroSplit: { protein: 35, carbs: 45, fat: 20 },
    metadata: { seasonTag: 'year-round', sourceType: 'expert' },
    days: [
      {
        day: 'Monday',
        mealType: 'Breakfast',
        foodItems: [],
        localizedMessageKey: 'mealPlan.muscle.breakfast'
      }
    ],
    tips: ['Post-workout meals should include protein and carbs.', 'Space protein intake throughout the day.'],
    uiHints: { palette: 'orange', glyph: 'strength' },
    isPublished: true
  },
  {
    name: 'Heart Healthy Week',
    description: 'Meals designed to support cardiovascular health.',
    goalType: 'Heart Health',
    calorieTarget: 1900,
    macroSplit: { protein: 25, carbs: 50, fat: 25 },
    metadata: { seasonTag: 'year-round', sourceType: 'expert' },
    days: [
      {
        day: 'Monday',
        mealType: 'Breakfast',
        foodItems: [],
        localizedMessageKey: 'mealPlan.heart.breakfast'
      }
    ],
    tips: ['Limit saturated fats.', 'Include plenty of vegetables and whole grains.'],
    uiHints: { palette: 'red', glyph: 'heart' },
    isPublished: true
  },
  {
    name: 'Athlete Performance Plan',
    description: 'Optimized nutrition for peak athletic performance.',
    goalType: 'Athletic Performance',
    calorieTarget: 2800,
    macroSplit: { protein: 30, carbs: 50, fat: 20 },
    metadata: { seasonTag: 'training', sourceType: 'expert' },
    days: [
      {
        day: 'Monday',
        mealType: 'Breakfast',
        foodItems: [],
        localizedMessageKey: 'mealPlan.athlete.breakfast'
      }
    ],
    tips: ['Time your meals around workouts.', 'Stay well-hydrated throughout the day.'],
    uiHints: { palette: 'blue', glyph: 'runner' },
    isPublished: true
  }
];

const seed = async () => {
  await connectDB();

  logger.info('Deleting existing data...');
  await FoodItem.deleteMany({});
  await GoalProfile.deleteMany({});
  await Tip.deleteMany({});
  await MealPlanTemplate.deleteMany({});
  await MealLog.deleteMany({});
  await Insight.deleteMany({});
  await NutritionGoal.deleteMany({});
  logger.info('Existing data deleted.');

  logger.info('Inserting sample data...');
  
  // Insert FoodItems first (needed for MealLogs)
  const foodItems = await FoodItem.insertMany(sampleFoods);
  logger.info(`✓ Inserted ${foodItems.length} FoodItems`);

  // Insert GoalProfiles
  const goalProfiles = await GoalProfile.insertMany(sampleGoals);
  logger.info(`✓ Inserted ${goalProfiles.length} GoalProfiles`);

  // Insert Tips
  const tips = await Tip.insertMany(sampleTips);
  logger.info(`✓ Inserted ${tips.length} Tips`);

  // Insert MealPlanTemplates
  const mealPlans = await MealPlanTemplate.insertMany(samplePlans);
  logger.info(`✓ Inserted ${mealPlans.length} MealPlanTemplates`);

  // Create a test user for models that require user references
  // Check if test user exists, if not create one
  let testUser = await User.findOne({ email: 'test@seed.com' });
  if (!testUser) {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@seed.com',
      password: 'test123456',
      role: 'user'
    });
    logger.info('✓ Created test user for seeding');
  }

  // Insert MealLogs (6 records)
  const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Brunch', 'Tea'];
  const mealLogs = await MealLog.insertMany(
    mealTypes.map((mealType, index) => ({
      user: testUser._id,
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000), // Different dates
      mealType,
      foodEntries: [
        {
          foodItem: foodItems[index % foodItems.length]._id,
          quantity: 1 + (index % 3),
          servingType: 'standard',
          notes: `Sample meal log for ${mealType}`
        }
      ],
      notes: `This is a sample ${mealType} log entry.`,
      summaryCache: {
        calories: foodItems[index % foodItems.length].calories * (1 + (index % 3)),
        protein: foodItems[index % foodItems.length].protein * (1 + (index % 3)),
        carbs: foodItems[index % foodItems.length].carbs * (1 + (index % 3)),
        fat: foodItems[index % foodItems.length].fat * (1 + (index % 3)),
        fiber: foodItems[index % foodItems.length].fiber * (1 + (index % 3)),
        glycemicLoad: foodItems[index % foodItems.length].glycemicLoad * (1 + (index % 3))
      }
    }))
  );
  logger.info(`✓ Inserted ${mealLogs.length} MealLogs`);

  // Insert Insights (6 records)
  const insightTypes = ['macro', 'hydration', 'streak', 'festival', 'reminder', 'macro'];
  const severities = ['info', 'success', 'warning', 'critical', 'info', 'success'];
  const insights = await Insight.insertMany(
    insightTypes.map((type, index) => ({
      user: testUser._id,
      type,
      severity: severities[index],
      message: `Sample ${type} insight message ${index + 1}`,
      localizedMessages: {
        EN: `Sample ${type} insight message ${index + 1}`,
        SI: `නියමුව ${type} අවබෝධය පණිවිඩය ${index + 1}`,
        TA: `மாதிரி ${type} நுண்ணறிவு செய்தி ${index + 1}`
      },
      metadata: { source: 'seed', index },
      uiHints: {
        palette: ['balanced', 'success', 'warning', 'critical', 'balanced', 'success'][index],
        glyph: 'lightning'
      },
      read: false
    }))
  );
  logger.info(`✓ Inserted ${insights.length} Insights`);

  // Insert NutritionGoals (6 records)
  const goalTypes = ['Diabetes', 'Student Focus', 'Weight Loss', 'Muscle Gain', 'Heart Health', 'Athletic Performance'];
  const calorieTargets = [1900, 2100, 1600, 2500, 1900, 2800];
  const nutritionGoals = await NutritionGoal.insertMany(
    goalTypes.map((goalType, index) => ({
      user: testUser._id,
      goalType,
      targetCalories: calorieTargets[index],
      targetMacroSplit: goalProfiles[index % goalProfiles.length].macroSplit,
      isActive: index < 2, // First 2 are active
      uiHints: {
        palette: goalProfiles[index % goalProfiles.length].uiHints.palette,
        glyph: goalProfiles[index % goalProfiles.length].uiHints.glyph,
        messageKey: `goal.${goalType.toLowerCase().replace(' ', '.')}`,
        emphasis: 'default'
      }
    }))
  );
  logger.info(`✓ Inserted ${nutritionGoals.length} NutritionGoals`);

  logger.info('');
  logger.info('✅ Seed data inserted successfully!');
  logger.info(`   - ${foodItems.length} FoodItems`);
  logger.info(`   - ${goalProfiles.length} GoalProfiles`);
  logger.info(`   - ${tips.length} Tips`);
  logger.info(`   - ${mealPlans.length} MealPlanTemplates`);
  logger.info(`   - ${mealLogs.length} MealLogs`);
  logger.info(`   - ${insights.length} Insights`);
  logger.info(`   - ${nutritionGoals.length} NutritionGoals`);
  logger.info('');

  await mongoose.connection.close();
  logger.info('Database connection closed.');
};

seed().catch(error => {
  logger.error('Seeding failed', error);
  process.exit(1);
});
