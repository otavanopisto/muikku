import { SpecificActionType, AnyActionType } from "~/actions";
import notificationActions from "~/actions/base/notifications";
import i18n from "~/locales/i18n";
import { MuikkuEvent } from "~/generated/client";
import { LoadingState } from "~/@types/shared";
import { Dispatch, Action } from "redux";
import MApi, { isMApiError } from "~/api/api";

export type EVENTS_SET_ABSENCE_EVENTS_STATE = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS_STATE",
  LoadingState
>;

export type EVENTS_SET_ABSENCE_EVENTS = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS",
  MuikkuEvent[]
>;

/**
 * SetAbsenceEventsTriggerType
 */
export interface LoadAbsenceEventsTriggerType {
  (userId: number): AnyActionType;
}

const eventsApi = MApi.getEventsApi();
/**
 * loadAbsenceEvents
 * @param userId userId
 */
const loadAbsenceEvents: LoadAbsenceEventsTriggerType =
  function loadAbsenceEvents(userId: number) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      try {
        const end = new Date();
        const start = new Date(end);
        start.setMonth(start.getMonth() - 6);

        const events = await eventsApi.listEvents({
          user: userId,
          start,
          end,
          adjustTimes: true,
          type: "ABSENCE",
        });
        dispatch({
          type: "EVENTS_SET_ABSENCE_EVENTS",
          payload: events,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          dispatch(
            notificationActions.displayNotification(err.message, "error")
          );
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "events",
              context: "absence",
              error: err.message,
            }),
            "error"
          )
        );
      }
    };
  };

export { loadAbsenceEvents };
