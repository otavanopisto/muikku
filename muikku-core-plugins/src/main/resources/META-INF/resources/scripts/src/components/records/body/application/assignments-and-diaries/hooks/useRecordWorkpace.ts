import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { WorkspaceType } from "~/reducers/workspaces";
import { useTranslation } from "react-i18next";
import workspace from "~/reducers/workspace";

/**
 * UseFollowUpGoalsState
 */
export interface UseAssignmentsState {
  isLoading: boolean;
  workspace: WorkspaceType;
}

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
  displayNotification: DisplayNotificationTriggerType
) => {
  const [recordWorkspace, setRecordWorkspace] =
    React.useState<UseAssignmentsState>({
      isLoading: false,
      workspace: null,
    });

  React.useEffect(() => {
    let isCancelled = false;
    const { t } = useTranslation("studies");
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
        const workspace = (await promisify(
          mApi().records.workspaces.read(workspaceId, {
            userIdentifier: userEntityId,
          }),
          "callback"
        )()) as WorkspaceType;

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
