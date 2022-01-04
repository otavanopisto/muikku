import { SpecificActionType } from "~/actions";
export interface UPDATE_TITLE
  extends SpecificActionType<"UPDATE_TITLE", string> {}

export interface UpdateTitleTriggerType {
  (newTitle: string): UPDATE_TITLE;
}

let updateTitle: UpdateTitleTriggerType = function updateTitle(newTitle) {
  return {
    type: "UPDATE_TITLE",
    payload: newTitle
  };
};

export default { updateTitle };
export { updateTitle };
