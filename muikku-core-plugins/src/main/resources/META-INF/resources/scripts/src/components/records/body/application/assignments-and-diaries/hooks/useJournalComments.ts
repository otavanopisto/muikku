import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { JournalComment } from "~/@types/journal";
import { useTranslation } from "react-i18next";

/**
 * UseFollowUpGoalsState
 */
export interface UseJournalCcmmentsState {
  isLoading: boolean;
  journalComments: JournalComment[];
}

/**
 * Intial state
 */
const initialState: UseJournalCcmmentsState = {
  isLoading: false,
  journalComments: [],
};

/**
 * Custom hook for student study hours
 * @param workspaceId workspaceId
 * @param journalEntryId journalEntryId
 * @param i18n i18nType
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
          const journals = <JournalComment[]>(
            await promisify(
              mApi().workspace.workspaces.journal.comments.read(
                workspaceId,
                journalEntryId
              ),
              "callback"
            )()
          );
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
