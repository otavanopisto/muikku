import { Dispatch } from "react-redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  EasyToUseToolType,
  ReadingRulerOption,
} from "~/reducers/easy-to-use-functions";

export type SET_ACTIVE_EASY_TO_USE_TOOL = SpecificActionType<
  "SET_ACTIVE_EASY_TO_USE_TOOL",
  EasyToUseToolType
>;

/**
 * OpenReadingRuler
 */
export interface OpenReadingRuler {
  (readingRulerProps?: ReadingRulerOption): AnyActionType;
}

/**
 * CloseReadingRuler
 */
export interface CloseReadingRuler {
  (): AnyActionType;
}

/**
 * openReadingRuler
 * @param readingRulerProps readingRulerProps
 */
const openReadingRuler: OpenReadingRuler = function openReadingRuler(
  readingRulerProps
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    dispatch({
      type: "SET_ACTIVE_EASY_TO_USE_TOOL",
      payload: undefined,
    });
  };
};

export { openReadingRuler, closeReadingRuler };
