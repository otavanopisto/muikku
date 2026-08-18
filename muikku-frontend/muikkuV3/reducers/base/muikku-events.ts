import { ActionType } from "~/actions";
import { Reducer } from "redux";
import { MuikkuEvent } from "~/generated/client";
import { LoadingState } from "~/@types/shared";

export const AbsenceEventEnum = {
  Lesson: "LESSON",
  LessonPreArranged: "LESSON_PRE_ARRANGED",
  Exam: "EXAM",
  SkillsDemonstrationMeeting: "SKILLS_DEMONSTRATION_MEETING",
  GuidanceOrSupportSession: "GUIDANCE_OR_SUPPORT_SESSION",
} as const;

export type AbsenceEventEnum =
  (typeof AbsenceEventEnum)[keyof typeof AbsenceEventEnum];

export const AbsenceReasonEnum = {
  Medical: "MEDICAL_REASON",
  OtherAuthorized: "OTHER_AUTHORIZED_REASON",
  UnauthorizedExplained: "UNAUTHORIZED_ABSENCE_EXPLAINED",
} as const;

export type AbsenceReasonEnum =
  (typeof AbsenceReasonEnum)[keyof typeof AbsenceReasonEnum];

/**
 * Checks if a value is a valid absence event enum
 * @param value value to check
 * @returns true if the value is a valid absence event enum
 */
export const isAbsenceEventEnum = (value: string): value is AbsenceEventEnum =>
  Object.values(AbsenceEventEnum).includes(value as AbsenceEventEnum);

/**
 * Checks if a value is a valid absence reason enum
 * @param value value to check
 * @returns true if the value is a valid absence reason enum
 */
export const isAbsenceReasonEnum = (
  value: string
): value is AbsenceReasonEnum =>
  Object.values(AbsenceReasonEnum).includes(value as AbsenceReasonEnum);

/**
 * MuikkuEvents
 */
export interface MuikkuEvents {
  events: MuikkuEvent[];
  state: LoadingState;
}

/**
 * MuikkuEventsState
 */
export interface MuikkuEventsState {
  absenceEvents: MuikkuEvents;
}

const initialMuikkuEventsState: MuikkuEventsState = {
  absenceEvents: {
    events: [],
    state: "WAITING",
  },
};

/**
 * Reducer function for muikku events
 * @param state state
 * @param action action
 * @returns State of muikku events
 */
export const muikkuEvents: Reducer<MuikkuEventsState> = (
  state: MuikkuEventsState = initialMuikkuEventsState,
  action: ActionType
) => {
  switch (action.type) {
    case "EVENTS_SET_ABSENCE_EVENTS": {
      return {
        ...state,
        absenceEvents: { events: action.payload, state: "READY" },
      };
    }
    case "EVENTS_UPDATE_ABSENCE_PROPERTY": {
      const payload = action.payload;

      if (!payload) {
        return state;
      }

      const absenceEvents = [...state.absenceEvents.events];

      // we find the absence event that we want to update
      const currentAbsenceEventIndex = absenceEvents.findIndex(
        (event) => event.id === payload.eventId
      );

      const currentAbsencePropertyIndex =
        absenceEvents[currentAbsenceEventIndex]!.properties?.findIndex(
          (property) => property.id === payload.id
        ) ?? -1;

      if (currentAbsencePropertyIndex !== -1) {
        // we update the absence event property
        absenceEvents[currentAbsenceEventIndex]!.properties![
          currentAbsencePropertyIndex
        ]!.value = payload.value;
      } else {
        // we create the absence event property
        absenceEvents[currentAbsenceEventIndex]!.properties!.push(payload);
      }

      return {
        ...state,
        absenceEvents: { events: absenceEvents, state: "READY" },
      };
    }
    case "EVENTS_CREATE_ABSENCE_PROPERTY": {
      return {
        ...state,
        absenceEvents: {
          ...state.absenceEvents,
          events: [...state.absenceEvents.events, action.payload],
        },
      };
    }
    case "EVENTS_SET_ABSENCE_EVENTS_STATE": {
      return {
        ...state,
        absenceEvents: { ...state.absenceEvents, state: action.payload },
      };
    }
    default:
      return state;
  }
};
