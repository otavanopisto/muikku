import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { useTranslation } from "react-i18next";
import { MaterialCompositeReply } from "~/generated/client";
import MApi, { isMApiError } from "~/api/api";

/**
 * UseFollowUpGoalsState
 */
export interface UseCompositeReplyState {
  isLoading: boolean;
  compositeReplies: MaterialCompositeReply[];
}

/**
 * Intial state
 */
const initialState: UseCompositeReplyState = {
  isLoading: false,
  compositeReplies: [],
};

const workspaceApi = MApi.getWorkspaceApi();

/**
 * Custom hook for student study hours
 *
 * @param userEntityId userEntityId
 * @param workspaceId workspaceId
 * @param displayNotification displayNotification
 * @returns student study hours
 */
export const useCompositeReply = (
  userEntityId: number,
  workspaceId: number,
  displayNotification: DisplayNotificationTriggerType
) => {
  const { t } = useTranslation(["studies", "common"]);

  const [compositeReplyData, setCompositeReplyData] =
    React.useState(initialState);

  React.useEffect(() => {
    let isCancelled = false;

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
  }, [userEntityId, workspaceId, displayNotification, t]);

  return {
    compositeReplyData,
  };
};
