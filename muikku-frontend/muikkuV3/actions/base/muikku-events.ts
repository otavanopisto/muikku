import { SpecificActionType, AnyActionType } from "~/actions";
import { MuikkuEventProperty } from "~/generated/client";
import { MuikkuEvent } from "~/generated/client";
import { LoadingState } from "~/@types/shared";
import { Dispatch, Action } from "redux";
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
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
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
const createAbsenceEventProperty: CreateDependantAbsenceEventPropertyTriggerType =
  function createAbsenceEventProperty(property: MuikkuEventProperty) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      const prop = await eventsApi.createEventProperty({ property });

      dispatch({
        type: "GUARDIAN_UPDATE_DEPENDANT_ABSENCE_PROPERTY",
        payload: property,
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
