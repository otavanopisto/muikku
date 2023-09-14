import { Reducer } from "redux";
import { JournalComment } from "~/@types/journal";
import { ActionType } from "~/actions";
import { EvaluationJournalFeedback } from "~/generated/client";
import { MaterialCompositeRepliesStateType } from "./index";

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
  /**
   * Whether journal is "mandatory" assignment and material field
   */
  isMaterialField: boolean;
  /**
   * Material field reply status. ANSWERED | "SUBMITTED" are only ones
   * that matters
   */
  workspaceMaterialReplyState: MaterialCompositeRepliesStateType | null;
}

/**
 * WorkspaceJournalWithComments
 */
export interface WorkspaceJournalWithComments extends WorkspaceJournalType {
  comments?: JournalComment[];
}

/**
 * WorkspaceJournalFilters
 */
export interface WorkspaceJournalFilters {
  showMandatory: boolean;
  showOthers: boolean;
}

/**
 * WorkspaceJournalFeedback
 */
export interface WorkspaceJournalFeedback extends EvaluationJournalFeedback {}

/**
 * WorkspaceJournalsType
 */
export interface JournalsState {
  journalFeedback?: WorkspaceJournalFeedback;
  journals: WorkspaceJournalWithComments[];
  currentJournal?: WorkspaceJournalWithComments;
  hasMore: boolean;
  userEntityId?: number;
  commentsLoaded: number[];
  commentsSaving: number[];
  filters: WorkspaceJournalFilters;
  state: ReducerStateType;
}

const initialJournalsState: JournalsState = {
  journals: [],
  hasMore: false,
  commentsLoaded: [],
  commentsSaving: [],
  filters: {
    showMandatory: false,
    showOthers: false,
  },
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
    case "JOURNALS_LOAD": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_COMMENTS_LOAD": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_SET_CURRENT": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_CREATE": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_UPDATE": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_DELETE": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_FILTTERS_CHANGE": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_COMMENTS_CREATE": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_COMMENTS_UPDATE": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_COMMENTS_DELETE": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    case "JOURNALS_FEEDBACK_LOAD": {
      return {
        ...state,
        ...action.payload.updated,
      };
    }

    default:
      return state;
  }
};
