import * as React from "react";
import { NotesItemFilters } from "~/@types/notes";
/**
 * GuiderViews
 */
export type GuiderView = "students" | "notes";
export type GuiderNotesState = "active" | "archived";
export type GuiderNotesType = "single" | "multi";

export type BooleanNoteFilters = NotesItemFilters & {
  single: boolean;
  multi: boolean;
};
/**
 * GuiderNoteFiltersState
 */
export type GuiderNoteFiltersState = BooleanNoteFilters & {
  state: GuiderNotesState;
};

export type GuiderNoteFilters = keyof GuiderNotesState & keyof NotesItemFilters;

export const initialState: GuiderNoteFiltersState = {
  state: "active",
  single: false,
  multi: false,
  high: false,
  normal: false,
  low: false,
  own: false,
  guider: false,
};

export type GuiderFilterActions =
  | {
      type: "SET_STATE_FILTER";
      payload: GuiderNotesState;
    }
  | { type: "SET_BOOLEAN_FILTER"; payload: keyof BooleanNoteFilters };

/**
 * filterReducer
 * @param state state
 * @param action action
 * @returns an action
 */
export const filterReducer = (
  state: GuiderNoteFiltersState,
  action: GuiderFilterActions
): GuiderNoteFiltersState => {
  switch (action.type) {
    case "SET_STATE_FILTER":
      return { ...state, state: action.payload };
    case "SET_BOOLEAN_FILTER":
      return { ...state, [action.payload]: !state[action.payload] };
    default:
      return state;
  }
};

/**
 * ContextProps interface
 * @param view view
 * @param filters filters
 * @param dispatch dispatch
 * @param setView setView
 */
export interface ContextProps {
  view: GuiderView;
  filters: GuiderNoteFiltersState;
  dispatch: React.Dispatch<GuiderFilterActions>;
  setView: (view: GuiderView) => void;
}

export const GuiderContext = React.createContext<ContextProps>({
  view: "students",
  filters: initialState,
  /**
   * dispatch
   */
  dispatch: () => {},
  /**
   * setView
   */
  setView: () => {},
});
