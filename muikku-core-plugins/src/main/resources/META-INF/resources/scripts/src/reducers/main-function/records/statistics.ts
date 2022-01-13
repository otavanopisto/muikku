import { ActionType } from "actions";

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
 * statistics
 * @param state state
 * @param action action
 */
export default function statistics(
  state: StatisticsType = {
    status: "WAIT",
    value: null,
  },
  action: ActionType
): StatisticsType {
  if (action.type === "UPDATE_STUDIES_STATISTICS_STATUS") {
    return Object.assign({}, state, {
      status: action.payload,
    });
  } else if (action.type === "UPDATE_STUDIES_STATISTICS") {
    return Object.assign({}, state, {
      value: action.payload,
    });
  }
  return state;
}
