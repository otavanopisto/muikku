/* eslint-disable @typescript-eslint/no-explicit-any */
import { loadCurrentWorkspaceJournalsHelper } from "./helpers";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import promisify from "~/util/promisify";
import mApi, { MApiError } from "~/lib/mApi";
import { displayNotification } from "../base/notifications";
import {
  JournalsState,
  WorkspaceJournalType,
} from "~/reducers/workspaces/journals";
import { Dispatch } from "react-redux";
import {
  JournalComment,
  JournalCommentCreate,
  JournalCommentDelete,
  JournalCommentUpdate,
} from "~/@types/journal";

/**
 * JournalActionUpdate
 */
interface JournalActionUpdate {
  original: JournalsState;
  updated: Partial<JournalsState>;
}

// THIS MIGHT SEEMS THAT IT IS OVERKILL YEAH, but for development purposes
// it is easier if you can see what specific action does by reading its name

export type JOURNALS_LOAD = SpecificActionType<
  "JOURNALS_LOAD",
  JournalActionUpdate
>;

// Journals
export type JOURNALS_CREATE = SpecificActionType<
  "JOURNALS_CREATE",
  JournalActionUpdate
>;

export type JOURNALS_UPDATE = SpecificActionType<
  "JOURNALS_UPDATE",
  JournalActionUpdate
>;

export type JOURNALS_DELETE = SpecificActionType<
  "JOURNALS_DELETE",
  JournalActionUpdate
>;

export type JOURNALS_SET_CURRENT = SpecificActionType<
  "JOURNALS_SET_CURRENT",
  JournalActionUpdate
>;

// Journal comments
export type JOURNALS_COMMENTS_LOAD = SpecificActionType<
  "JOURNALS_COMMENTS_LOAD",
  JournalActionUpdate
>;

export type JOURNALS_COMMENTS_CREATE = SpecificActionType<
  "JOURNALS_COMMENTS_CREATE",
  JournalActionUpdate
>;

export type JOURNALS_COMMENTS_UPDATE = SpecificActionType<
  "JOURNALS_COMMENTS_UPDATE",
  JournalActionUpdate
>;

export type JOURNALS_COMMENTS_DELETE = SpecificActionType<
  "JOURNALS_COMMENTS_DELETE",
  JournalActionUpdate
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

/**
 * LoadWorkspaceJournalCommentsFromServerTriggerType
 */
export interface LoadWorkspaceJournalCommentsFromServerTriggerType {
  (data: {
    workspaceId: number;
    journalEntryId: number;
    isCurrent: boolean;
  }): AnyActionType;
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
 * CreateWorkspaceJournalCommentInTriggerType
 */
export interface CreateWorkspaceJournalCommentTriggerType {
  (data: {
    newCommentPayload: JournalCommentCreate;
    journalEntryId: number;
    workspaceEntityId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UpdateWorkspaceJournalCommentInTriggerType
 */
export interface UpdateWorkspaceJournalCommentTriggerType {
  (data: {
    updatedCommentPayload: JournalCommentUpdate;
    journalEntryId: number;
    workspaceEntityId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteWorkspaceJournalCommentInTriggerType
 */
export interface DeleteWorkspaceJournalCommentTriggerType {
  (data: {
    deleteCommentPayload: JournalCommentDelete;
    journalEntryId: number;
    workspaceEntityId: number;
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
 * loadWorkspaceJournalCommentsFromServer
 * @param data data
 */
const loadWorkspaceJournalCommentsFromServer: LoadWorkspaceJournalCommentsFromServerTriggerType =
  function loadWorkspaceJournalCommentsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const journalCommentList = (await promisify(
          mApi().workspace.workspaces.journal.comments.read(
            data.workspaceId,
            data.journalEntryId
          ),
          "callback"
        )()) as JournalComment[];

        const currentJournalsState = getState().journals;

        const index = currentJournalsState.journals.findIndex(
          (j) => j.id === data.journalEntryId
        );

        const updatedJournalsList = [...currentJournalsState.journals];

        updatedJournalsList[index].comments = journalCommentList;

        dispatch({
          type: "JOURNALS_COMMENTS_LOAD",
          payload: {
            original: currentJournalsState,
            updated: {
              journals: updatedJournalsList,
              currentJournal: data.isCurrent && {
                ...updatedJournalsList[index],
              },
              hasMore: currentJournalsState.hasMore,
              userEntityId: currentJournalsState.userEntityId,
              state: currentJournalsState.state,
            },
          },
        });
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
      }
    };
  };

/**
 * createWorkspaceJournalForCurrentWorkspace
 * @param data data
 */
const createWorkspaceJournalForCurrentWorkspace: CreateWorkspaceJournalForCurrentWorkspaceTriggerType =
  function createWorkspaceJournalForCurrentWorkspace(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
          type: "JOURNALS_CREATE",
          payload: {
            original: currentJournalsState,
            updated: {
              journals: [newJournal].concat(currentJournalsState.journals),
              hasMore: currentJournalsState.hasMore,
              userEntityId: currentJournalsState.userEntityId,
              state: currentJournalsState.state,
            },
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
          type: "JOURNALS_UPDATE",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
          type: "JOURNALS_DELETE",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const currentJournalsState = getState().journals;

      dispatch({
        type: "JOURNALS_SET_CURRENT",
        payload: {
          original: currentJournalsState,
          updated: {
            ...currentJournalsState,
            currentJournal: data.currentJournal,
          },
        },
      });

      try {
        // Loading comments if setting currentJournal and its comments are not already loaded
        if (data.currentJournal) {
          if (
            !currentJournalsState.commentsLoaded.includes(
              data.currentJournal.id
            )
          ) {
            const journalCommentList = (await promisify(
              mApi().workspace.workspaces.journal.comments.read(
                data.currentJournal.workspaceEntityId,
                data.currentJournal.id
              ),
              "callback"
            )()) as JournalComment[];

            const currentJournalsStateAfter = getState().journals;

            const index = currentJournalsStateAfter.journals.findIndex(
              (j) => j.id === data.currentJournal.id
            );

            const updatedJournalsList = [...currentJournalsStateAfter.journals];

            updatedJournalsList[index].comments = journalCommentList;

            dispatch({
              type: "JOURNALS_COMMENTS_LOAD",
              payload: {
                original: currentJournalsStateAfter,
                updated: {
                  journals: updatedJournalsList,
                  currentJournal: data.currentJournal,
                  commentsLoaded: [
                    ...currentJournalsStateAfter.commentsLoaded,
                    data.currentJournal.id,
                  ],
                  hasMore: currentJournalsStateAfter.hasMore,
                  userEntityId: currentJournalsStateAfter.userEntityId,
                  state: currentJournalsStateAfter.state,
                },
              },
            });
          } else {
            dispatch({
              type: "JOURNALS_SET_CURRENT",
              payload: {
                original: currentJournalsState,
                updated: {
                  ...currentJournalsState,
                  currentJournal: data.currentJournal,
                },
              },
            });
          }
        }
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
      }
    };
  };

/**
 * createWorkspaceJournalComment
 * @param data data
 */
const createWorkspaceJournalComment: CreateWorkspaceJournalCommentTriggerType =
  function createWorkspaceJournalComment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const {
        newCommentPayload,
        journalEntryId,
        workspaceEntityId,
        fail,
        success,
      } = data;

      const currentJournalsState = getState().journals;

      try {
        const [updated] = await Promise.all([
          (async () => {
            // New comment data
            const newComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.create(
                workspaceEntityId,
                journalEntryId,
                newCommentPayload
              ),
              "callback"
            )()) as JournalComment;

            // Find current journal index
            const index = currentJournalsState.journals.findIndex(
              (j) => j.id === journalEntryId
            );

            const updatedCurrentJournal = currentJournalsState.journals[index];

            // Updated current journal data
            updatedCurrentJournal.comments.push(newComment);
            updatedCurrentJournal.commentCount++;

            const updatedJournalsList = [...currentJournalsState.journals];

            // Update also journal list with updated list item, which is current now
            updatedJournalsList.splice(index, 1, updatedCurrentJournal);

            return {
              updatedCurrentJournal,
              updatedJournalsList,
            };
          })(),
        ]);

        success && success();

        dispatch({
          type: "JOURNALS_COMMENTS_CREATE",
          payload: {
            original: currentJournalsState,
            updated: {
              ...currentJournalsState,
              currentJournal: updated.updatedCurrentJournal,
              journals: updated.updatedJournalsList,
            },
          },
        });
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
        fail && fail();
      }
    };
  };

/**
 * createWorkspaceJournalComment
 * @param data data
 */
const updatedWorkspaceJournalComment: UpdateWorkspaceJournalCommentTriggerType =
  function updatedWorkspaceJournalComment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const {
        updatedCommentPayload,
        journalEntryId,
        workspaceEntityId,
        fail,
        success,
      } = data;

      const currentJournalsState = getState().journals;

      try {
        const [updated] = await Promise.all([
          (async () => {
            // Updated comment data
            const updatedComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.update(
                workspaceEntityId,
                journalEntryId,
                updatedCommentPayload.id,
                updatedCommentPayload
              ),
              "callback"
            )()) as JournalComment;

            // Find current journal index
            const index = currentJournalsState.journals.findIndex(
              (j) => j.id === journalEntryId
            );

            const updatedCurrentJournal = currentJournalsState.journals[index];

            // Find updated comment index from list
            const commentIndex = updatedCurrentJournal.comments.findIndex(
              (c) => c.id === updatedCommentPayload.id
            );

            // Updated that list with new data
            updatedCurrentJournal.comments.splice(
              commentIndex,
              1,
              updatedComment
            );

            const updatedJournalsList = [...currentJournalsState.journals];

            // Update also journal list with updated list item, which is current now
            updatedJournalsList.splice(index, 1, updatedCurrentJournal);

            return {
              updatedCurrentJournal,
              updatedJournalsList,
            };
          })(),
        ]);

        success && success();

        dispatch({
          type: "JOURNALS_COMMENTS_UPDATE",
          payload: {
            original: currentJournalsState,
            updated: {
              ...currentJournalsState,
              currentJournal: updated.updatedCurrentJournal,
              journals: updated.updatedJournalsList,
            },
          },
        });
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
        fail && fail();
      }
    };
  };

/**
 * createWorkspaceJournalComment
 * @param data data
 */
const deleteWorkspaceJournalComment: DeleteWorkspaceJournalCommentTriggerType =
  function updatedWorkspaceJournalComment(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const {
        deleteCommentPayload,
        journalEntryId,
        workspaceEntityId,
        fail,
        success,
      } = data;

      const currentJournalsState = getState().journals;

      try {
        const [updated] = await Promise.all([
          (async () => {
            await promisify(
              mApi().workspace.workspaces.journal.comments.del(
                workspaceEntityId,
                journalEntryId,
                deleteCommentPayload.id
              ),
              "callback"
            )();

            // Find current journal index
            const index = currentJournalsState.journals.findIndex(
              (j) => j.id === journalEntryId
            );

            const updatedCurrentJournal = currentJournalsState.journals[index];

            // Find updated comment index from list
            const commentIndex = updatedCurrentJournal.comments.findIndex(
              (c) => c.id === deleteCommentPayload.id
            );

            // Updated that list with new data
            updatedCurrentJournal.comments.splice(commentIndex, 1);
            updatedCurrentJournal.commentCount--;

            const updatedJournalsList = [...currentJournalsState.journals];

            // Update also journal list with updated list item, which is current now
            updatedJournalsList.splice(index, 1, updatedCurrentJournal);

            return {
              updatedCurrentJournal,
              updatedJournalsList,
            };
          })(),
        ]);

        success && success();

        dispatch({
          type: "JOURNALS_COMMENTS_DELETE",
          payload: {
            original: currentJournalsState,
            updated: {
              ...currentJournalsState,
              currentJournal: updated.updatedCurrentJournal,
              journals: updated.updatedJournalsList,
            },
          },
        });
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
        fail && fail();
      }
    };
  };

export {
  loadCurrentWorkspaceJournalsFromServer,
  loadMoreCurrentWorkspaceJournalsFromServer,
  loadWorkspaceJournalCommentsFromServer,
  createWorkspaceJournalForCurrentWorkspace,
  updateWorkspaceJournalInCurrentWorkspace,
  deleteWorkspaceJournalInCurrentWorkspace,
  setCurrentJournal,
  createWorkspaceJournalComment,
  updatedWorkspaceJournalComment,
  deleteWorkspaceJournalComment,
};
