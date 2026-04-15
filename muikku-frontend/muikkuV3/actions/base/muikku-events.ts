import { SpecificActionType, AnyActionType } from "~/actions";
import {
  MuikkuEvent,
  MuikkuEventProperty,
  UserEventService,
} from "~/mock/absence";
import { LoadingState } from "~/@types/shared";

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

/**
 * loadAbsenceEvents
 * @param userId userId
 */
const loadAbsenceEvents: LoadAbsenceEventsTriggerType =
  function loadAbsenceEvents(userId: number) {
    const EventService = new UserEventService(userId);
    return async (dispatch: (arg: AnyActionType) => any) => {
      dispatch({
        type: "EVENTS_SET_ABSENCE_EVENTS",
        payload: await EventService.getAbsenceEvents(),
      });
    };
  };

/**
 * updateAbsenceEventProperty
 * @param eventId eventId
 * @param property property
 * @param userEntityId userEntityId
 */
const updateAbsenceEventProperty: UpdateAbsenceEventPropertyTriggerType =
  function updateAbsenceEventProperty(property) {
    return {
      type: "EVENTS_UPDATE_ABSENCE_EVENT_PROPERTY",
      payload: property,
    };
  };

export { loadAbsenceEvents, updateAbsenceEventProperty };
