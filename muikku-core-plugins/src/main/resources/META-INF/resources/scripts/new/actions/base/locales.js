export default {
  setLocale: function(locale){
    return {
      'type': 'SET_LOCALE',
      'payload': locale
    }
  }
};