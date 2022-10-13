/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadCurrentWorkspaceJournalsHelper } from "./helpers";
import { AnyActionType, SpecificActionType } from "~/actions";
import { WorkspaceJournalType, WorkspaceType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { displayNotification } from "../base/notifications";
import { JournalsState } from "~/reducers/workspaces/journals";
import { journals } from "../../reducers/workspaces/journals";

export type UPDATE_JOURNALS = SpecificActionType<
  "UPDATE_JOURNALS",
  {
    original: JournalsState;
    updated: Partial<JournalsState>;
  }
>;

// Workspace journal loading triggers

/**
 * LoadCurrentWorkspaceJournalsFromServerTriggerType
 */
export interface LoadCurrentWorkspaceJournalsFromServerTriggerType {
  (userEntityId?: number): AnyActionType;
}

/**
 * LoadMoreCurrentWorkspaceJournalsFromServerTriggerType
 */
export interface LoadMoreCurrentWorkspaceJournalsFromServerTriggerType {
  (): AnyActionType;
}

// Workspace journal trigger types

/**
 * CreateWorkspaceJournalForCurrentWorkspaceTriggerType
 */
export interface CreateWorkspaceJournalForCurrentWorkspaceTriggerType {
  (data: {
    title: string;
    content: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateWorkspaceJournalInCurrentWorkspaceTriggerType
 */
export interface UpdateWorkspaceJournalInCurrentWorkspaceTriggerType {
  (data: {
    journal: WorkspaceJournalType;
    title: string;
    content: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteWorkspaceJournalInCurrentWorkspaceTriggerType
 */
export interface DeleteWorkspaceJournalInCurrentWorkspaceTriggerType {
  (data: {
    journal: WorkspaceJournalType;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * SetCurrentJournal
 */
export interface SetCurrentJournalTriggerType {
  (data: { currentJournal: WorkspaceJournalType }): AnyActionType;
}

/**
 * loadCurrentWorkspaceJournalsFromServer
 * @param userEntityId userEntityId
 */
const loadCurrentWorkspaceJournalsFromServer: LoadCurrentWorkspaceJournalsFromServerTriggerType =
  function loadCurrentWorkspaceJournalsFromServer(userEntityId) {
    return loadCurrentWorkspaceJournalsHelper.bind(this, userEntityId, true);
  };

/**
 * loadMoreCurrentWorkspaceJournalsFromServer
 */
const loadMoreCurrentWorkspaceJournalsFromServer: LoadMoreCurrentWorkspaceJournalsFromServerTriggerType =
  function loadMoreCurrentWorkspaceJournalsFromServer() {
    return loadCurrentWorkspaceJournalsHelper.bind(this, null, false);
  };

/**
 * createWorkspaceJournalForCurrentWorkspace
 * @param data data
 */
const createWorkspaceJournalForCurrentWorkspace: CreateWorkspaceJournalForCurrentWorkspaceTriggerType =
  function createWorkspaceJournalForCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();
        const newJournal: WorkspaceJournalType = <WorkspaceJournalType>(
          await promisify(
            mApi().workspace.workspaces.journal.create(
              state.workspaces.currentWorkspace.id,
              {
                content: data.content,
                title: data.title,
              }
            ),
            "callback"
          )()
        );

        const currentJournalsState = getState().journals;

        dispatch({
          type: "UPDATE_JOURNALS",
          payload: {
            original: currentJournalsState,
            updated: {
              journals: [newJournal].concat(currentJournalsState.journals),
              hasMore: currentJournalsState.hasMore,
              userEntityId: currentJournalsState.userEntityId,
              state: currentJournalsState.state,
            },
            /* update: {
              journals: {
                journals: [newJournal].concat(
                  currentWorkspace.journals.journals
                ),
                hasMore: currentWorkspace.journals.hasMore,
                userEntityId: currentWorkspace.journals.userEntityId,
                state: currentWorkspace.journals.state,
              },
            }, */
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToCreateJournal"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * updateWorkspaceJournalInCurrentWorkspace
 * @param data data
 */
const updateWorkspaceJournalInCurrentWorkspace: UpdateWorkspaceJournalInCurrentWorkspaceTriggerType =
  function updateWorkspaceJournalInCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();
        await promisify(
          mApi().workspace.workspaces.journal.update(
            state.workspaces.currentWorkspace.id,
            data.journal.id,
            {
              id: data.journal.id,
              workspaceEntityId: state.workspaces.currentWorkspace.id,
              content: data.content,
              title: data.title,
            }
          ),
          "callback"
        )();

        const currentJournalsState = getState().journals;

        dispatch({
          type: "UPDATE_JOURNALS",
          payload: {
            original: currentJournalsState,
            updated: {
              journals: currentJournalsState.journals.map((j) => {
                if (j.id === data.journal.id) {
                  return { ...j, content: data.content, title: data.title };
                }
                return j;
              }),
              hasMore: currentJournalsState.hasMore,
              userEntityId: currentJournalsState.userEntityId,
              state: currentJournalsState.state,
            },
            /* update: {
              journals: {
                journals: currentWorkspace.journals.journals.map((j) => {
                  if (j.id === data.journal.id) {
                    return { ...j, content: data.content, title: data.title };
                  }
                  return j;
                }),
                hasMore: currentWorkspace.journals.hasMore,
                userEntityId: currentWorkspace.journals.userEntityId,
                state: currentWorkspace.journals.state,
              },
            }, */
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToUpdateJournal"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * deleteWorkspaceJournalInCurrentWorkspace
 * @param data data
 */
const deleteWorkspaceJournalInCurrentWorkspace: DeleteWorkspaceJournalInCurrentWorkspaceTriggerType =
  function deleteWorkspaceJournalInCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        const state: StateType = getState();
        await promisify(
          mApi().workspace.workspaces.journal.del(
            state.workspaces.currentWorkspace.id,
            data.journal.id
          ),
          "callback"
        )();

        const currentJournalsState = getState().journals;

        dispatch({
          type: "UPDATE_JOURNALS",
          payload: {
            original: currentJournalsState,
            updated: {
              journals: currentJournalsState.journals.filter(
                (j) => j.id !== data.journal.id
              ),
              hasMore: currentJournalsState.hasMore,
              userEntityId: currentJournalsState.userEntityId,
              state: currentJournalsState.state,
            },
            /* update: {
              journals: {
                journals: currentWorkspace.journals.journals.filter(
                  (j) => j.id !== data.journal.id
                ),
                hasMore: currentWorkspace.journals.hasMore,
                userEntityId: currentWorkspace.journals.userEntityId,
                state: currentWorkspace.journals.state,
              },
            }, */
          },
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          displayNotification(
            getState().i18n.text.get(
              "plugin.workspace.management.notification.failedToDeleteJournal"
            ),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * setCurrentJournal
 * @param data data
 */
const setCurrentJournal: SetCurrentJournalTriggerType =
  function setCurrentJournal(data) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const currentJournalsState = getState().journals;

      dispatch({
        type: "UPDATE_JOURNALS",
        payload: {
          original: currentJournalsState,
          updated: {
            ...currentJournalsState,
            currentJournal: data.currentJournal,
          },
          /* update: {
            journals: {
              ...state.workspaces.currentWorkspace.journals,
              currentJournal: data.currentJournal,
            },
          }, */
        },
      });
    };
  };

export {
  loadCurrentWorkspaceJournalsFromServer,
  loadMoreCurrentWorkspaceJournalsFromServer,
  createWorkspaceJournalForCurrentWorkspace,
  updateWorkspaceJournalInCurrentWorkspace,
  deleteWorkspaceJournalInCurrentWorkspace,
  setCurrentJournal,
};
