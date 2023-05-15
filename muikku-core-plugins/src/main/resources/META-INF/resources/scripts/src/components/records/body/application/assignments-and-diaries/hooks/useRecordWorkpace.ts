import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";

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
