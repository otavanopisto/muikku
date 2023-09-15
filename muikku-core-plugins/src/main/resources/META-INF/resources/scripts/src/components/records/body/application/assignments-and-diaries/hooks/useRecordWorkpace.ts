import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import MApi from "~/api/api";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentsState {
  isLoading: boolean;
  workspace: WorkspaceType;
}

const recordsApi = MApi.getRecordsApi();

/**
 * Custom hook for student study hours
 *
 * @param userEntityId userEntityId
 * @param workspaceId workspaceId
 * @param i18n i18nType
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useRecordWorkspace = (
  userEntityId: string,
  workspaceId: number,
  i18n: i18nType,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [recordWorkspace, setRecordWorkspace] =
    React.useState<UseAssignmentsState>({
      isLoading: false,
      workspace: null,
    });

  React.useEffect(() => {
    let isCancelled = false;

    /**
     * loadStudentActivityListData
     * Loads student activity data
     * @param workspaceId of student
     */
    const loadRecordWorkspace = async (workspaceId: number) => {
      if (!isCancelled) {
        setRecordWorkspace((recordWorkspaceData) => ({
          ...recordWorkspaceData,
          isLoading: true,
        }));
      }

      try {
        /**
         * Loaded and filtered student activity
         */
        const workspace = (await recordsApi.getRecordsWorkspace({
          workspaceId: workspaceId,
          userIdentifier: userEntityId,
        })) as WorkspaceType;

        if (!isCancelled) {
          setRecordWorkspace((recordWorkspaceData) => ({
            ...recordWorkspaceData,
            workspace: workspace,
            isLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          displayNotification(
            `${i18n.text.get(
              "plugin.records.errormessage.workspaceAssignmentsEvaluatedLoadFailed"
            )}, ${err.message}`,
            "error"
          );
          setRecordWorkspace((recordWorkspaceData) => ({
            ...recordWorkspaceData,
            isLoading: false,
          }));
        }
      }
    };

    loadRecordWorkspace(workspaceId);

    return () => {
      isCancelled = true;
    };
  }, [workspaceId, displayNotification, i18n, userEntityId]);

  return recordWorkspace;
};
