export default function i18n(state={
  text: {
    get(key, ...args){
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
}, action){
  return state;
}