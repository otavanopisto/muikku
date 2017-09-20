import {SET_LOCALE} from '~/actions';

export default {
  setLocale: function(locale: string):SET_LOCALE {
    return {
      'type': 'SET_LOCALE',
      'payload': locale
    }
  }
};