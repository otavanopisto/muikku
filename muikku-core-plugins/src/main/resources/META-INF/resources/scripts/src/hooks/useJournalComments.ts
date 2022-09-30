import * as React from "react";
import mApi from "~/lib/mApi";
import { sleep } from "~/helper-functions/shared";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import {
  JournalComment,
  JournalCommentCreate,
  JournalCommentDelete,
  JournalCommentUpdate,
} from "~/@types/journal";

/**
 * UseStudentActivityState
 */
export interface UseJournalCommentsState {
  isLoading: boolean;
  isSaving: boolean;
  comments?: JournalComment[];
}

/**
 * Custom hook to return student activity data
 * @param workspaceId workspaceId
 * @param journalEntryId journalEntryId
 * @param displayNotification displayNotification
 */
export const useJournalComments = (
  workspaceId: number,
  journalEntryId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [journalComments, setJournalComments] =
    React.useState<UseJournalCommentsState>({
      isLoading: false,
      isSaving: false,
    });

  const componentMounted = React.useRef(true);

  /**
   * State ref to containging studentActivity state data
   * when ever student activity state changes, so does this ref
   * This is because when websocket handler catches, it always have latest
   * state changes to use
   */
  const ref = React.useRef(journalComments);

  React.useEffect(() => {
    ref.current = journalComments;
  }, [journalComments]);

  /**
   * loadStudentActivityListData
   * Loads student activity data
   * @param studentId of student
   */
  const loadJournalComments = React.useCallback(async () => {
    setJournalComments((studentActivity) => ({
      ...studentActivity,
      isLoading: true,
    }));

    try {
      /**
       * Sleeper to delay data fetching if it happens faster than 1s
       */
      const sleepPromise = await sleep(1000);

      /**
       * Loaded and filtered student activity
       */
      const [journalCommentsLoaded] = await Promise.all([
        (async () => {
          const diaryCommentList = (await promisify(
            mApi().workspace.workspaces.journal.comments.read(
              workspaceId,
              journalEntryId
            ),
            "callback"
          )()) as JournalComment[];

          return diaryCommentList;
        })(),
        sleepPromise,
      ]);

      if (componentMounted.current) {
        setJournalComments({
          isLoading: false,
          isSaving: false,
          comments: journalCommentsLoaded,
        });
      }
    } catch (err) {
      if (componentMounted.current) {
        displayNotification(`Loading diary comments:, ${err.message}`, "error");
        setJournalComments({
          isLoading: false,
          isSaving: false,
          comments: [],
        });
      }
    }
  }, [displayNotification, journalEntryId, workspaceId]);

  /**
   * createComment
   * Updates one comments data
   * @param payload payload
   */
  const createComment = React.useCallback(
    async (
      payload: JournalCommentCreate,
      onSucces?: () => void,
      onFail?: () => void
    ) => {
      setJournalComments((journalComments) => ({
        ...journalComments,
        isLoading: false,
        isSaving: true,
      }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded and filtered student activity
         */
        const [journalCommentsUpdated] = await Promise.all([
          (async () => {
            const newComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.create(
                workspaceId,
                journalEntryId,
                payload
              ),
              "callback"
            )()) as JournalComment;

            const updatedCommentList = [...journalComments.comments];

            updatedCommentList.push(newComment);

            return updatedCommentList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setJournalComments({
            isLoading: false,
            isSaving: false,
            comments: journalCommentsUpdated,
          });

          if (onSucces) {
            onSucces();
          }
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Create diary comment:, ${err.message}`, "error");
          setJournalComments({
            isLoading: false,
            isSaving: false,
            comments: [],
          });

          if (onFail) {
            onFail();
          }
        }
      }
    },
    [displayNotification, journalEntryId, workspaceId, journalComments.comments]
  );

  /**
   * updateComment
   * Updates one comments data
   * @param payload payload
   */
  const updateComment = React.useCallback(
    async (
      payload: JournalCommentUpdate,
      onSuccess?: () => void,
      onFail?: () => void
    ) => {
      setJournalComments((journalComments) => ({
        ...journalComments,
        isSaving: true,
      }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded and filtered student activity
         */
        const [journalCommentsUpdated] = await Promise.all([
          (async () => {
            const updatedComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.update(
                workspaceId,
                journalEntryId,
                payload.id,
                payload
              ),
              "callback"
            )()) as JournalComment;

            const updatedCommentList = [...journalComments.comments];

            const commentIndex = updatedCommentList.findIndex(
              (uC) => uC.id === updatedComment.id
            );

            updatedCommentList.splice(commentIndex, 1, updatedComment);

            return updatedCommentList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setJournalComments((journalComments) => ({
            ...journalComments,
            isSaving: false,
            comments: journalCommentsUpdated,
          }));

          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(
            `Updating diary comment:, ${err.message}`,
            "error"
          );
          setJournalComments((journalComments) => ({
            ...journalComments,
            isSaving: false,
            journalComments: [],
          }));
        }
      }
    },
    [displayNotification, journalEntryId, workspaceId, journalComments.comments]
  );

  /**
   * updateComment
   * Updates one comments data
   * @param payload payload
   */
  const deleteCommentById = React.useCallback(
    async (
      payload: JournalCommentDelete,
      onSuccess?: () => void,
      onFail?: () => void
    ) => {
      setJournalComments((journalComments) => ({
        ...journalComments,
        isLoading: false,
      }));

      try {
        /**
         * Sleeper to delay data fetching if it happens faster than 1s
         */
        const sleepPromise = await sleep(1000);

        /**
         * Loaded and filtered student activity
         */
        const [journalCommentsUpdated] = await Promise.all([
          (async () => {
            await promisify(
              mApi().workspace.workspaces.journal.comments.del(
                workspaceId,
                journalEntryId,
                payload.id
              ),
              "callback"
            )();

            const updatedCommentList = [...journalComments.comments];

            const commentIndex = updatedCommentList.findIndex(
              (uC) => uC.id === payload.id
            );

            updatedCommentList.splice(commentIndex, 1);

            return updatedCommentList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setJournalComments((journalComments) => ({
            ...journalComments,
            journalComments: journalCommentsUpdated,
          }));

          if (onSuccess) {
            onSuccess();
          }
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(
            `Updating diary comment:, ${err.message}`,
            "error"
          );

          setJournalComments((journalComments) => ({
            ...journalComments,
          }));
        }
      }
    },
    [displayNotification, journalEntryId, workspaceId, journalComments.comments]
  );

  return {
    journalComments,

    /**
     * loadDiaryComments
     */
    loadJournalComments: () => loadJournalComments(),
    /**
     * createComment
     * @param newComment newComment
     * @param onSuccess onSuccess
     * @param onFail onFail
     */
    createComment: (
      newComment: JournalCommentCreate,
      onSuccess?: () => void,
      onFail?: () => void
    ) => createComment(newComment, onSuccess, onFail),
    /**
     * updateComment
     * @param updatedComment updatedComment
     * @param onSuccess onSuccess
     * @param onFail onFail
     */
    updateComment: (
      updatedComment: JournalCommentUpdate,
      onSuccess?: () => void,
      onFail?: () => void
    ) => updateComment(updatedComment, onSuccess, onFail),
    /**
     * deleteComment
     * @param deleteComment deleteComment
     * @param onSuccess onSuccess
     * @param onFail onFail
     */
    deleteComment: (
      deleteComment: JournalCommentDelete,
      onSuccess?: () => void,
      onFail?: () => void
    ) => deleteCommentById(deleteComment, onSuccess, onFail),
  };
};
