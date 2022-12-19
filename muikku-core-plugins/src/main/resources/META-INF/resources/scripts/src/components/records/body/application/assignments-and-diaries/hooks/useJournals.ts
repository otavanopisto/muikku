import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { WorkspaceJournalType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18nOLD";

/**
 * UseFollowUpGoalsState
 */
export interface UseDiariesState {
  isLoading: boolean;
  journals: WorkspaceJournalType[];
}

/**
 * Intial state
 */
const initialState: UseDiariesState = {
  isLoading: false,
  journals: [],
};

/**
 * Custom hook for student study hours
 * @param userEntityId userEntityId
 * @param workspaceId workspaceId
 * @param i18nOLD i18nType
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useJournals = (
  userEntityId: number,
  workspaceId: number,
  i18nOLD: i18nType,
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
    const loadAssignmentData = async (
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
        const [journals] = await Promise.all([
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
        ]);

        if (!isCancelled) {
          setJournalsData((journalsData) => ({
            ...journalsData,
            journals: journals,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          displayNotification(
            `${i18nOLD.text.get(
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

    loadAssignmentData(userEntityId, workspaceId);

    return () => {
      isCancelled = true;
    };
  }, [userEntityId, workspaceId, displayNotification, i18nOLD]);

  return {
    journalsData,
  };
};
