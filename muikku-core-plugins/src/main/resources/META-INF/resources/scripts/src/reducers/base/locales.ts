//TODO this reducer uses the api that interacts with the DOM in order to
//retrieve data, please fix in next versions
import $ from "~/lib/jquery";
import { ActionType } from "~/actions";
import { Reducer } from "redux";

/**
 * LocaleListType
 */
export interface LocaleListType {
  available: {
    name: string;
    locale: string;
  }[];
  current: string;
}

/**
 * initialLocalesState
 */
const initialLocalesState: LocaleListType = {
  available: $.makeArray(
    $("#language-picker a").map((index: number, element: HTMLElement) => ({
      name: $(element).text().trim(),
      locale: $(element).data("locale"),
    }))
  ),
  current: $("#locale").text(),
};

/**
 * Reducer function for locales
 *
 * @param state state
 * @param action action
 * @returns State of locales
 */
export const locales: Reducer<LocaleListType> = (
  state = initialLocalesState,
  action: ActionType
) => {
  switch (action.type) {
    case "SET_LOCALE":
      $('#language-picker a[data-locale="' + action.payload + '"]').click();
      return Object.assign({}, state, { current: action.payload });

    default:
      return state;
  }
};

/**
 * locales
 * @param state state
 * @param action action
 */
/* export default function locales(
  state = {
    available: $.makeArray(
      $("#language-picker a").map((index: number, element: HTMLElement) => ({
        name: $(element).text().trim(),
        locale: $(element).data("locale"),
      }))
    ),
    current: $("#locale").text(),
  },
  action: ActionType
): LocaleListType {
  if (action.type === "SET_LOCALE") {
    $('#language-picker a[data-locale="' + action.payload + '"]').click();
    return Object.assign({}, state, { current: action.payload });
  }
  return state;
} */
