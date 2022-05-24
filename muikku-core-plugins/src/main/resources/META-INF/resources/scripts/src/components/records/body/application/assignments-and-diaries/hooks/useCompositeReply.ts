import * as React from "react";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import { MaterialCompositeRepliesType } from "~/reducers/workspaces";

/**
 * UseFollowUpGoalsState
 */
export interface UseCompositeReplyState {
  isLoading: boolean;
  compositeReplies: MaterialCompositeRepliesType[];
}

/**
 * Intial state
 */
const initialState: UseCompositeReplyState = {
  isLoading: false,
  compositeReplies: [],
};

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
              <MaterialCompositeRepliesType[]>await promisify(
                mApi().workspace.workspaces.compositeReplies.read(workspaceId, {
                  userEntityId,
                }),
                "callback"
              )() || [];

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
          displayNotification(`Hups errori, ${err.message}`, "error");
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
  }, [userEntityId, workspaceId, displayNotification]);

  return {
    compositeReplyData,
  };
};
