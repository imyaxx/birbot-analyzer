import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import ru from './locales/ru.json';
import kk from './locales/kz.json';
import en from './locales/en.json';
import { STORAGE_KEYS } from '@/shared/constants/app';

const resources = { ru, kk, en };
const supportedLanguages = ['ru', 'kk', 'en'];
const storageKey = STORAGE_KEYS.LANGUAGE;

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'ru';
  const saved = window.localStorage.getItem(storageKey);
  if (saved && supportedLanguages.includes(saved)) {
    return saved;
  }
  return 'ru';
}

i18n.use(initReactI18next).init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: 'ru',
  supportedLngs: supportedLanguages,
  interpolation: {
    escapeValue: false,
  },
});

if (typeof document !== 'undefined') {
  document.documentElement.lang = i18n.language;
}

i18n.on('languageChanged', (lng) => {
  if (typeof document !== 'undefined') {
    document.documentElement.lang = lng;
  }
  if (typeof window !== 'undefined') {
    window.localStorage.setItem(storageKey, lng);
  }
});

export default i18n;
