import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceJournalType } from "~/reducers/workspaces/journals";
import MApi, { isMApiError } from "~/api/api";
import { EvaluationJournalFeedback } from "~/generated/client";

/**
 * UseFollowUpGoalsState
 */
export interface UseDiariesState {
  isLoading: boolean;
  journals: WorkspaceJournalType[];
  journalFeedback: EvaluationJournalFeedback | null;
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

/**
 * Custom hook for student study hours
 * @param userEntityId userEntityId
 * @param workspaceId workspaceId
 * @param i18n i18nType
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useJournals = (
  userEntityId: number,
  workspaceId: number,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType
) => {
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
            const journals = <WorkspaceJournalType[]>await promisify(
              mApi().workspace.workspaces.journal.read(workspaceId, {
                userEntityId,
                firstResult: 0,
                maxResults: 512,
              }),
              "callback"
            )();
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
            `${i18n.text.get(
              "plugin.records.errormessage.workspaceDiaryLoadFailed"
            )}, ${err.message}`,
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
  }, [userEntityId, workspaceId, displayNotification, i18n]);

  return {
    journalsData,
  };
};
