import { ActionType } from "actions";

export type StatisticsStatusType = "WAIT" | "LOADING" | "READY" | "ERROR";

export interface StatisticsDataType {
  studyStartDate: string;
  studyTimeEnd: string;
  studyEndDate: string;
}

export interface StatisticsType {
  status: StatisticsStatusType;
  value: StatisticsDataType;
}

export default function statistics(
  state: StatisticsType = {
    status: "WAIT",
    value: null,
  },
  action: ActionType,
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
