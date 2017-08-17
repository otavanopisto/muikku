export default function lastMessages(state=[], action){
  if (action.type === 'UPDATE_LAST_MESSAGES'){
    return action.payload;
  }
  return state;
}