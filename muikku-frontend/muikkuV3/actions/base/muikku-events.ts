import { SpecificActionType, AnyActionType } from "~/actions";
import { MuikkuEventProperty } from "~/mock/absence";

import { MuikkuEvent } from "~/generated/client";
import { LoadingState } from "~/@types/shared";
import MApi from "~/api/api";

export type EVENTS_SET_ABSENCE_EVENTS = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS",
  MuikkuEvent[]
>;
export type EVENTS_SET_ABSENCE_EVENTS_STATE = SpecificActionType<
  "EVENTS_SET_ABSENCE_EVENTS_STATE",
  LoadingState
>;

export type EVENTS_UPDATE_ABSENCE_EVENT_PROPERTY = SpecificActionType<
  "EVENTS_UPDATE_ABSENCE_EVENT_PROPERTY",
  MuikkuEventProperty
>;

/**
 * SetAbsenceEventsTriggerType
 */
export interface LoadAbsenceEventsTriggerType {
  (userId: number): AnyActionType;
}

/**
 * UpdateAbsenceEventPropertyTriggerType
 */
export interface UpdateAbsenceEventPropertyTriggerType {
  (property: MuikkuEventProperty): AnyActionType;
}

const eventsApi = MApi.getEventsApi();
/**
 * loadAbsenceEvents
 * @param userId userId
 */
const loadAbsenceEvents: LoadAbsenceEventsTriggerType =
  function loadAbsenceEvents(userId: number) {
    return async (dispatch: (arg: AnyActionType) => any) => {
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
    };
  };

/**
 * updateAbsenceEventProperty
 * @param property property
 */
const updateAbsenceEventProperty: UpdateAbsenceEventPropertyTriggerType =
  function updateAbsenceEventProperty(property) {
    return {
      type: "EVENTS_UPDATE_ABSENCE_EVENT_PROPERTY",
      payload: property,
    };
  };

export { loadAbsenceEvents, updateAbsenceEventProperty };
