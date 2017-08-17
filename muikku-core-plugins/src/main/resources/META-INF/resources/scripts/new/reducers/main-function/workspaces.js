export default function workspaces(state=[], action){
  if (action.type === 'UPDATE_WORKSPACES'){
    return action.payload;
  }
  return state;
}