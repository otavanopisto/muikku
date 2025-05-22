import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { resources } from "~/locales/i18n";

/**
 * LocaleState
 */
export interface LocaleState {
  current?: string;
}

export type LocaleType = keyof typeof resources;

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
export const locales: Reducer<LocaleState, ActionType> = (
  state = initialLocalesState,
  action
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
