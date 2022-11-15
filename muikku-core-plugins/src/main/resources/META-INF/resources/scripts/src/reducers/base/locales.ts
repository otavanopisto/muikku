import { ActionType } from "~/actions";
import { Reducer } from "redux";

/**
 * LocaleState
 */
export interface LocaleState {
  current?: string;
}

export type LocaleType = "en" | "fi";

/**
 * LocaleReadResponse
 */
export interface LocaleReadResponse {
  lang: string;
}

/**
 * initialLocalesState
 */
const initialLocalesState: LocaleState = {
  current: undefined,
};

/**
 * Reducer function for locales
 *
 * @param state state
 * @param action action
 * @returns State of locales
 */
export const locales: Reducer<LocaleState> = (
  state = initialLocalesState,
  action: ActionType
) => {
  switch (action.type) {
    case "LOCALE_SET":
      return Object.assign({}, state, { current: action.payload });

    case "LOCALE_UPDATE":
      return Object.assign({}, state, { current: action.payload });

    default:
      return state;
  }
};
