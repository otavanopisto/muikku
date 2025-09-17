import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { createAssignmentInfoArray } from "~/components/general/evaluation-assessment-details/helper";
import { MaterialCompositeReply, WorkspaceMaterial } from "~/generated/client";

/**
 * UseWorkspacePointsProps
 */
interface UseWorkspacePointsProps {
  workspaceId: number;
  userEntityId: number;
  enabled: boolean;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * UseFollowUpGoalsState
 */
export interface WorkspaceAssignmentInfoState {
  assignmentInfoLoading: boolean;
  compositeReplies: MaterialCompositeReply[];
  assignments: WorkspaceMaterial[];
}

/**
 * Intial state
 */
const initialWorkspaceAssignmentInfoState: WorkspaceAssignmentInfoState = {
  assignmentInfoLoading: false,
  compositeReplies: [],
  assignments: [],
};

const workspaceApi = MApi.getWorkspaceApi();

/**
 * useWorkspacePoints
 * @param props UseWorkspacePointsProps
 */
export const useWorkspaceAssignmentInfo = (props: UseWorkspacePointsProps) => {
  const { workspaceId, userEntityId, enabled, displayNotification } = props;
  const { t } = useTranslation(["evaluation", "common"]);

  const [workspaceAssignmentInfoState, setWorkspaceAssignmentInfoState] =
    React.useState(initialWorkspaceAssignmentInfoState);

  // Add ref to track if data was already loaded
  const wasLoaded = React.useRef(false);

  React.useEffect(() => {
    // Skip if not enabled or if already loaded
    if (!enabled || wasLoaded.current) {
      return;
    }

    let isCancelled = false;

    // Mark as loaded
    wasLoaded.current = true;

    /**
     * loadCompositeReplies
     * Loads student activity data
     * @param userEntityId of student
     * @param workspaceId of student
     */
    const loadCompositeReplies = async (
      userEntityId: number,
      workspaceId: number
    ) => {
      if (!isCancelled) {
        setWorkspaceAssignmentInfoState((workspaceAssignmentInfoState) => ({
          ...workspaceAssignmentInfoState,
          assignmentInfoLoading: true,
        }));
      }

      try {
        /**
         * Loaded and filtered student activity
         */
        const [compositeReplies, assignments] = await Promise.all([
          (async () => {
            const compositeRepliesList =
              await workspaceApi.getWorkspaceCompositeReplies({
                workspaceEntityId: workspaceId,
                userEntityId: userEntityId,
              });

            return compositeRepliesList;
          })(),
          (async () => {
            const assignments = await workspaceApi.getWorkspaceMaterials({
              workspaceEntityId: workspaceId,
              assignmentType: "EVALUATED",
              userEntityId: userEntityId,
            });

            return assignments;
          })(),
        ]);

        if (!isCancelled) {
          setWorkspaceAssignmentInfoState((workspaceAssignmentInfoState) => ({
            ...workspaceAssignmentInfoState,
            compositeReplies: compositeReplies,
            assignments: assignments,
            assignmentInfoLoading: false,
          }));
        }
      } catch (err) {
        if (!isCancelled) {
          if (!isMApiError(err)) {
            throw err;
          }

          displayNotification(
            `${t("notifications.loadError", {
              ns: "evaluation",
              context: "assignmentData",
            })}, ${err.message}`,
            "error"
          );
          setWorkspaceAssignmentInfoState((workspaceAssignmentInfoState) => ({
            ...workspaceAssignmentInfoState,
            assignmentInfoLoading: false,
          }));
        }
      }
    };

    loadCompositeReplies(userEntityId, workspaceId);

    return () => {
      isCancelled = true;
    };
  }, [workspaceId, displayNotification, t, userEntityId, enabled]);

  const { compositeReplies, assignments, assignmentInfoLoading } =
    workspaceAssignmentInfoState;

  const assignmentInfo = useMemo(
    () => createAssignmentInfoArray(compositeReplies, assignments),
    [compositeReplies, assignments]
  );

  return {
    assignmentInfo,
    assignmentInfoLoading,
  };
};
