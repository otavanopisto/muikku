export default function notifications(state=[], action){
  if (action.type === 'ADD_NOTIFICATION') {
    var id = (new Date()).getTime();
    return state.concat(Object.assign({id: id}, action.payload));
  } else if (action.type === 'HIDE_NOTIFICATION') {
    return state.filter(function(element){
      return element.id !== action.payload.id;
    });
  }
  return state;
}