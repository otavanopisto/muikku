import getLocaleText from "~/lib/getLocaleText";
import * as moment from "moment";
import "moment/locale/en-gb";
import { outputCorrectMomentLocale } from "~/helper-functions/locale";
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
     * duration
     * @param inp inp
     * @param unit unit
     */
    duration(
      inp?: moment.DurationInputArg1,
      unit?: moment.unitOfTime.DurationConstructor
    ): moment.Duration;

    /**
     * getLocalizedMoment
     */
    getLocalizedMoment(
      inp?: moment.MomentInput,
      strict?: boolean
    ): moment.Moment;
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
 * i18n
 * @param state state
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
        return moment(date)
          .locale(outputCorrectMomentLocale(lang.toLowerCase()))
          .format(format);
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
          .locale(outputCorrectMomentLocale(lang.toLowerCase()))
          .format(isToday ? todayFormat : otherDayFormat);
      },
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
      },
      /**
       * add
       * @param date date. Default is new Date()
       * @param input input. Default is 1
       * @param value value. Default is "days"
       */
      add(
        date = new Date(),
        input = 1,
        value: moment.DurationInputArg2 = "days"
      ) {
        return moment(date).add(input, value).calendar();
      },

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
      },

      /**
       * getLocalizedMoment
       * @param inp inp
       * @param strict strict
       * @returns localized moment
       */
      getLocalizedMoment(inp?: moment.MomentInput, strict?: boolean) {
        return moment(inp, strict).locale(
          outputCorrectMomentLocale(lang.toLowerCase())
        );
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
