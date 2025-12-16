import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { WorkspaceJournalFeedback } from "~/reducers/workspaces/journals";
import { WorkspaceJournalEntry } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";
import { useTranslation } from "react-i18next";

/**
 * UseFollowUpGoalsState
 */
export interface UseDiariesState {
  isLoading: boolean;
  journals: WorkspaceJournalEntry[];
  journalFeedback: WorkspaceJournalFeedback | null;
}

/**
 * Intial state
 */
const initialState: UseDiariesState = {
  isLoading: false,
  journals: [],
  journalFeedback: null,
};

const evaluationApi = MApi.getEvaluationApi();
const workspaceApi = MApi.getWorkspaceApi();

/**
 * Custom hook for student study hours
 * @param userEntityId userEntityId
 * @param workspaceId workspaceId
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useJournals = (
  userEntityId: number,
  workspaceId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const { t } = useTranslation(["studies", "common"]);

  const [journalsData, setJournalsData] = React.useState(initialState);

  React.useEffect(() => {
    let isCancelled = false;

    /**
     * loadStudentActivityListData
     * Loads student activity data
     * @param userEntityId of student
     * @param workspaceId of student
     */
    const loadJournalsData = async (
      userEntityId: number,
      workspaceId: number
    ) => {
      if (!isCancelled) {
        setJournalsData((journalsData) => ({
          ...journalsData,
          isLoading: true,
        }));
      }

      try {
        /**
         * Loaded and filtered student activity
         */
        const [journals, journalFeedback] = await Promise.all([
          (async () => {
            const journals = await workspaceApi.getWorkspaceJournals({
              workspaceId,
              userEntityId,
              firstResult: 0,
              maxResults: 512,
            });
            return journals;
          })(),
          (async () => {
            const journalFeedback =
              await evaluationApi.getWorkspaceStudentJournalFeedback({
                workspaceId,
                studentEntityId: userEntityId,
              });

            return journalFeedback;
          })(),
        ]);

        if (!isCancelled) {
          setJournalsData((journalsData) => ({
            ...journalsData,
            journals: journals,
            journalFeedback: journalFeedback,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          if (!isMApiError(err)) {
            throw err;
          }

          displayNotification(
            `${t("notifications.loadError", {
              ns: "studies",
              context: "workspaceJournal",
            })}, ${err.message}`,
            "error"
          );
          setJournalsData((journalsData) => ({
            ...journalsData,
            isLoading: false,
          }));
        }
      }
    };

    loadJournalsData(userEntityId, workspaceId);

    return () => {
      isCancelled = true;
    };
  }, [userEntityId, workspaceId, displayNotification, t]);

  return {
    journalsData,
  };
};
