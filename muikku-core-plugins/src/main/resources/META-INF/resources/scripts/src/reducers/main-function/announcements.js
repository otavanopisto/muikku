export default function announcements(state=[], action){
  if (action.type === 'UPDATE_ANNOUNCEMENTS'){
    return action.payload;
  }
  return state;
}