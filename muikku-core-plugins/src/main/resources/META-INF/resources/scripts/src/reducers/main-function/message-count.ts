import {ActionType} from "~/actions";

export default function messageCount(state: number=0, action: ActionType<any>): number {
  if (action.type === "UPDATE_MESSAGE_COUNT"){
    let newValue: number = action.payload;
    return newValue;
  }
  return state;
}