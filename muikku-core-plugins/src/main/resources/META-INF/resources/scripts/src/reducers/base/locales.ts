//TODO this reducer uses the api that interacts with the DOM in order to
//retrieve data, please fix in next versions

export default function locales(state={
  avaliable: $.makeArray($("#language-picker a").map((index, element)=>{
    return {
      name: $(element).text().trim(),
      locale: $(element).data('locale')
    }
  })),
  current: $("#locale").text()
}, action){
  if (action.type === 'SET_LOCALE'){
    $('#language-picker a[data-locale="' + action.payload + '"]').click();
    return Object.assign({}, state, {current: action.payload});
  }
  return state;
}