import { SpecificActionType, AnyActionType } from "~/actions";
import { MuikkuEventProperty } from "~/generated/client";
import { MuikkuEvent } from "~/generated/client";
import { LoadingState } from "~/@types/shared";
import { Dispatch, Action } from "redux";
import MApi from "~/api/api";
import {
  CreateEventPropertyRequest,
  UpdateEventPropertyRequest,
} from "~/generated/client";
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
 * CreateDependantAbsenceEventPropertyTriggerType
 */
export interface CreateAbsenceEventPropertyTriggerType {
  (data: CreateEventPropertyRequest): AnyActionType;
}

/**
 * UpdateDependantAbsenceEventPropertyTriggerType
 */
export interface UpdateAbsenceEventPropertyTriggerType {
  (data: UpdateEventPropertyRequest): AnyActionType;
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
 * createAbsenceEventProperty
 * @param data data for creation
 */
const createAbsenceEventProperty: CreateAbsenceEventPropertyTriggerType =
  function createAbsenceEventProperty(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      const property = await eventsApi.createEventProperty(data);

      dispatch({
        type: "EVENTS_UPDATE_ABSENCE_EVENT_PROPERTY",
        payload: property,
      });
    };
  };

/**
 * updateAbsenceEventProperty
 * @param data data for creatio0n
 */
const updateAbsenceEventProperty: UpdateAbsenceEventPropertyTriggerType =
  function updateAbsenceEventProperty(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>
    ) => {
      const property = await eventsApi.updateEventProperty(data);

      dispatch({
        type: "EVENTS_UPDATE_ABSENCE_EVENT_PROPERTY",
        payload: property,
      });
    };
  };

export {
  loadAbsenceEvents,
  updateAbsenceEventProperty,
  createAbsenceEventProperty,
};
