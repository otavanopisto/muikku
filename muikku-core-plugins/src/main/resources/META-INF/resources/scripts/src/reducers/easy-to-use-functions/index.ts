import { Reducer } from "redux";
import { ActionType } from "~/actions";
import { ReadingRulerDefaultProps } from "~/components/easy-to-use-reading-functions/reading-ruler/reading-ruler-base";

export type ReadingRulerNameType =
  | "default1"
  | "default2"
  | "default3"
  | "custom";

export type EasyToUseToolType = "Reading-ruler" | "unset";

/**
 *ReadingRulerOption
 */
export interface ReadingRulerOption extends ReadingRulerDefaultProps {
  name?: ReadingRulerNameType;
}

/**
 * EasyToUseFunctionState
 */
export interface EasyToUseFunctionState {
  activeTool: EasyToUseToolType;
}

const initialState: EasyToUseFunctionState = {
  activeTool: "unset",
};

/**
 * easyToUseFunctions
 * @param state state
 * @param action action
 * @returns state
 */
export const easyToUse: Reducer<EasyToUseFunctionState> = (
  state = initialState,
  action: ActionType
) => {
  switch (action.type) {
    case "SET_ACTIVE_EASY_TO_USE_TOOL":
      return { ...state, activeTool: action.payload };

    default:
      return state;
  }
};
