import moment from "~/lib/moment";
import getLocaleText from "~/lib/getLocaleText";

/**
 * i18nType
 */
export interface i18nType {
  text: {
    /**
     * get
     */
    get(key: string, ...args: (string | number)[]): string;
  };
  time: {
    /**
     * format
     */
    format(date?: Date | string, format?: string): string;
    /**
     * fromNow
     */
    fromNow(date?: Date | string): string;
    /**
     * formatDaily
     */
    formatDaily(
      data?: Date | string,
      todayFormat?: string,
      otherDayFormat?: string
    ): string;
    /**
     * subtract
     */
    subtract(date?: Date | string, input?: number, value?: string): string;
    /**
     * add
     */
    add(date?: Date | string, input?: number, value?: string): string;
    /**
     * getLocalizedMoment
     */
    getLocalizedMoment(...args: any[]): any;
    /**
     * getLocale
     */
    getLocale(): string;
  };
}

const lang = document.querySelector("html").lang;

//TODO it uses the global muikku locale because the i18n time part doesn't have a way to know
//the current locale, it should be a method somehow
/**
 * @param state
 */
export default function i18n(
  state = {
    text: {
      /**
       * get
       * @param key key
       * @param {...any} args args
       */
      get(key: string, ...args: (string | number)[]): string {
        const text = getLocaleText(key, args);
        return text;
      },
    },
    time: {
      /**
       * format
       * @param date date
       * @param format format
       */
      format(date = new Date(), format = "L") {
        return moment(date).locale(lang.toLowerCase()).format(format);
      },
      /**
       * fromNow
       * @param date date
       */
      fromNow(date = new Date()) {
        return moment(date).fromNow();
      },
      /**
       * formatDaily
       * @param date date
       * @param todayFormat todayFormat
       * @param otherDayFormat otherDayFormat
       */
      formatDaily(date = new Date(), todayFormat = "LT", otherDayFormat = "l") {
        const momentOfDate = moment(date);
        const isToday = moment().isSame(momentOfDate, "day");
        return moment(date)
          .locale(lang.toLowerCase())
          .format(isToday ? todayFormat : otherDayFormat);
      },
      /**
       * subtract
       * @param date date
       * @param input input
       * @param value value
       */
      subtract(date = new Date(), input = 1, value = "days") {
        return moment(date).subtract(input, value).calendar();
      },
      /**
       * add
       * @param date date
       * @param input input
       * @param value value
       */
      add(date = new Date(), input = 1, value = "days") {
        return moment(date).add(input, value).calendar();
      },
      /**
       * getLocalizedMoment
       * @param {...any} args args
       */
      getLocalizedMoment(...args: any[]) {
        return moment(...args).locale(lang.toLowerCase());
      },
      /**
       * getLocale
       */
      getLocale() {
        return lang.toLowerCase();
      },
    },
  }
): i18nType {
  return state;
}
