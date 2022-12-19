import * as i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./translations/en.json";
import * as fi from "./translations/fi.json";

export const resources = {
  en,
  fi,
} as const;

export const availableLanguages = Object.keys(resources);
export const defaultNS = "common";

i18n.use(initReactI18next).init({
  defaultNS,
  debug: true,
  resources,
  ns: [defaultNS],
  lng: "fi",
  fallbackLng: "fi",
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

export default i18n;
