export default function announcements(state=null, action){
  if (action.type === 'UPDATE_LAST_WORKSPACE'){
    return action.payload;
  }
  return state;
}