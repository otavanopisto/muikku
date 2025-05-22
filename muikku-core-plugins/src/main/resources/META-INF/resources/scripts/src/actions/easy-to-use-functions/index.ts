import { AppThunkAction, SpecificActionType } from "~/actions";
import { EasyToUseToolType } from "~/reducers/easy-to-use-functions";

export type SET_ACTIVE_EASY_TO_USE_TOOL = SpecificActionType<
  "SET_ACTIVE_EASY_TO_USE_TOOL",
  EasyToUseToolType
>;

/**
 * OpenReadingRuler
 */
export interface OpenReadingRuler {
  (): AppThunkAction;
}

/**
 * CloseReadingRuler
 */
export interface CloseReadingRuler {
  (): AppThunkAction;
}

/**
 * openReadingRuler
 */
const openReadingRuler: OpenReadingRuler = function openReadingRuler() {
  return async (dispatch, getState) => {
    dispatch({
      type: "SET_ACTIVE_EASY_TO_USE_TOOL",
      payload: "Reading-ruler",
    });
  };
};

/**
 * closeReadingRuler
 */
const closeReadingRuler: CloseReadingRuler = function closeReadingRuler() {
  return async (dispatch, getState) => {
    dispatch({
      type: "SET_ACTIVE_EASY_TO_USE_TOOL",
      payload: undefined,
    });
  };
};

export { openReadingRuler, closeReadingRuler };
