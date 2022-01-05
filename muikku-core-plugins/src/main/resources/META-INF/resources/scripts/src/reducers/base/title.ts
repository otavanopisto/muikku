import { ActionType } from "~/actions";

export default function title(state = "", action: ActionType): string {
  if (action.type === "UPDATE_TITLE") {
    const newValue: string = action.payload;
    document.title = "Muikku - " + newValue;
    return newValue;
  }
  return state;
}
