import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../config/constants.js';

const coerceLanguage = language => {
  if (!language) {
    return DEFAULT_LANGUAGE;
  }

  const upper = language.toUpperCase();
  return SUPPORTED_LANGUAGES.includes(upper) ? upper : DEFAULT_LANGUAGE;
};

const pickLocalizedMessage = (tip, language) => {
  if (!tip) return null;

  const normalizedLang = coerceLanguage(language);
  const messageMap = {
    EN: tip.messageEN,
    SI: tip.messageSI,
    TA: tip.messageTA
  };

  return (
    messageMap[normalizedLang] ||
    messageMap[DEFAULT_LANGUAGE] ||
    tip.messageEN ||
    ''
  );
};

export { coerceLanguage, pickLocalizedMessage };


