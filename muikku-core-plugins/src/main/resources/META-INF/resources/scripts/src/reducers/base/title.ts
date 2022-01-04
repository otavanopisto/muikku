import { ActionType } from "~/actions";

export default function title(state: string = "", action: ActionType): string {
  if (action.type === "UPDATE_TITLE") {
    let newValue: string = action.payload;
    document.title = "Muikku - " + newValue;
    return newValue;
  }
  return state;
}
