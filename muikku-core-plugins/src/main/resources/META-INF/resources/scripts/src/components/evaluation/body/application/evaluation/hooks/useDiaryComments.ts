import * as React from "react";
import mApi from "~/lib/mApi";
import { sleep } from "~/helper-functions/shared";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

/**
 * DiaryComment
 */
export interface DiaryComment {
  id: number;
  journalEntryId: number;
  parentCommentId: number;
  depth: number;
  authorId: number;
  firstName: string;
  lastName: string;
  comment: string;
  created: Date;
  editable: boolean;
  archivable: boolean;
}

/**
 * DiaryCommentNew
 */
export interface DiaryCommentCreate {
  journalEntryId: number;
  comment: string;
}

/**
 * DiaryCommentUpdate
 */
export interface DiaryCommentUpdate {
  id: number;
  journalEntryId: number;
  comment: string;
}

/**
 * DiaryCommentDelete
 */
export interface DiaryCommentDelete {
  id: number;
  journalEntryId: number;
}

/**
 * UseStudentActivityState
 */
export interface UseDiaryCommentsState {
  isLoading: boolean;
  isSaving: boolean;
  diaryComments?: DiaryComment[];
}

/**
 * Custom hook to return student activity data
 * @param workspaceId workspaceId
 * @param journalEntryId journalEntryId
 * @param displayNotification displayNotification
 */
export const useDiaryComments = (
  workspaceId: number,
  journalEntryId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [diaryComments, setDiaryComments] =
    React.useState<UseDiaryCommentsState>({
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
  const ref = React.useRef(diaryComments);

  React.useEffect(() => {
    ref.current = diaryComments;
  }, [diaryComments]);

  /**
   * loadStudentActivityListData
   * Loads student activity data
   * @param studentId of student
   */
  const loadDiaryComments = React.useCallback(async () => {
    setDiaryComments((studentActivity) => ({
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
      const [diaryCommentsLoaded] = await Promise.all([
        (async () => {
          const diaryCommentList = (await promisify(
            mApi().workspace.workspaces.journal.comments.read(
              workspaceId,
              journalEntryId
            ),
            "callback"
          )()) as DiaryComment[];

          return diaryCommentList;
        })(),
        sleepPromise,
      ]);

      if (componentMounted.current) {
        setDiaryComments({
          isLoading: false,
          isSaving: false,
          diaryComments: diaryCommentsLoaded,
        });
      }
    } catch (err) {
      if (componentMounted.current) {
        displayNotification(`Loading diary comments:, ${err.message}`, "error");
        setDiaryComments({
          isLoading: false,
          isSaving: false,
          diaryComments: [],
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
      payload: DiaryCommentCreate,
      onSucces?: () => void,
      onFail?: () => void
    ) => {
      setDiaryComments((diaryComments) => ({
        ...diaryComments,
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
        const [diaryCommentsUpdated] = await Promise.all([
          (async () => {
            const newComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.create(
                workspaceId,
                journalEntryId,
                payload
              ),
              "callback"
            )()) as DiaryComment;

            const updatedCommentList = [...diaryComments.diaryComments];

            updatedCommentList.push(newComment);

            return updatedCommentList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setDiaryComments({
            isLoading: false,
            isSaving: false,
            diaryComments: diaryCommentsUpdated,
          });

          if (onSucces) {
            onSucces();
          }
        }
      } catch (err) {
        if (componentMounted.current) {
          displayNotification(`Create diary comment:, ${err.message}`, "error");
          setDiaryComments({
            isLoading: false,
            isSaving: false,
            diaryComments: [],
          });

          if (onFail) {
            onFail();
          }
        }
      }
    },
    [
      displayNotification,
      journalEntryId,
      workspaceId,
      diaryComments.diaryComments,
    ]
  );

  /**
   * updateComment
   * Updates one comments data
   * @param payload payload
   */
  const updateComment = React.useCallback(
    async (
      payload: DiaryCommentUpdate,
      onSuccess?: () => void,
      onFail?: () => void
    ) => {
      setDiaryComments((diaryComments) => ({
        ...diaryComments,
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
        const [diaryCommentsUpdated] = await Promise.all([
          (async () => {
            const updatedComment = (await promisify(
              mApi().workspace.workspaces.journal.comments.update(
                workspaceId,
                journalEntryId,
                payload.id,
                payload
              ),
              "callback"
            )()) as DiaryComment;

            const updatedCommentList = [...diaryComments.diaryComments];

            const commentIndex = updatedCommentList.findIndex(
              (uC) => uC.id === updatedComment.id
            );

            updatedCommentList.splice(commentIndex, 1, updatedComment);

            return updatedCommentList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setDiaryComments({
            isLoading: false,
            isSaving: false,
            diaryComments: diaryCommentsUpdated,
          });

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
          setDiaryComments({
            isLoading: false,
            isSaving: false,
            diaryComments: [],
          });
        }
      }
    },
    [
      displayNotification,
      journalEntryId,
      workspaceId,
      diaryComments.diaryComments,
    ]
  );

  /**
   * updateComment
   * Updates one comments data
   * @param payload payload
   */
  const deleteCommentById = React.useCallback(
    async (
      payload: DiaryCommentDelete,
      onSuccess?: () => void,
      onFail?: () => void
    ) => {
      setDiaryComments((diaryComments) => ({
        ...diaryComments,
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
        const [diaryCommentsUpdated] = await Promise.all([
          (async () => {
            await promisify(
              mApi().workspace.workspaces.journal.comments.del(
                workspaceId,
                journalEntryId,
                payload.id
              ),
              "callback"
            )();

            const updatedCommentList = [...diaryComments.diaryComments];

            const commentIndex = updatedCommentList.findIndex(
              (uC) => uC.id === payload.id
            );

            updatedCommentList.splice(commentIndex, 1);

            return updatedCommentList;
          })(),
          sleepPromise,
        ]);

        if (componentMounted.current) {
          setDiaryComments({
            isLoading: false,
            isSaving: false,
            diaryComments: diaryCommentsUpdated,
          });

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
          setDiaryComments({
            isLoading: false,
            isSaving: false,
            diaryComments: [],
          });
        }
      }
    },
    [
      displayNotification,
      journalEntryId,
      workspaceId,
      diaryComments.diaryComments,
    ]
  );

  return {
    diaryComments,

    /**
     * loadDiaryComments
     */
    loadDiaryComments: () => loadDiaryComments(),
    /**
     * createComment
     * @param newComment newComment
     * @param onSuccess onSuccess
     * @param onFail onFail
     */
    createComment: (
      newComment: DiaryCommentCreate,
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
      updatedComment: DiaryCommentUpdate,
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
      deleteComment: DiaryCommentDelete,
      onSuccess?: () => void,
      onFail?: () => void
    ) => deleteCommentById(deleteComment, onSuccess, onFail),
  };
};
