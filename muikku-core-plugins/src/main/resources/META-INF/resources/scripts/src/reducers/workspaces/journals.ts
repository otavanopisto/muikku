import { Reducer } from "redux";
import { JournalComment } from "~/@types/journal";
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
  commentCount: number;
}

/**
 * WorkspaceJournalWithComments
 */
export interface WorkspaceJournalWithComments extends WorkspaceJournalType {
  comments?: JournalComment[];
}

/**
 * WorkspaceJournalsType
 */
export interface JournalsState {
  journals: WorkspaceJournalWithComments[];
  currentJournal?: WorkspaceJournalWithComments;
  hasMore: boolean;
  userEntityId?: number;
  commentsLoaded: number[];
  commentsSaving: number[];
  state: ReducerStateType;
}

const initialJournalsState: JournalsState = {
  journals: [],
  hasMore: false,
  commentsLoaded: [],
  commentsSaving: [],
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
