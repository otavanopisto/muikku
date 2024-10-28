import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { MaterialCompositeReply } from "~/generated/client";

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
export interface CompositeReplyState {
  isPointsLoading: boolean;
  compositeReplies: MaterialCompositeReply[];
}

/**
 * Intial state
 */
const initialCompositeReplyState: CompositeReplyState = {
  isPointsLoading: false,
  compositeReplies: [],
};

const workspaceApi = MApi.getWorkspaceApi();

/**
 * useWorkspacePoints
 * @param props UseWorkspacePointsProps
 */
export const useWorkspacePoints = (props: UseWorkspacePointsProps) => {
  const { workspaceId, userEntityId, enabled, displayNotification } = props;
  const { t } = useTranslation(["studies", "common"]);

  const [compositeReplyData, setCompositeReplyData] = React.useState(
    initialCompositeReplyState
  );

  // Add ref to track if data was already loaded
  const wasLoaded = React.useRef(false);

  React.useEffect(() => {
    // Skip if not enabled or if already loaded
    if (compositeReplyData.isPointsLoading || !enabled || wasLoaded.current) {
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
        setCompositeReplyData((compositeReplyData) => ({
          ...compositeReplyData,
          isLoading: true,
        }));
      }

      try {
        /**
         * Loaded and filtered student activity
         */
        const [compositeReplies] = await Promise.all([
          (async () => {
            const compositeRepliesList =
              await workspaceApi.getWorkspaceCompositeReplies({
                workspaceEntityId: workspaceId,
                userEntityId: userEntityId,
              });

            return compositeRepliesList;
          })(),
        ]);

        if (!isCancelled) {
          setCompositeReplyData((compositeReplyData) => ({
            ...compositeReplyData,
            compositeReplies: compositeReplies,
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
              context: "workspaceCompositeReplies",
            })}, ${err.message}`,
            "error"
          );
          setCompositeReplyData((compositeReplyData) => ({
            ...compositeReplyData,
            isLoading: false,
          }));
        }
      }
    };

    loadCompositeReplies(userEntityId, workspaceId);

    return () => {
      isCancelled = true;
    };
  }, [
    workspaceId,
    displayNotification,
    t,
    userEntityId,
    enabled,
    compositeReplyData.isPointsLoading,
  ]);

  const { compositeReplies, isPointsLoading } = compositeReplyData;

  const points = useMemo(() => {
    if (isPointsLoading) {
      return undefined;
    }

    return compositeReplies.reduce<number | undefined>((acc, curr) => {
      const currentPoints = curr.evaluationInfo?.points;
      if (currentPoints === undefined) return acc;
      return (acc ?? 0) + currentPoints;
    }, undefined);
  }, [compositeReplies, isPointsLoading]);

  return {
    points,
    isPointsLoading,
  };
};
