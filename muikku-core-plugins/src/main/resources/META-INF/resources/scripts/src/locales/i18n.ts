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
  debug: false,
  resources,
  lng: "fi",
  defaultNS: defaultNS,
  fallbackLng: "fi",
  fallbackNS: "common",
  interpolation: {
    escapeValue: false, // not needed for react!!
  },
});

/**Localize
 * Helper functions for  time localization
 */
export class Localize {
  lang;
  /**
   * constructor
   * @param language given language
   */
  constructor(language: string) {
    this.lang = language;

    this.date = this.date.bind(this);
    this.getLocalizedMoment = this.getLocalizedMoment.bind(this);
    this.formatDaily = this.formatDaily.bind(this);
    this.subtract = this.subtract.bind(this);
    this.add = this.add.bind(this);
    this.duration = this.duration.bind(this);
  }

  /**
   * getter function for language
   */
  get language(): string {
    return this.lang.toLowerCase();
  }

  /**
   * setter function for language
   */
  set language(lang: string) {
    this.lang = lang;
    document.querySelector("html").lang = lang;
    i18n.changeLanguage(lang);
  }

  /**
   * date
   * @param date date
   * @param format format
   */
  date(date?: Date | string, format = "l") {
    const dateParam = date ? date : new Date();

    return moment(dateParam)
      .locale(outputCorrectMomentLocale(this.language.toLowerCase()))
      .format(format);
  }

  /**
   * getLocalizedMoment
   * @param inp inp
   * @param strict strict
   * @returns localized moment
   */
  getLocalizedMoment(inp?: moment.MomentInput, strict?: boolean) {
    return moment(inp, strict).locale(
      outputCorrectMomentLocale(this.language.toLowerCase())
    );
  }
  /**
   * formatDaily
   * @param date date
   * @param todayFormat todayFormat
   * @param otherDayFormat otherDayFormat
   */
  formatDaily(date = new Date(), todayFormat = "h:mm", otherDayFormat = "l") {
    const momentOfDate = moment(date);
    const isToday = moment().isSame(momentOfDate, "day");
    return moment(date)
      .locale(outputCorrectMomentLocale(this.language.toLowerCase()))
      .format(isToday ? todayFormat : otherDayFormat);
  }
  /**
   * subtract
   * @param date date. Default is new Date()
   * @param input input. Default is 1
   * @param value value. Default is "days"
   */
  subtract(
    date = new Date(),
    input = 1,
    value: moment.DurationInputArg2 = "days"
  ) {
    return moment(date).subtract(input, value).calendar();
  }
  /**
   * add
   * @param date date. Default is new Date()
   * @param input input. Default is 1
   * @param value value. Default is "days"
   */
  add(date = new Date(), input = 1, value: moment.DurationInputArg2 = "days") {
    return moment(date).add(input, value).calendar();
  }

  /**
   * duration
   * @param inp inp
   * @param unit unit
   * @returns moment duration
   */
  duration(
    inp?: moment.DurationInputArg1,
    unit?: moment.unitOfTime.DurationConstructor
  ) {
    return moment.duration(inp, unit);
  }
}

export const localize = new Localize(lang);

export default i18n;
