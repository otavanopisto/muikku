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
    subtract(date?: Date | string, input?: number, value?: string):string,
    add(date?: Date | string, input?: number, value?: string):string
  }
}

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
}, action: ActionType): i18nType {
  return state;
}