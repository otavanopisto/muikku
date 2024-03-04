import * as React from "react";
import MApi from "~/api/api";
import { ChatActivity, ChatMessage } from "~/generated/client";
import { useBrowserFocus } from "~/hooks/useBrowserFocus";
import { useDocumentVisible } from "~/hooks/useDocumentVisible";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * Custom hook for chat activity
 * @param activeDiscussionIdentifier active identifier
 * @param currentUserIdentifier current user identifier
 */
function useChatActivity(
  activeDiscussionIdentifier: string,
  currentUserIdentifier: string
) {
  const websocket = useChatWebsocketContext();
  const documentVisible = useDocumentVisible();
  const browserFocused = useBrowserFocus();

  const [chatActivity, setChatActivity] = React.useState<ChatActivity[]>();

  const chatActivityRef = React.useRef(chatActivity);
  chatActivityRef.current = chatActivity;

  const componentMounted = React.useRef(true);

  const browserIsVisibleAndFocused = documentVisible && browserFocused;

  // Initial fetch
  React.useEffect(() => {
    fetchChatActivity();
  }, []);

  React.useEffect(() => {
    /**
     * Handles new message sent event
     * @param data data
     */
    const onNewMsgSentUpdateActivity = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

          // Skip rooms as they are not enabled yet for this functionality
          if (dataTyped.targetIdentifier.startsWith("room-")) {
            return;
          }

          // Updates the latest message date of the chat activity that the message was sent to
          setChatActivity((prev) => {
            const sourceIdentifier = `user-${dataTyped.sourceUserEntityId}`;

            // Try to find the activity in the list using the source identifier or the target identifier
            // If the current user is the source, use the target identifier
            // else use the source identifier
            const index =
              currentUserIdentifier === sourceIdentifier
                ? prev.findIndex(
                    (activity) =>
                      activity.targetIdentifier === dataTyped.targetIdentifier
                  )
                : prev.findIndex(
                    (activity) => activity.targetIdentifier === sourceIdentifier
                  );

            // If activity already exists, update the latest message date
            if (index !== -1) {
              const updatedList = [...prev];
              updatedList[index].latestMessage = new Date(
                dataTyped.sentDateTime
              );

              // If discussion is not active, increment unread messages
              if (
                !browserIsVisibleAndFocused ||
                (sourceIdentifier !== activeDiscussionIdentifier &&
                  dataTyped.targetIdentifier !== activeDiscussionIdentifier)
              ) {
                updatedList[index].unreadMessages++;
              }

              return updatedList;
            }

            // If activity doesn't exist, create a new one and add it to the list with unread messages set to 1
            const newActivity: ChatActivity = {
              targetIdentifier: `user-${dataTyped.sourceUserEntityId}`,
              latestMessage: new Date(dataTyped.sentDateTime),
              unreadMessages: 1,
            };

            // By default new activity target identifier is the source identifier
            // If the current user is the source, use the target identifier
            if (dataTyped.targetIdentifier !== currentUserIdentifier) {
              newActivity.targetIdentifier = dataTyped.targetIdentifier;
            }

            // If browser is visible and
            // this is the active discussion, keep unread messages as 0
            if (
              browserIsVisibleAndFocused &&
              dataTyped.targetIdentifier === activeDiscussionIdentifier
            ) {
              newActivity.unreadMessages = 0;
            }

            return [...prev, newActivity];
          });
        }
      }
    };

    websocket.addEventCallback("chat:message-sent", onNewMsgSentUpdateActivity);

    return () => {
      websocket.removeEventCallback(
        "chat:message-sent",
        onNewMsgSentUpdateActivity
      );
    };
  }, [
    activeDiscussionIdentifier,
    browserIsVisibleAndFocused,
    currentUserIdentifier,
    websocket,
  ]);

  /**
   * Fetches chat activity
   */
  const fetchChatActivity = async () => {
    const activity = await chatApi.getChatActivity();

    setChatActivity(activity);
  };

  /**
   * Marks unread messages as read
   * @param targetIdentifier target identifier
   */
  const markMsgsAsRead = React.useCallback(async (targetIdentifier: string) => {
    // Skip rooms as they are not enabled yet for this functionality
    if (targetIdentifier.startsWith("room-")) {
      return;
    }

    // Check if the chat activity exists
    const index = chatActivityRef.current?.findIndex(
      (activity) => activity.targetIdentifier === targetIdentifier
    );

    // If the chat activity doesn't exist, return
    if (index === -1) {
      return;
    }

    await chatApi.markAsRead({
      identifier: targetIdentifier,
    });

    setChatActivity((prev) => {
      const index = prev.findIndex(
        (activity) => activity.targetIdentifier === targetIdentifier
      );

      if (index !== -1) {
        const updatedList = [...prev];
        updatedList[index].unreadMessages = 0;

        return updatedList;
      }

      return prev;
    });
  }, []);

  // Activities as key value pair
  const chatActivityByUserObject: {
    [key: number]: ChatActivity;
  } = React.useMemo(() => {
    if (!chatActivity) {
      return {};
    }

    // Filter activities that are user activities
    const userActivities = chatActivity.filter((activity) =>
      activity.targetIdentifier.startsWith("user-")
    );

    return userActivities.reduce(
      (acc, activity) => ({
        ...acc,
        [activity.targetIdentifier.split("-")[1]]: activity,
      }),
      {}
    );
  }, [chatActivity]);

  return {
    chatActivity,
    chatActivityByUserObject,
    markMsgsAsRead,
  };
}

export default useChatActivity;
