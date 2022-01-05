import { SpecificActionType } from "~/actions";
export type UPDATE_TITLE = SpecificActionType<"UPDATE_TITLE", string>;

export interface UpdateTitleTriggerType {
  (newTitle: string): UPDATE_TITLE;
}

const updateTitle: UpdateTitleTriggerType = function updateTitle(newTitle) {
  return {
    type: "UPDATE_TITLE",
    payload: newTitle,
  };
};

export default { updateTitle };
export { updateTitle };
