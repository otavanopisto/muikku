import { Reducer } from "redux";
import { ActionType } from "~/actions";

export type ReducerStateType = "LOADING" | "LOADING_MORE" | "ERROR" | "READY";

/**
 * WorkspaceJournalType
 */
export interface WorkspaceJournalType {
  id: number;
  workspaceEntityId: number;
  userEntityId: number;
  firstName: string;
  lastName: string;
  content: string;
  title: string;
  created: string;
}

/**
 * WorkspaceJournalsType
 */
export interface JournalsState {
  journals: WorkspaceJournalType[];
  currentJournal?: WorkspaceJournalType;
  hasMore: boolean;
  userEntityId?: number;
  state: ReducerStateType;
}

const initialJournalsState: JournalsState = {
  journals: [],
  hasMore: false,
  state: "LOADING",
};

/**
 * Reducer function for journals
 *
 * @param state state
 * @param action action
 */
export const journals: Reducer<JournalsState> = (
  state = initialJournalsState,
  action: ActionType
) => {
  switch (action.type) {
    case "UPDATE_JOURNALS": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    default:
      return state;
  }
};
