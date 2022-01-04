import actions from "../../base/notifications";
import mApi, { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  StatisticsDataType,
  StatisticsStatusType
} from "~/reducers/main-function/records/statistics";
import { StateType } from "~/reducers";

export interface UPDATE_STUDIES_STATISTICS
  extends SpecificActionType<"UPDATE_STUDIES_STATISTICS", StatisticsDataType> {}
export interface UPDATE_STUDIES_STATISTICS_STATUS
  extends SpecificActionType<
    "UPDATE_STUDIES_STATISTICS_STATUS",
    StatisticsStatusType
  > {}

export interface UpdateStatisticsTriggerType {
  (): AnyActionType;
}

let updateStatistics: UpdateStatisticsTriggerType =
  function updateStatistics() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_STUDIES_STATISTICS",
          payload: null
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            getState().i18n.text.get(
              "plugin.records.statistics.errormessage.statisticsUpdateFailed"
            ),
            "error"
          )
        );
      }
    };
  };

export default { updateStatistics };
export { updateStatistics };
