import * as i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./translations/en.json";
import * as fi from "./translations/fi.json";
import { outputCorrectMomentLocale } from "~/helper-functions/locale";
import * as moment from "moment";

export const resources = {
  en,
  fi,
} as const;


export const availableLanguages = Object.keys(resources);
export const defaultNS = "common";
const lang = document.querySelector("html").lang;

i18n.use(initReactI18next).init({
  debug: true,
  resources,
  lng: "fi",
  defaultNS: defaultNS,
  fallbackLng: "fi",
  fallbackNS: "common",
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});


export const localizeTime = (date?: Date | string, format?: string): string =>
{
  const dateParam = date ? date : new Date;
  const formatParam = format ? format : "L";

  return  moment(dateParam)
  .locale(outputCorrectMomentLocale(lang.toLowerCase()))
  .format(formatParam);


}

export default i18n;
