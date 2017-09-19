export default function messageCount(state=0, action){
  if (action.type === "UPDATE_MESSAGE_COUNT"){
    return action.payload;
  }
  return state;
}