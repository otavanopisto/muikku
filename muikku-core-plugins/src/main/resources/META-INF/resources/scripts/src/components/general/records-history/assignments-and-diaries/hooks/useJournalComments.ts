import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { WorkspaceJournalComment } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { useTranslation } from "react-i18next";

/**
 * UseFollowUpGoalsState
 */
export interface UseJournalCcmmentsState {
  isLoading: boolean;
  journalComments: WorkspaceJournalComment[];
}

/**
 * Intial state
 */
const initialState: UseJournalCcmmentsState = {
  isLoading: false,
  journalComments: [],
};

const workspaceApi = MApi.getWorkspaceApi();

/**
 * Custom hook for student study hours
 * @param workspaceId workspaceId
 * @param journalEntryId journalEntryId
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useJournalComments = (
  workspaceId: number,
  journalEntryId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [journalComments, setJournalComments] = React.useState(initialState);
  const { t } = useTranslation("journal");

  const isCancelled = React.useRef(false);

  React.useEffect(
    () => () => {
      isCancelled.current = true;
    },
    []
  );

  /**
   * Loads student journal entry comments
   */
  const loadJournalComments = async () => {
    if (!isCancelled.current) {
      setJournalComments((journalsData) => ({
        ...journalsData,
        isLoading: true,
      }));
    }

    try {
      /**
       * Loaded and filtered student activity
       */
      const [comments] = await Promise.all([
        (async () => {
          const journals = await workspaceApi.getWorkspaceJournalComments({
            workspaceId,
            journalEntryId,
          });
          return journals;
        })(),
      ]);

      if (!isCancelled.current) {
        setJournalComments((commentsData) => ({
          ...commentsData,
          journalComments: comments,
          isLoading: false,
        }));
      }
    } catch (err) {
      if (!isCancelled.current) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(
          `${t("notifications.loadError", { context: "comments" })}, ${
            err.message
          }`,
          "error"
        );
        setJournalComments((commentsData) => ({
          ...commentsData,
          isLoading: false,
        }));
      }
    }
  };

  return {
    journalComments,
    // eslint-disable-next-line jsdoc/require-jsdoc
    loadJournalComments: () => loadJournalComments(),
  };
};
