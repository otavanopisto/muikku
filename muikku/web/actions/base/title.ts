import { SpecificActionType } from "~/actions";
export type UPDATE_TITLE = SpecificActionType<"UPDATE_TITLE", string>;

/**
 * UpdateTitleTriggerType
 */
export interface UpdateTitleTriggerType {
  (newTitle: string): UPDATE_TITLE;
}

/**
 * updateTitle
 * @param newTitle newTitle
 */
const updateTitle: UpdateTitleTriggerType = function updateTitle(newTitle) {
  return {
    type: "UPDATE_TITLE",
    payload: newTitle,
  };
};

export default { updateTitle };
export { updateTitle };
