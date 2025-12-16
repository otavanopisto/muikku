import { Dispatch, Action } from "redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import { EasyToUseToolType } from "~/reducers/easy-to-use-functions";

export type SET_ACTIVE_EASY_TO_USE_TOOL = SpecificActionType<
  "SET_ACTIVE_EASY_TO_USE_TOOL",
  EasyToUseToolType
>;

/**
 * OpenReadingRuler
 */
export interface OpenReadingRuler {
  (): AnyActionType;
}

/**
 * CloseReadingRuler
 */
export interface CloseReadingRuler {
  (): AnyActionType;
}

/**
 * openReadingRuler
 */
const openReadingRuler: OpenReadingRuler = function openReadingRuler() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
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
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
    getState: () => StateType
  ) => {
    dispatch({
      type: "SET_ACTIVE_EASY_TO_USE_TOOL",
      payload: undefined,
    });
  };
};

export { openReadingRuler, closeReadingRuler };
