import moment from 'moment';
import getLocaleText from 'getLocaleText';
import {ActionType} from '~/actions';

export default function i18n(state={
  text: {
    get(key: string, ...args: (string | number)[]): string{
      let text = getLocaleText(key, args);
      if (text){
        text = text.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      }
      
      return text;
    }
  },
  time: {
    format(date=new Date(), format="L"){
      return moment(new Date(date)).format(format);
    },
    fromNow(date=new Date()){
      return moment(new Date(date)).fromNow();
    },
    subtract(date=new Date(), input=1, value="days"){
      return moment(new Date(date)).subtract(input, value).calendar();
    },
    add(date=new Date(), input=1, value="days"){
      return moment(new Date(date)).add(input, value).calendar();
    }
  }
}, action: ActionType<any>): i18nType {
  return state;
}

export interface i18nType {
  text: {
    get(key: string, ...args: (string | number)[]):string
  },
  time: {
    format(date?: Date, format?: string):string,
    fromNow(date?: Date):string,
    subtract(date?: Date, input?: number, value?: string):string,
    add(date?: Date, input?: number, value?: string):string
  }
}