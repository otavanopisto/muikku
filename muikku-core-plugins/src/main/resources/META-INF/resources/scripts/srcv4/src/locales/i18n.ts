import * as i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./translations/en.json";
import * as fi from "./translations/fi.json";
import dayjs from "dayjs";
import "dayjs/locale/fi";
import "dayjs/locale/en";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";
import calendar from "dayjs/plugin/calendar";
import duration from "dayjs/plugin/duration";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(calendar);
dayjs.extend(duration);

export const resources = {
  en,
  fi,
} as const;

export const availableLanguages = Object.keys(resources);
export const defaultNS = "common";
const lang = document.querySelector("html")?.lang ?? "fi";

await i18n.use(initReactI18next).init({
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

/**
 * Helper function to get the correct dayjs locale
 * @param language - The language code
 * @returns The dayjs locale string
 */
function outputCorrectDayjsLocale(language: string): string {
  const localeMap: Record<string, string> = {
    fi: "fi",
    en: "en-gb",
  };

  return localeMap[language] || "fi";
}

/**
 * Localize - Helper functions for time localization
 */
export class Localize {
  lang: string;

  /**
   * constructor
   * @param language given language
   */
  constructor(language: string) {
    this.lang = language;

    this.date = this.date.bind(this);
    this.getLocalizedDayjs = this.getLocalizedDayjs.bind(this);
    this.formatDaily = this.formatDaily.bind(this);
    this.subtract = this.subtract.bind(this);
    this.add = this.add.bind(this);
    this.duration = this.duration.bind(this);
  }

  /**
   * Getter function for language
   */
  get language(): string {
    return this.lang.toLowerCase();
  }

  /**
   * Setter function for language
   */
  set language(lang: string) {
    this.lang = lang;
    document.querySelector("html")!.lang = lang;
    void i18n.changeLanguage(lang);
  }

  /**
   * date
   * @param date date
   * @param format format
   */
  date(date?: Date | string, format = "l") {
    const dateParam = date ?? new Date();

    return dayjs(dateParam)
      .locale(outputCorrectDayjsLocale(this.language.toLowerCase()))
      .format(format);
  }

  /**
   * getLocalizedDayjs
   * @param inp input
   * @returns localized dayjs
   */
  getLocalizedDayjs(inp?: dayjs.ConfigType) {
    return dayjs(inp).locale(
      outputCorrectDayjsLocale(this.language.toLowerCase())
    );
  }

  /**
   * formatDaily
   * @param date date
   * @param todayFormat todayFormat
   * @param otherDayFormat otherDayFormat
   */
  formatDaily(date = new Date(), todayFormat = "h:mm", otherDayFormat = "l") {
    const dayjsOfDate = dayjs(date);
    const isToday = dayjs().isSame(dayjsOfDate, "day");
    return dayjs(date)
      .locale(outputCorrectDayjsLocale(this.language.toLowerCase()))
      .format(isToday ? todayFormat : otherDayFormat);
  }

  /**
   * subtract
   * @param date date. Default is new Date()
   * @param input input. Default is 1
   * @param value value. Default is "days"
   */
  subtract(date = new Date(), input = 1, value: dayjs.ManipulateType = "day") {
    return dayjs(date).subtract(input, value).calendar();
  }

  /**
   * add
   * @param date date. Default is new Date()
   * @param input input. Default is 1
   * @param value value. Default is "days"
   */
  add(date = new Date(), input = 1, value: dayjs.ManipulateType = "day") {
    return dayjs(date).add(input, value).calendar();
  }

  /**
   * duration
   * @param time time
   * @param unit unit
   * @returns dayjs duration
   */
  duration(time: number, unit: duration.DurationUnitType) {
    return dayjs
      .duration(time, unit)
      .locale(outputCorrectDayjsLocale(this.language.toLowerCase()));
  }

  /**
   * Formats a number according to the locale conventions
   * @param value number to format
   * @param options formatting options (optional)
   * @returns formatted number string
   */
  number(value: number, options: Intl.NumberFormatOptions = {}) {
    return new Intl.NumberFormat(this.language, options).format(value);
  }
}

export const localize = new Localize(lang);

export default i18n;
