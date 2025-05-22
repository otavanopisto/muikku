import { ActionType } from "actions";
import { Reducer } from "redux";

export type StatisticsStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

/**
 * StatisticsDataType
 */
export interface StatisticsDataType {
  studyStartDate: string;
  studyTimeEnd: string;
  studyEndDate: string;
}

/**
 * StatisticsType
 */
export interface StatisticsType {
  status: StatisticsStatusType;
  value: StatisticsDataType;
}

/**
 * initialState
 */
const initialState: StatisticsType = {
  status: "WAIT",
  value: null,
};

/**
 * Reducer function for statistic
 *
 * @param state state
 * @param action action
 * @returns State of statistic
 */
export const statistics: Reducer<StatisticsType, ActionType> = (
  state = initialState,
  action
) => {
  switch (action.type) {
    case "UPDATE_STUDIES_STATISTICS_STATUS":
      return {
        ...state,
        status: action.payload,
      };

    case "UPDATE_STUDIES_STATISTICS":
      return {
        ...state,
        value: action.payload,
      };

    default:
      return state;
  }
};
