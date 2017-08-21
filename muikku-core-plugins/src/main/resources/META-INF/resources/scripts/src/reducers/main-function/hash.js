export default function hash(state="", action){
  if (action.type === 'UPDATE_HASH'){
    return action.payload;
  }
  return state;
}