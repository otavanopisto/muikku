import {ActionType} from "~/actions";

export default function title(state: string="", action: ActionType): string {
  if (action.type === "UPDATE_TITLE"){
    let newValue: string = action.payload;
    return newValue;
  }
  return state;
}