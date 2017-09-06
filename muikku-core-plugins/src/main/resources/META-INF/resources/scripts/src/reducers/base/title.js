export default function title(state="", action){
  if (action.type === "UPDATE_TITLE"){
    return action.payload;
  }
  return state;
}