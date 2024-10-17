import { AnyActionType, SpecificActionType } from "~/actions";
import notificationActions from "~/actions/base/notifications";
import {
  DiscussionStatePatch,
  DiscussionStateType,
} from "~/reducers/discussion";
import { StateType } from "~/reducers";
import { Dispatch, Action } from "redux";
import MApi, { isMApiError } from "~/api/api";
import {
  CreateDiscussionAreaRequest,
  CreateDiscussionThreadReplyRequest,
  DiscussionArea,
  DiscussionSubscribedArea,
  DiscussionSubscribedThread,
  DiscussionThread,
  DiscussionThreadLock,
  DiscussionThreadReply,
  UpdateDiscussionAreaRequest,
  UpdateDiscussionThreadReplyRequest,
} from "~/generated/client";
import i18n from "~/locales/i18n";

const MAX_LOADED_AT_ONCE = 30;

export type UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS = SpecificActionType<
  "UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS",
  boolean
>;

export type UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES = SpecificActionType<
  "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
  DiscussionStatePatch
>;
export type UPDATE_DISCUSSION_THREADS_STATE = SpecificActionType<
  "UPDATE_DISCUSSION_THREADS_STATE",
  DiscussionStateType
>;
export type UPDATE_DISCUSSION_CURRENT_THREAD_STATE = SpecificActionType<
  "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
  DiscussionStateType
>;
export type PUSH_DISCUSSION_THREAD_FIRST = SpecificActionType<
  "PUSH_DISCUSSION_THREAD_FIRST",
  DiscussionThread
>;
export type SET_CURRENT_DISCUSSION_THREAD = SpecificActionType<
  "SET_CURRENT_DISCUSSION_THREAD",
  DiscussionThread
>;
export type SET_TOTAL_DISCUSSION_PAGES = SpecificActionType<
  "SET_TOTAL_DISCUSSION_PAGES",
  number
>;
export type SET_TOTAL_DISCUSSION_THREAD_PAGES = SpecificActionType<
  "SET_TOTAL_DISCUSSION_THREAD_PAGES",
  number
>;
export type UPDATE_DISCUSSION_THREAD = SpecificActionType<
  "UPDATE_DISCUSSION_THREAD",
  DiscussionThread
>;
export type UPDATE_DISCUSSION_THREAD_REPLY = SpecificActionType<
  "UPDATE_DISCUSSION_THREAD_REPLY",
  DiscussionThreadReply
>;
export type UPDATE_DISCUSSION_AREAS = SpecificActionType<
  "UPDATE_DISCUSSION_AREAS",
  DiscussionArea[]
>;
export type PUSH_DISCUSSION_AREA_LAST = SpecificActionType<
  "PUSH_DISCUSSION_AREA_LAST",
  DiscussionArea
>;
export type UPDATE_DISCUSSION_AREA = SpecificActionType<
  "UPDATE_DISCUSSION_AREA",
  {
    areaId: number;
    update: UpdateDiscussionAreaRequest;
  }
>;
export type DELETE_DISCUSSION_AREA = SpecificActionType<
  "DELETE_DISCUSSION_AREA",
  number
>;
export type SET_DISCUSSION_WORKSPACE_ID = SpecificActionType<
  "SET_DISCUSSION_WORKSPACE_ID",
  number
>;
export type UPDATE_SUBSCRIBED_THREAD_LIST = SpecificActionType<
  "UPDATE_SUBSCRIBED_THREAD_LIST",
  DiscussionSubscribedThread[]
>;
export type UPDATE_SUBSCRIBED_AREA_LIST = SpecificActionType<
  "UPDATE_SUBSCRIBED_AREA_LIST",
  DiscussionSubscribedArea[]
>;

/**
 * ShowOnlySubscribedThreads
 */
export interface ShowOnlySubscribedThreads {
  (data: {
    value: boolean;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * SubscribeToDiscussionThread
 */
export interface SubscribeDiscussionThread {
  (data: {
    areaId: number;
    threadId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UnsubscribeDiscustionThread
 */
export interface UnsubscribeDiscustionThread {
  (data: {
    areaId: number;
    threadId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * SubscribeDiscussionArea
 */
export interface SubscribeDiscussionArea {
  (data: {
    areaId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * UnsubscribeDiscustionArea
 */
export interface UnsubscribeDiscustionArea {
  (data: {
    areaId: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadSubscribedDiscussionThreadList
 */
export interface LoadSubscribedDiscussionThreadList {
  (data: { success?: () => void; fail?: () => void }): AnyActionType;
}

/**
 * LoadSubscribedDiscussionThreadList
 */
export interface LoadSubscribedDiscussionAreaList {
  (data: { success?: () => void; fail?: () => void }): AnyActionType;
}

/**
 * loadDiscussionThreadsFromServerTriggerType
 */
export interface loadDiscussionThreadsFromServerTriggerType {
  (data: {
    areaId: number;
    page: number;
    forceRefresh?: boolean;
    notRemoveCurrent?: boolean;
  }): AnyActionType;
}

/**
 * CreateDiscussionThreadTriggerType
 */
export interface CreateDiscussionThreadTriggerType {
  (data: {
    forumAreaId: number;
    lock: DiscussionThreadLock | null;
    message: string;
    sticky: boolean;
    title: string;
    subscribe: boolean;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * ModifyDiscussionThreadTriggerType
 */
export interface ModifyDiscussionThreadTriggerType {
  (data: {
    thread: DiscussionThread;
    lock: DiscussionThreadLock | null;
    message: string;
    sticky: boolean;
    title: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * LoadDiscussionThreadFromServerTriggerType
 */
export interface LoadDiscussionThreadFromServerTriggerType {
  (data: {
    areaId: number;
    page?: number;
    threadId: number;
    threadPage?: number;
    forceRefresh?: boolean;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * ReplyToCurrentDiscussionThreadTriggerType
 */
export interface ReplyToCurrentDiscussionThreadTriggerType {
  (data: {
    message: string;
    parentId?: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * DeleteCurrentDiscussionThreadTriggerType
 */
export interface DeleteCurrentDiscussionThreadTriggerType {
  (data: { success?: () => void; fail?: () => void }): AnyActionType;
}

/**
 * DeleteDiscussionThreadReplyFromCurrentTriggerType
 */
export interface DeleteDiscussionThreadReplyFromCurrentTriggerType {
  (data: {
    reply: DiscussionThreadReply;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * ModifyReplyFromCurrentThreadTriggerType
 */
export interface ModifyReplyFromCurrentThreadTriggerType {
  (data: {
    reply: DiscussionThreadReply;
    message: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * showOnlySubscribedThreads
 * @param data data
 * @returns dispatch
 */
const showOnlySubscribedThreads: ShowOnlySubscribedThreads =
  function showOnlySubscribedThreads(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      dispatch({
        type: "UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS",
        payload: data.value,
      });
    };
  };

/**
 * subscribeDiscussionThread
 * @param data data
 * @returns dispatch
 */
const subscribeDiscussionThread: SubscribeDiscussionThread =
  function subscribeDiscussionThread(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const discussionApi = MApi.getDiscussionApi();

      try {
        const subscribedThread =
          await discussionApi.toggleDiscussionThreadSubscription({
            areaId: data.areaId,
            threadId: data.threadId,
          });

        const subscribedThreadList = [...state.discussion.subscribedThreads];

        subscribedThreadList.push(subscribedThread);

        dispatch({
          type: "UPDATE_SUBSCRIBED_THREAD_LIST",
          payload: subscribedThreadList,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * unsubscribeDiscussionThread
 * @param data data
 * @returns dispatch
 */
const unsubscribeDiscussionThread: UnsubscribeDiscustionThread =
  function unsubscribeDiscussionThread(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();

      const discussionApi = MApi.getDiscussionApi();

      try {
        await discussionApi.toggleDiscussionThreadSubscription({
          areaId: data.areaId,
          threadId: data.threadId,
        });

        const subscribedThreadList = [...state.discussion.subscribedThreads];

        const index = subscribedThreadList.findIndex(
          (sThread) => sThread.threadId === data.threadId
        );

        subscribedThreadList.splice(index, 1);

        dispatch({
          type: "UPDATE_SUBSCRIBED_THREAD_LIST",
          payload: subscribedThreadList,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * subscribeDiscussionArea
 * @param data data
 * @returns dispatch
 */
const subscribeDiscussionArea: SubscribeDiscussionArea =
  function subscribeDiscussionArea(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussionApi = MApi.getDiscussionApi();

      try {
        const subscribedArea =
          await discussionApi.toggleDiscussionAreaSubscription({
            areaId: data.areaId,
          });

        const subscribedAreaList = [...state.discussion.subscribedAreas];

        subscribedAreaList.push(subscribedArea);

        dispatch({
          type: "UPDATE_SUBSCRIBED_AREA_LIST",
          payload: subscribedAreaList,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * unsubscribeDiscussionArea
 * @param data data
 * @returns dispatch
 */
const unsubscribeDiscussionArea: UnsubscribeDiscustionArea =
  function unsubscribeDiscussionArea(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussionApi = MApi.getDiscussionApi();

      try {
        await discussionApi.toggleDiscussionAreaSubscription({
          areaId: data.areaId,
        });

        const subscribedAreaList = [...state.discussion.subscribedAreas];

        const index = subscribedAreaList.findIndex(
          (sArea) => sArea.areaId === data.areaId
        );

        subscribedAreaList.splice(index, 1);

        dispatch({
          type: "UPDATE_SUBSCRIBED_AREA_LIST",
          payload: subscribedAreaList,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "ERROR",
        });
      }
    };
  };

/**
 * loadSubscribedDiscussionAreaList
 * @param data data
 * @returns dispatch
 */
const loadSubscribedDiscussionAreaList: LoadSubscribedDiscussionAreaList =
  function loadSubscribedDiscussionThreadList(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussionApi = MApi.getDiscussionApi();

      try {
        const subscribedAreaList =
          await discussionApi.getDiscussionSubscribedAreas({
            userId: state.status.userId,
          });

        dispatch({
          type: "UPDATE_SUBSCRIBED_AREA_LIST",
          payload: subscribedAreaList,
        });

        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "READY",
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "ERROR",
        });
        data.fail && data.fail();
      }
    };
  };

/**
 * loadSubscribedDiscussionThreadList
 * @param data data
 * @returns dispatch
 */
const loadSubscribedDiscussionThreadList: LoadSubscribedDiscussionThreadList =
  function loadSubscribedDiscussionThreadList(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussionApi = MApi.getDiscussionApi();

      try {
        const subscribedThreadList =
          await discussionApi.getDiscussionSubscribedThreads({
            userId: state.status.userId,
          });

        dispatch({
          type: "UPDATE_SUBSCRIBED_THREAD_LIST",
          payload: subscribedThreadList,
        });

        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "READY",
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "ERROR",
        });
        data.fail && data.fail();
      }
    };
  };

/**
 * loadDiscussionThreadsFromServer
 * @param data data
 * @returns dispatch
 */
const loadDiscussionThreadsFromServer: loadDiscussionThreadsFromServerTriggerType =
  function loadDiscussionThreadsFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      //Remove the current message
      if (!data.notRemoveCurrent) {
        dispatch({
          type: "SET_CURRENT_DISCUSSION_THREAD",
          payload: null,
        });
      }
      dispatch({
        type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
        payload: "WAIT",
      });

      const state = getState();
      const discussion = state.discussion;

      //Avoid loading if it's the same area
      if (
        !data.forceRefresh &&
        discussion.threads.length > 0 &&
        discussion.areaId === data.areaId &&
        discussion.state === "READY" &&
        discussion.page === data.page
      ) {
        return;
      }

      //NOTE we reload the discussion areas every time we load the threads because we have absolutely no
      //idea if the amount of pages per thread change every time I select a page, data updates on the fly
      //one solution would be to make a realtime change
      dispatch(
        loadDiscussionAreasFromServer(async () => {
          dispatch({
            type: "UPDATE_DISCUSSION_THREADS_STATE",
            payload: "LOADING",
          });

          //Calculate the amount of pages
          let allThreadNumber = 0;
          if (data.areaId) {
            const area = discussion.areas.find(
              (area) => area.id === data.areaId
            );
            allThreadNumber = area.numThreads;
          } else {
            discussion.areas.forEach((area) => {
              allThreadNumber += area.numThreads;
            });
          }

          const pages = Math.ceil(allThreadNumber / MAX_LOADED_AT_ONCE) || 1;

          dispatch({
            type: "SET_TOTAL_DISCUSSION_PAGES",
            payload: pages,
          });

          //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
          const firstResult = (data.page - 1) * MAX_LOADED_AT_ONCE;

          try {
            let threads: DiscussionThread[] = [];

            // If in workspace
            if (discussion.workspaceId) {
              if (data.areaId) {
                threads =
                  await workspaceDiscussionApi.getWorkspaceDiscussionThreads({
                    workspaceentityId: discussion.workspaceId,
                    areaId: data.areaId,
                    firstResult,
                    maxResults: MAX_LOADED_AT_ONCE,
                  });
              } else {
                threads = await workspaceDiscussionApi.getWorkspaceForumLatest({
                  workspaceId: discussion.workspaceId,
                  firstResult,
                  maxResults: MAX_LOADED_AT_ONCE,
                });
              }
            }
            // Enviroment level
            else {
              if (data.areaId) {
                threads = await discussionApi.getDiscussionThreads({
                  areaId: data.areaId,
                  firstResult,
                  maxResults: MAX_LOADED_AT_ONCE,
                });
              } else {
                threads = await discussionApi.getLatestDiscussionThreads({
                  firstResult,
                  maxResults: MAX_LOADED_AT_ONCE,
                });
              }
            }

            //Create the payload for updating all the communicator properties
            const payload: DiscussionStatePatch = {
              state: "READY",
              threads,
              page: data.page,
              areaId: data.areaId,
            };

            //And there it goes
            dispatch({
              type: "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
              payload,
            });
          } catch (err) {
            if (!isMApiError(err)) {
              throw err;
            }

            //Error :(
            dispatch(
              notificationActions.displayNotification(err.message, "error")
            );
            dispatch({
              type: "UPDATE_DISCUSSION_THREADS_STATE",
              payload: "ERROR",
            });
          }
        })
      );
    };
  };

/**
 * createDiscussionThread
 * @param data data
 * @returns dispatch
 */
const createDiscussionThread: CreateDiscussionThreadTriggerType =
  function createDiscussionThread(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      if (!data.title) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.caption", {
              ns: "messaging",
              context: "message",
            }),
            "error"
          )
        );
      } else if (!data.message) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.content", { ns: "messaging" }),
            "error"
          )
        );
      }

      try {
        const discussion = getState().discussion;
        const params = {
          forumAreaId: data.forumAreaId,
          lock: data.lock,
          message: data.message,
          sticky: data.sticky,
          title: data.title,
        };

        let newThread: DiscussionThread;

        // If in workspace
        if (discussion.workspaceId) {
          newThread =
            await workspaceDiscussionApi.createWorkspaceDiscussionThread({
              workspaceentityId: discussion.workspaceId,
              areaId: data.forumAreaId,
              createDiscussionThreadRequest: params,
            });
        } else {
          newThread = await discussionApi.createDiscussionThread({
            areaId: data.forumAreaId,
            createDiscussionThreadRequest: params,
          });
        }

        const hash = window.location.hash.replace("#", "").split("/");

        const areaId = discussion.areaId ? discussion.areaId : 0;

        const areaString = hash.includes("subs")
          ? "subs"
          : areaId + "/" + discussion.page;

        window.location.hash =
          areaString + "/" + newThread.forumAreaId + "/" + newThread.id + "/1";

        // If user want to subscribe data when creating new
        if (data.subscribe) {
          dispatch(
            subscribeDiscussionThread({
              areaId: newThread.forumAreaId,
              threadId: newThread.id,
            })
          );
        }

        //non-ready, also area count might change, so let's reload it
        dispatch(loadDiscussionAreasFromServer());

        //since we cannot be sure how the new tread affected whatever they are looking at now, and we can't just push first
        //because we might not have the last, lets make it so that when they go back the server is called in order
        //to retrieve the data properly

        //this will do it, since it will consider the discussion thread to be in a waiting state
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: "WAIT",
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * modifyDiscussionThread
 * @param data data
 * @returns dispatch
 */
const modifyDiscussionThread: ModifyDiscussionThreadTriggerType =
  function modifyDiscussionThread(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      if (!data.title) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.caption", {
              ns: "messaging",
              context: "message",
            }),
            "error"
          )
        );
      } else if (!data.message) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.content", { ns: "messaging" }),
            "error"
          )
        );
      }

      try {
        const payload: DiscussionThread = Object.assign({}, data.thread, {
          title: data.title,
          message: data.message,
          sticky: data.sticky,
          lock: data.lock,
        });
        const discussion = getState().discussion;

        let updatedThread: DiscussionThread;

        if (discussion.workspaceId) {
          updatedThread =
            await workspaceDiscussionApi.updateWorkspaceDiscussionThread({
              workspaceentityId: discussion.workspaceId,
              areaId: data.thread.forumAreaId,
              threadId: data.thread.id,
              updateDiscussionThreadRequest: payload,
            });
        } else {
          updatedThread = await discussionApi.updateDiscussionThread({
            areaId: data.thread.forumAreaId,
            threadId: data.thread.id,
            updateDiscussionThreadRequest: payload,
          });
        }

        dispatch({
          type: "UPDATE_DISCUSSION_THREAD",
          payload: updatedThread,
        });

        const discussionState = getState().discussion;

        dispatch(
          loadDiscussionThreadsFromServer({
            areaId: discussionState.areaId,
            page: discussionState.page,
            forceRefresh: true,
            notRemoveCurrent: true,
          })
        );

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * loadDiscussionThreadFromServer
 * @param data data
 * @returns dispatch
 */
const loadDiscussionThreadFromServer: LoadDiscussionThreadFromServerTriggerType =
  function loadDiscussionThreadFromServer(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion = state.discussion;

      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      //Avoid loading if it's the same thread that has been loaded already
      if (
        discussion.current &&
        discussion.current.id === data.threadId &&
        discussion.currentPage === data.threadPage
      ) {
        return;
      }

      const actualThreadPage = data.threadPage || discussion.currentPage;

      dispatch({
        type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
        payload: "LOADING",
      });

      //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
      const firstResult = (actualThreadPage - 1) * MAX_LOADED_AT_ONCE;

      try {
        let newCurrentThread = discussion.threads.find(
          (thread) => thread.id === data.threadId
        );

        if (!newCurrentThread || data.forceRefresh) {
          if (discussion.workspaceId) {
            newCurrentThread =
              await workspaceDiscussionApi.getWorkspaceDiscussionThread({
                workspaceentityId: discussion.workspaceId,
                areaId: data.areaId,
                threadId: data.threadId,
              });
          } else {
            newCurrentThread = await discussionApi.getDiscussionThread({
              areaId: data.areaId,
              threadId: data.threadId,
            });
          }
        }

        const pages: number =
          Math.ceil(newCurrentThread.numReplies / MAX_LOADED_AT_ONCE) || 1;

        dispatch({
          type: "SET_TOTAL_DISCUSSION_THREAD_PAGES",
          payload: pages,
        });

        let replies: DiscussionThreadReply[] = [];

        if (discussion.workspaceId) {
          replies =
            await workspaceDiscussionApi.getWorkspaceDiscussionThreadReplies({
              workspaceentityId: discussion.workspaceId,
              areaId: data.areaId,
              threadId: data.threadId,
              firstResult: firstResult,
              maxResults: MAX_LOADED_AT_ONCE,
            });
        } else {
          replies = await discussionApi.getDiscussionThreadReplies({
            areaId: data.areaId,
            threadId: data.threadId,
            firstResult: firstResult,
            maxResults: MAX_LOADED_AT_ONCE,
          });
        }

        const newThreads = state.discussion.threads.map((thread) => {
          if (thread.id !== newCurrentThread.id) {
            return thread;
          }
          return newCurrentThread;
        });

        const newProps: DiscussionStatePatch = {
          current: newCurrentThread,
          currentReplies: replies,
          currentState: "READY",
          currentPage: actualThreadPage,
          threads: newThreads,
        };

        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
          payload: newProps,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        //Error :(
        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
          payload: "ERROR",
        });

        data.fail && data.fail();
      }
    };
  };

/**
 * replyToCurrentDiscussionThread
 * @param data data
 * @returns dispatch
 */
const replyToCurrentDiscussionThread: ReplyToCurrentDiscussionThreadTriggerType =
  function replyToDiscussionThread(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const payload: CreateDiscussionThreadReplyRequest = {
        message: data.message,
      };

      if (data.parentId) {
        payload.parentReplyId = data.parentId;
      }

      const state = getState();
      const discussion = state.discussion;

      try {
        if (discussion.workspaceId) {
          await workspaceDiscussionApi.createWorkspaceDiscussionThreadReply({
            workspaceentityId: discussion.workspaceId,
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            createDiscussionThreadReplyRequest: payload,
          });
        } else {
          await discussionApi.createDiscussionThreadReply({
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            createDiscussionThreadReplyRequest: payload,
          });
        }

        //sadly the new calculation is overly complex and error prone so we'll just do this;
        //We also need to use force refresh to avoid reusing data in memory
        dispatch(
          loadDiscussionThreadFromServer({
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            success: data.success,
            fail: data.fail,
            forceRefresh: true,
          })
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * deleteCurrentDiscussionThread
 * @param data data
 * @returns dispatch
 */
const deleteCurrentDiscussionThread: DeleteCurrentDiscussionThreadTriggerType =
  function deleteCurrentDiscussionThread(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion = state.discussion;

      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      try {
        if (discussion.workspaceId) {
          await workspaceDiscussionApi.deleteWorkspaceDiscussionThread({
            workspaceentityId: discussion.workspaceId,
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
          });
        } else {
          await discussionApi.deleteDiscussionThread({
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
          });
        }

        dispatch(
          loadDiscussionThreadsFromServer({
            areaId: discussion.areaId,
            page: discussion.page,
            forceRefresh: true,
          })
        );

        //TODO same hacky method to trigger the goback event
        if (history.replaceState) {
          const canGoBack =
            document.referrer.indexOf(window.location.host) !== -1 &&
            history.length;
          if (canGoBack) {
            history.back();
          } else {
            const splitted = location.hash.split("/");
            history.replaceState("", "", splitted[0] + "/" + splitted[1]);
            window.dispatchEvent(new HashChangeEvent("hashchange"));
          }
        } else {
          const splitted = location.hash.split("/");
          location.hash = splitted[0] + "/" + splitted[1];
        }
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * deleteDiscussionThreadReplyFromCurrent
 * @param data data
 * @returns dispatch
 */
const deleteDiscussionThreadReplyFromCurrent: DeleteDiscussionThreadReplyFromCurrentTriggerType =
  function deleteDiscussionThreadReplyFromCurrent(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion = state.discussion;

      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      try {
        if (discussion.workspaceId) {
          await workspaceDiscussionApi.deleteWorkspaceDiscussionThreadReply({
            workspaceentityId: discussion.workspaceId,
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            replyId: data.reply.id,
          });
        } else {
          await discussionApi.deleteDiscussionThreadReply({
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            replyId: data.reply.id,
          });
        }

        dispatch(
          loadDiscussionThreadFromServer({
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            success: data.success,
            fail: data.fail,
          })
        );
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          notificationActions.displayNotification(
            i18n.t("notifications.removeError", {
              ns: "messaging",
              context: "reply",
            }),
            "error"
          )
        );
        data.fail && data.fail();
      }
    };
  };

/**
 * modifyReplyFromCurrentThread
 * @param data data
 * @returns dispatch
 */
const modifyReplyFromCurrentThread: ModifyReplyFromCurrentThreadTriggerType =
  function modifyReplyFromCurrentThread(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion = state.discussion;

      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      try {
        const updateRequest: UpdateDiscussionThreadReplyRequest = {
          ...data.reply,
          message: data.message,
        };

        let updatedReply: DiscussionThreadReply;

        if (discussion.workspaceId) {
          updatedReply =
            await workspaceDiscussionApi.updateWorkspaceDiscussionThreadReply({
              workspaceentityId: discussion.workspaceId,
              areaId: discussion.current.forumAreaId,
              threadId: discussion.current.id,
              replyId: data.reply.id,
              updateDiscussionThreadReplyRequest: updateRequest,
            });
        } else {
          updatedReply = await discussionApi.updateDiscussionThreadReply({
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            replyId: data.reply.id,
            updateDiscussionThreadReplyRequest: updateRequest,
          });
        }

        dispatch({
          type: "UPDATE_DISCUSSION_THREAD_REPLY",
          payload: updatedReply,
        });

        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * LoadDiscussionAreasFromServerTriggerType
 */
export interface LoadDiscussionAreasFromServerTriggerType {
  (callback?: () => void): AnyActionType;
}

/**
 * loadDiscussionAreasFromServer
 * @param callback callback
 * @returns dispatch
 */
const loadDiscussionAreasFromServer: LoadDiscussionAreasFromServerTriggerType =
  function loadDiscussionAreasFromServer(callback) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussion = getState().discussion;

      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      try {
        let areas: DiscussionArea[] = [];

        if (discussion.workspaceId) {
          areas = await workspaceDiscussionApi.getWorkspaceDiscussionAreas({
            workspaceentityId: discussion.workspaceId,
          });
        } else {
          areas = await discussionApi.getDiscussionAreas();
        }

        dispatch({
          type: "UPDATE_DISCUSSION_AREAS",
          payload: areas,
        });

        callback && callback();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
      }
    };
  };

/**
 * CreateDiscussionAreaTriggerType
 */
export interface CreateDiscussionAreaTriggerType {
  (data: {
    name: string;
    description: string;
    subscribe: boolean;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * createDiscussionArea
 * @param data data
 * @returns dispatch
 */
const createDiscussionArea: CreateDiscussionAreaTriggerType =
  function createDiscussionArea(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      if (!data.name) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.name", { ns: "messaging", context: "area" }),
            "error"
          )
        );
      }

      try {
        const discussion = getState().discussion;

        const params: CreateDiscussionAreaRequest = {
          name: data.name,
          description: data.description,
        };

        let newArea: DiscussionArea;

        if (discussion.workspaceId) {
          newArea = await workspaceDiscussionApi.createWorkspaceDiscussionArea({
            workspaceentityId: discussion.workspaceId,
            createWorkspaceDiscussionAreaRequest: params,
          });
        } else {
          newArea = await discussionApi.createDiscussionArea({
            createDiscussionAreaRequest: params,
          });
        }

        // If user want to subscribe data when creating new
        if (data.subscribe) {
          dispatch(
            subscribeDiscussionArea({
              areaId: newArea.id,
            })
          );
        }

        dispatch({
          type: "PUSH_DISCUSSION_AREA_LAST",
          payload: newArea,
        });
        location.hash = "#" + newArea.id;
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * UpdateDiscussionAreaTriggerType
 */
export interface UpdateDiscussionAreaTriggerType {
  (data: {
    id: number;
    name: string;
    description: string;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 *
 * @param data data
 * @returns dispatch
 */
const updateDiscussionArea: UpdateDiscussionAreaTriggerType =
  function updateDiscussionArea(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      if (!data.name) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            i18n.t("validation.name", { ns: "messaging", context: "area" }),
            "error"
          )
        );
      }

      try {
        const discussion = getState().discussion;
        const params: UpdateDiscussionAreaRequest = {
          name: data.name,
          description: data.description,
        };

        if (discussion.workspaceId) {
          await workspaceDiscussionApi.updateWorkspaceDiscussionArea({
            workspaceentityId: discussion.workspaceId,
            areaId: data.id,
            updateDiscussionAreaRequest: params,
          });
        } else {
          await discussionApi.updateDiscussionArea({
            areaId: data.id,
            updateDiscussionAreaRequest: params,
          });
        }

        dispatch({
          type: "UPDATE_DISCUSSION_AREA",
          payload: {
            areaId: data.id,
            update: {
              name: data.name,
              description: data.description,
            },
          },
        });
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * DeleteDiscussionAreaTriggerType
 */
export interface DeleteDiscussionAreaTriggerType {
  (data: {
    id: number;
    success?: () => void;
    fail?: () => void;
  }): AnyActionType;
}

/**
 * deleteDiscussionArea
 * @param data data
 * @returns dispatch
 */
const deleteDiscussionArea: DeleteDiscussionAreaTriggerType =
  function deleteDiscussionArea(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<Action<AnyActionType>>,
      getState: () => StateType
    ) => {
      const discussionApi = MApi.getDiscussionApi();
      const workspaceDiscussionApi = MApi.getWorkspaceDiscussionApi();

      try {
        const discussion = getState().discussion;

        if (discussion.workspaceId) {
          await workspaceDiscussionApi.deleteWorkspaceDiscussionArea({
            workspaceentityId: discussion.workspaceId,
            areaId: data.id,
          });
        } else {
          await discussionApi.deleteDiscussionArea({
            areaId: data.id,
          });
        }

        location.hash = "";
        dispatch({
          type: "DELETE_DISCUSSION_AREA",
          payload: data.id,
        });
        data.success && data.success();
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(notificationActions.displayNotification(err.message, "error"));
        data.fail && data.fail();
      }
    };
  };

/**
 * SetDiscussionWorkspaceIdTriggerType
 */
export interface SetDiscussionWorkspaceIdTriggerType {
  (workspaceId: number): AnyActionType;
}

/**
 * setDiscussionWorkpaceId
 * @param workspaceId workspaceId
 * @returns dispatch
 */
const setDiscussionWorkpaceId: SetDiscussionWorkspaceIdTriggerType =
  function setDiscussionWorkpaceId(workspaceId) {
    return {
      type: "SET_DISCUSSION_WORKSPACE_ID",
      payload: workspaceId,
    };
  };

export {
  showOnlySubscribedThreads,
  subscribeDiscussionThread,
  unsubscribeDiscussionThread,
  subscribeDiscussionArea,
  unsubscribeDiscussionArea,
  loadSubscribedDiscussionAreaList,
  loadSubscribedDiscussionThreadList,
  loadDiscussionThreadsFromServer,
  createDiscussionThread,
  loadDiscussionThreadFromServer,
  replyToCurrentDiscussionThread,
  modifyDiscussionThread,
  deleteCurrentDiscussionThread,
  deleteDiscussionThreadReplyFromCurrent,
  modifyReplyFromCurrentThread,
  loadDiscussionAreasFromServer,
  createDiscussionArea,
  updateDiscussionArea,
  deleteDiscussionArea,
  setDiscussionWorkpaceId,
};
