import { GenericTag } from "~/components/general/tag-update-dialog";
import { MessagesNavigationItem } from "~/reducers/main-function/messages";
import { hexToColorInt } from "~/util/modifiers";

/**
 * Translates navigation item to a generic tag
 * @param item navigation item
 * @returns generic tag
 */
export const translateNavigationItemToGenericTag = (
  item: MessagesNavigationItem
): GenericTag => ({
  id: item.id as number,
  label: item.text,
  color: item.color && hexToColorInt(item.color),
});
