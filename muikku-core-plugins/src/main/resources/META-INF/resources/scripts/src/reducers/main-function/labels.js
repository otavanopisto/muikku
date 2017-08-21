export default function labels(state=[], action){
  if (action.type === 'UPDATE_lABELS'){
    return action.payload;
  }
  return state;
}