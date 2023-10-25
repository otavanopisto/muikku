import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { WorkspaceDataType } from "~/reducers/workspaces";
import MApi from "~/api/api";
import { useTranslation } from "react-i18next";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentsState {
  isLoading: boolean;
  workspace: WorkspaceDataType;
}

const recordsApi = MApi.getRecordsApi();

/**
 * Custom hook for student study hours
 *
 * @param userEntityId userEntityId
 * @param workspaceId workspaceId
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useRecordWorkspace = (
  userEntityId: string,
  workspaceId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const [recordWorkspace, setRecordWorkspace] =
    React.useState<UseAssignmentsState>({
      isLoading: false,
      workspace: null,
    });
  const { t } = useTranslation("studies");

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
        })) as WorkspaceDataType;

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
            t("notifications.loadError", {
              context: "workspaceAssignments",
              error: err.message,
            }),
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
  }, [workspaceId, displayNotification, userEntityId]);

  return recordWorkspace;
};
