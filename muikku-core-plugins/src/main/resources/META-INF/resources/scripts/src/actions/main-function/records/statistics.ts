import actions from "../../base/notifications";
import { MApiError } from "~/lib/mApi";
import { AnyActionType, SpecificActionType } from "~/actions";
import {
  StatisticsDataType,
  StatisticsStatusType,
} from "~/reducers/main-function/records/statistics";
import { StateType } from "~/reducers";
import i18n from "~/locales/i18n";

export type UPDATE_STUDIES_STATISTICS = SpecificActionType<
  "UPDATE_STUDIES_STATISTICS",
  StatisticsDataType
>;
export type UPDATE_STUDIES_STATISTICS_STATUS = SpecificActionType<
  "UPDATE_STUDIES_STATISTICS_STATUS",
  StatisticsStatusType
>;

/**
 * UpdateStatisticsTriggerType
 */
export interface UpdateStatisticsTriggerType {
  (): AnyActionType;
}

/**
 * UpdateStatisticsTriggerType
 */
const updateStatistics: UpdateStatisticsTriggerType =
  function updateStatistics() {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_STUDIES_STATISTICS",
          payload: null,
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              context: "statistics",
              ns: "studies",
            }),
            "error"
          )
        );
      }
    };
  };

export default { updateStatistics };
export { updateStatistics };
