import { AnyActionType, SpecificActionType } from "~/actions";
import promisify from "~/util/promisify";
import notificationActions from "~/actions/base/notifications";
import mApi, { MApiError } from "~/lib/mApi";
import {
  DiscussionAreaListType,
  DiscussionAreaType,
  DiscussionPatchType,
  DiscussionStateType,
  DiscussionThreadType,
  DiscussionType,
  DiscussionThreadListType,
  DiscussionThreadReplyListType,
  DiscussionThreadReplyType,
  DiscussionAreaUpdateType,
  DiscussionSubscribedThread,
} from "~/reducers/discussion";
import { StateType } from "~/reducers";
import { Dispatch } from "react-redux";

const MAX_LOADED_AT_ONCE = 30;

export type UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS = SpecificActionType<
  "UPDATE_SHOW_ONLY_SUBSCRIBED_THREADS",
  boolean
>;

export type UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES = SpecificActionType<
  "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
  DiscussionPatchType
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
  DiscussionThreadType
>;
export type SET_CURRENT_DISCUSSION_THREAD = SpecificActionType<
  "SET_CURRENT_DISCUSSION_THREAD",
  DiscussionThreadType
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
  DiscussionThreadType
>;
export type UPDATE_DISCUSSION_THREAD_REPLY = SpecificActionType<
  "UPDATE_DISCUSSION_THREAD_REPLY",
  DiscussionThreadReplyType
>;
export type UPDATE_DISCUSSION_AREAS = SpecificActionType<
  "UPDATE_DISCUSSION_AREAS",
  DiscussionAreaListType
>;
export type PUSH_DISCUSSION_AREA_LAST = SpecificActionType<
  "PUSH_DISCUSSION_AREA_LAST",
  DiscussionAreaType
>;
export type UPDATE_DISCUSSION_AREA = SpecificActionType<
  "UPDATE_DISCUSSION_AREA",
  {
    areaId: number;
    update: DiscussionAreaUpdateType;
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

/**
 * ShowOnlySubscribedThreads
 */
export interface ShowOnlySubscribedThreads {
  (data: {
    value: boolean;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * SubscribeToDiscussionThread
 */
export interface SubscribeDiscussionThread {
  (data: {
    areaId: number;
    threadId: number;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * UnsubscribeDiscustionThread
 */
export interface UnsubscribeDiscustionThread {
  (data: {
    areaId: number;
    threadId: number;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * LoadSubscribedDiscussionThreadList
 */
export interface LoadSubscribedDiscussionThreadList {
  (data: { success?: () => any; fail?: () => any }): AnyActionType;
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
    locked: boolean;
    message: string;
    sticky: boolean;
    title: string;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * ModifyDiscussionThreadTriggerType
 */
export interface ModifyDiscussionThreadTriggerType {
  (data: {
    thread: DiscussionThreadType;
    locked: boolean;
    message: string;
    sticky: boolean;
    title: string;
    success?: () => any;
    fail?: () => any;
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
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * ReplyToCurrentDiscussionThreadTriggerType
 */
export interface ReplyToCurrentDiscussionThreadTriggerType {
  (data: {
    message: string;
    parentId?: number;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * DeleteCurrentDiscussionThreadTriggerType
 */
export interface DeleteCurrentDiscussionThreadTriggerType {
  (data: { success?: () => any; fail?: () => any }): AnyActionType;
}

/**
 * DeleteDiscussionThreadReplyFromCurrentTriggerType
 */
export interface DeleteDiscussionThreadReplyFromCurrentTriggerType {
  (data: {
    reply: DiscussionThreadReplyType;
    success?: () => any;
    fail?: () => any;
  }): AnyActionType;
}

/**
 * ModifyReplyFromCurrentThreadTriggerType
 */
export interface ModifyReplyFromCurrentThreadTriggerType {
  (data: {
    reply: DiscussionThreadReplyType;
    message: string;
    success?: () => any;
    fail?: () => any;
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        const subscribedThread: DiscussionSubscribedThread = <
          DiscussionSubscribedThread
        >await promisify(
          mApi().forum.areas.threads.toggleSubscription.create(
            data.areaId,
            data.threadId
          ),
          "callback"
        )();

        const subscribedThreadList = [...state.discussion.subscribedThreads];

        subscribedThreadList.push(subscribedThread);

        dispatch({
          type: "UPDATE_SUBSCRIBED_THREAD_LIST",
          payload: subscribedThreadList,
        });
      } catch (err) {
        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: <DiscussionStateType>"ERROR",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        await promisify(
          mApi().forum.areas.threads.toggleSubscription.create(
            data.areaId,
            data.threadId
          ),
          "callback"
        )();

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
        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: <DiscussionStateType>"ERROR",
        });
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();

      try {
        const subscribedThreadList: DiscussionSubscribedThread[] = <
          DiscussionSubscribedThread[]
        >await promisify(
          mApi().forum.subscriptionThreads.read(state.status.userId),
          "callback"
        )();

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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      //Remove the current message
      if (!data.notRemoveCurrent) {
        dispatch({
          type: "SET_CURRENT_DISCUSSION_THREAD",
          payload: null,
        });
      }
      dispatch({
        type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
        payload: <DiscussionStateType>"WAIT",
      });

      const state = getState();
      const discussion: DiscussionType = state.discussion;

      //Avoid loading if it's the same area
      if (
        !data.forceRefresh &&
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
            payload: <DiscussionStateType>"LOADING",
          });

          //Calculate the amount of pages
          let allThreadNumber = 0;
          if (data.areaId) {
            const area: DiscussionAreaType = discussion.areas.find(
              (area: DiscussionAreaType) => area.id === data.areaId
            );
            allThreadNumber = area.numThreads;
          } else {
            discussion.areas.forEach((area: DiscussionAreaType) => {
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

          const params = {
            firstResult,
            maxResults: MAX_LOADED_AT_ONCE,
          };

          try {
            const threads: DiscussionThreadListType = <
              DiscussionThreadListType
            >await promisify(
              discussion.workspaceId
                ? data.areaId
                  ? mApi().workspace.workspaces.forumAreas.threads.read(
                      discussion.workspaceId,
                      data.areaId,
                      params
                    )
                  : mApi().workspace.workspaces.forumLatest.read(
                      discussion.workspaceId,
                      params
                    )
                : data.areaId
                ? mApi().forum.areas.threads.read(data.areaId, params)
                : mApi().forum.latest.read(params),
              "callback"
            )();

            //Create the payload for updating all the communicator properties
            const payload: DiscussionPatchType = {
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
            if (!(err instanceof MApiError)) {
              throw err;
            }
            //Error :(
            dispatch(
              notificationActions.displayNotification(err.message, "error")
            );
            dispatch({
              type: "UPDATE_DISCUSSION_THREADS_STATE",
              payload: <DiscussionStateType>"ERROR",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      if (!data.title) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.discussion.errormessage.createMessage.missing.title"
            ),
            "error"
          )
        );
      } else if (!data.message) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.discussion.errormessage.createMessage.missing.content"
            ),
            "error"
          )
        );
      }

      try {
        const discussion: DiscussionType = getState().discussion;
        const params = {
          forumAreaId: data.forumAreaId,
          locked: data.locked,
          message: data.message,
          sticky: data.sticky,
          title: data.title,
        };
        const newThread = <DiscussionThreadType>(
          await promisify(
            discussion.workspaceId
              ? mApi().workspace.workspaces.forumAreas.threads.create(
                  discussion.workspaceId,
                  data.forumAreaId,
                  params
                )
              : mApi().forum.areas.threads.create(data.forumAreaId, params),
            "callback"
          )()
        );

        window.location.hash =
          newThread.forumAreaId +
          "/" +
          (newThread.forumAreaId === discussion.areaId
            ? discussion.page
            : "1") +
          "/" +
          newThread.id +
          "/1";

        //non-ready, also area count might change, so let's reload it
        dispatch(loadDiscussionAreasFromServer());

        //since we cannot be sure how the new tread affected whatever they are looking at now, and we can't just push first
        //because we might not have the last, lets make it so that when they go back the server is called in order
        //to retrieve the data properly

        //this will do it, since it will consider the discussion thread to be in a waiting state
        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_STATE",
          payload: <DiscussionStateType>"WAIT",
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      if (!data.title) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.discussion.errormessage.createMessage.missing.title"
            ),
            "error"
          )
        );
      } else if (!data.message) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.discussion.errormessage.createMessage.missing.content"
            ),
            "error"
          )
        );
      }

      try {
        const payload: DiscussionThreadType = Object.assign({}, data.thread, {
          title: data.title,
          message: data.message,
          sticky: data.sticky,
          locked: data.locked,
        });
        const discussion: DiscussionType = getState().discussion;
        const newThread = <DiscussionThreadType>(
          await promisify(
            discussion.workspaceId
              ? mApi().workspace.workspaces.forumAreas.threads.update(
                  discussion.workspaceId,
                  data.thread.forumAreaId,
                  data.thread.id,
                  payload
                )
              : mApi().forum.areas.threads.update(
                  data.thread.forumAreaId,
                  data.thread.id,
                  payload
                ),
            "callback"
          )()
        );
        dispatch({
          type: "UPDATE_DISCUSSION_THREAD",
          payload: newThread,
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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion: DiscussionType = state.discussion;

      //Avoid loading if it's the same thread that has been loaded already
      if (
        discussion.current &&
        discussion.current.id === data.threadId &&
        discussion.currentPage === data.threadPage
      ) {
        return;
      }

      const actualThreadPage = data.threadPage || discussion.currentPage;
      const actualPage = data.page || discussion.page;

      dispatch({
        type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
        payload: <DiscussionStateType>"LOADING",
      });

      //Generate the api query, our first result in the pages that we have loaded multiplied by how many result we get
      const firstResult = (actualThreadPage - 1) * MAX_LOADED_AT_ONCE;

      const params = {
        firstResult,
        maxResults: MAX_LOADED_AT_ONCE,
      };

      try {
        let newCurrentThread: DiscussionThreadType = discussion.threads.find(
          (thread) => thread.id === data.threadId
        );

        if (!newCurrentThread || data.forceRefresh) {
          newCurrentThread = <DiscussionThreadType>(
            await promisify(
              discussion.workspaceId
                ? mApi().workspace.workspaces.forumAreas.threads.read(
                    discussion.workspaceId,
                    data.areaId,
                    data.threadId
                  )
                : mApi().forum.areas.threads.read(data.areaId, data.threadId),
              "callback"
            )()
          );
        }

        const pages: number =
          Math.ceil(newCurrentThread.numReplies / MAX_LOADED_AT_ONCE) || 1;

        dispatch({
          type: "SET_TOTAL_DISCUSSION_THREAD_PAGES",
          payload: pages,
        });

        const replies: DiscussionThreadReplyListType = <
          DiscussionThreadReplyListType
        >await promisify(
          discussion.workspaceId
            ? mApi().workspace.workspaces.forumAreas.threads.replies.read(
                discussion.workspaceId,
                data.areaId,
                data.threadId,
                params
              )
            : mApi().forum.areas.threads.replies.read(
                data.areaId,
                data.threadId,
                params
              ),
          "callback"
        )();

        const newThreads: DiscussionThreadListType =
          state.discussion.threads.map((thread: DiscussionThreadType) => {
            if (thread.id !== newCurrentThread.id) {
              return thread;
            }
            return newCurrentThread;
          });

        const newProps: DiscussionPatchType = {
          current: newCurrentThread,
          currentReplies: replies,
          currentState: "READY",
          page: actualPage,
          currentPage: actualThreadPage,
          threads: newThreads,
        };

        //In a nutshell, if I go from all areas to a specific thread, then once going back it will cause it to load twice
        //back as it will detect a change of area, from a specific area to all areas.
        //this is only worth setting if the load happened in the specific area, that is the discussion threads state is not
        //ready but the current one is
        if (discussion.state !== "READY") {
          newProps.areaId = data.areaId;
        }

        dispatch({
          type: "UPDATE_DISCUSSION_THREADS_ALL_PROPERTIES",
          payload: newProps,
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        //Error :(
        dispatch(notificationActions.displayNotification(err.message, "error"));
        dispatch({
          type: "UPDATE_DISCUSSION_CURRENT_THREAD_STATE",
          payload: <DiscussionStateType>"ERROR",
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const payload: any = {
        message: data.message,
      };

      if (data.parentId) {
        payload.parentReplyId = data.parentId;
      }

      const state = getState();
      const discussion: DiscussionType = state.discussion;

      try {
        await promisify(
          discussion.workspaceId
            ? mApi().workspace.workspaces.forumAreas.threads.replies.create(
                discussion.workspaceId,
                discussion.current.forumAreaId,
                discussion.current.id,
                payload
              )
            : mApi().forum.areas.threads.replies.create(
                discussion.current.forumAreaId,
                discussion.current.id,
                payload
              ),
          "callback"
        )();

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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion: DiscussionType = state.discussion;

      try {
        await promisify(
          discussion.workspaceId
            ? mApi().workspace.workspaces.forumAreas.threads.del(
                discussion.workspaceId,
                discussion.current.forumAreaId,
                discussion.current.id
              )
            : mApi().forum.areas.threads.del(
                discussion.current.forumAreaId,
                discussion.current.id
              ),
          "callback"
        )();
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
        if (!(err instanceof MApiError)) {
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
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion: DiscussionType = state.discussion;

      try {
        await promisify(
          discussion.workspaceId
            ? mApi().workspace.workspaces.forumAreas.threads.replies.del(
                discussion.workspaceId,
                discussion.current.forumAreaId,
                discussion.current.id,
                data.reply.id
              )
            : mApi().forum.areas.threads.replies.del(
                discussion.current.forumAreaId,
                discussion.current.id,
                data.reply.id
              ),
          "callback"
        )();

        dispatch(
          loadDiscussionThreadFromServer({
            areaId: discussion.current.forumAreaId,
            threadId: discussion.current.id,
            success: data.success,
            fail: data.fail,
          })
        );
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }
        dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.discussion.errormessage.deleteReply"
            ),
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const state = getState();
      const discussion: DiscussionType = state.discussion;

      try {
        const newReplyMod = Object.assign({}, data.reply, {
          message: data.message,
        });
        const newReply = <DiscussionThreadReplyType>(
          await promisify(
            discussion.workspaceId
              ? mApi().workspace.workspaces.forumAreas.threads.replies.update(
                  discussion.workspaceId,
                  discussion.current.forumAreaId,
                  discussion.current.id,
                  data.reply.id,
                  newReplyMod
                )
              : mApi().forum.areas.threads.replies.update(
                  discussion.current.forumAreaId,
                  discussion.current.id,
                  data.reply.id,
                  newReplyMod
                ),
            "callback"
          )()
        );

        dispatch({
          type: "UPDATE_DISCUSSION_THREAD_REPLY",
          payload: newReply,
        });

        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
  (callback?: () => any): AnyActionType;
}

/**
 * loadDiscussionAreasFromServer
 * @param callback callback
 * @returns dispatch
 */
const loadDiscussionAreasFromServer: LoadDiscussionAreasFromServerTriggerType =
  function loadDiscussionAreasFromServer(callback) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const discussion: DiscussionType = getState().discussion;
      try {
        dispatch({
          type: "UPDATE_DISCUSSION_AREAS",
          payload: <DiscussionAreaListType>(
            await promisify(
              discussion.workspaceId
                ? mApi().workspace.workspaces.forumAreas.read(
                    discussion.workspaceId
                  )
                : mApi().forum.areas.read(),
              "callback"
            )()
          ),
        });
        callback && callback();
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
    success?: () => any;
    fail?: () => any;
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      if (!data.name) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.discussion.errormessage.createForumArea.missing.areaName"
            ),
            "error"
          )
        );
      }

      try {
        const discussion: DiscussionType = getState().discussion;
        const params = {
          name: data.name,
          description: data.description,
        };
        const newArea = <DiscussionAreaType>(
          await promisify(
            discussion.workspaceId
              ? mApi().workspace.workspaces.forumAreas.create(
                  discussion.workspaceId,
                  params
                )
              : mApi().forum.areas.create(params),
            "callback"
          )()
        );
        dispatch({
          type: "PUSH_DISCUSSION_AREA_LAST",
          payload: newArea,
        });
        location.hash = "#" + newArea.id;
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
    success?: () => any;
    fail?: () => any;
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
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      if (!data.name) {
        data.fail && data.fail();
        return dispatch(
          notificationActions.displayNotification(
            getState().i18n.text.get(
              "plugin.discussion.errormessage.createForumArea.missing.areaName"
            ),
            "error"
          )
        );
      }

      try {
        const discussion: DiscussionType = getState().discussion;
        const params = {
          name: data.name,
          description: data.description,
        };
        await promisify(
          discussion.workspaceId
            ? mApi().workspace.workspaces.forumAreas.update(
                discussion.workspaceId,
                data.id,
                params
              )
            : mApi().forum.areas.update(data.id, params),
          "callback"
        )();
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
        if (!(err instanceof MApiError)) {
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
  (data: { id: number; success?: () => any; fail?: () => any }): AnyActionType;
}

/**
 * deleteDiscussionArea
 * @param data data
 * @returns dispatch
 */
const deleteDiscussionArea: DeleteDiscussionAreaTriggerType =
  function deleteDiscussionArea(data) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      try {
        const discussion: DiscussionType = getState().discussion;
        await promisify(
          discussion.workspaceId
            ? mApi().workspace.workspaces.forumAreas.del(
                discussion.workspaceId,
                data.id
              )
            : mApi().forum.areas.del(data.id),
          "callback"
        )();
        location.hash = "";
        dispatch({
          type: "DELETE_DISCUSSION_AREA",
          payload: data.id,
        });
        data.success && data.success();
      } catch (err) {
        if (!(err instanceof MApiError)) {
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
