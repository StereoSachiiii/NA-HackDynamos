import { REMINDER_CUTOFF_HOURS } from '../config/constants.js';

const hydrateReminder = ({ type, message, dueAt }) => ({
  type,
  message,
  dueAt,
  uiHints: {
    palette: type === 'hydration' ? 'ocean' : 'sunset',
    glyph: type === 'hydration' ? 'water' : 'alarm'
  }
});

const buildHydrationReminder = () =>
  hydrateReminder({
    type: 'hydration',
    message: 'Drink a glass of water to balance today’s spice load.',
    dueAt: new Date(Date.now() + 30 * 60 * 1000)
  });

const buildEveningWalkReminder = () =>
  hydrateReminder({
    type: 'movement',
    message: 'Consider a 10-minute walk after dinner for better glucose control.',
    dueAt: new Date(Date.now() + 2 * 60 * 60 * 1000)
  });

const getReminders = ({ lastMealAt, hasHighGlycemicMeal }) => {
  const reminders = [];

  if (!lastMealAt) {
    reminders.push(
      hydrateReminder({
        type: 'log',
        message: 'Log your first meal to unlock personalized tips.',
        dueAt: new Date()
      })
    );
    return reminders;
  }

  const hoursSinceMeal =
    (Date.now() - new Date(lastMealAt).getTime()) / (1000 * 60 * 60);

  if (hoursSinceMeal > REMINDER_CUTOFF_HOURS / 2) {
    reminders.push(
      hydrateReminder({
        type: 'log',
        message: 'Looks like you have not logged in a while. Add today’s meals?',
        dueAt: new Date()
      })
    );
  }

  reminders.push(buildHydrationReminder());

  if (hasHighGlycemicMeal) {
    reminders.push(buildEveningWalkReminder());
  }

  return reminders;
};

export { getReminders };


