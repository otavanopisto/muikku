import moment from '~/lib/moment';
import getLocaleText from '~/lib/getLocaleText';
import {ActionType} from '~/actions';

export interface i18nType {
  text: {
    get(key: string, ...args: (string | number)[]):string
  },
  time: {
    format(date?: Date | string, format?: string):string,
    fromNow(date?: Date | string):string,
    formatDaily(data?: Date | string, todayFormat?: string, otherDayFormat?: string): string,
    subtract(date?: Date | string, input?: number, value?: string):string,
    add(date?: Date | string, input?: number, value?: string):string,
    getLocalizedMoment(...args: any[]):any,
    getLocale():string
  }
}

const lang = document.querySelector("html").lang;

//TODO it uses the global muikku locale because the i18n time part doesn't have a way to know
//the current locale, it should be a method somehow
export default function i18n(state={
  text: {
    get(key: string, ...args: (string | number)[]): string{
      let text = getLocaleText(key, args);
      return text;
    }
  },
  time: {
    format(date=new Date(), format="L"){
      return moment(date).locale(lang.toLowerCase()).format(format);
    },
    fromNow(date=new Date()){
      return moment(date).fromNow();
    },
    formatDaily(date = new Date(), todayFormat = "LT", otherDayFormat = "l") {
      const momentOfDate = moment(date);
      const isToday = moment().isSame(momentOfDate, "day");
      return moment(date).locale(lang.toLowerCase()).format(isToday ? todayFormat : otherDayFormat);
    },
    subtract(date=new Date(), input=1, value="days"){
      return moment(date).subtract(input, value).calendar();
    },
    add(date=new Date(), input=1, value="days"){
      return moment(date).add(input, value).calendar();
    },
    getLocalizedMoment(...args:any[]){
      return moment(...args).locale(lang.toLowerCase());
    },
    getLocale(){
      return lang.toLowerCase();
    }
  }
}, action: ActionType): i18nType {
  return state;
}
