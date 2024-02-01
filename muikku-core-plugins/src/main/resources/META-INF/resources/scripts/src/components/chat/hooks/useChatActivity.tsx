import * as React from "react";
import MApi from "~/api/api";
import { ChatActivity, ChatMessage } from "~/generated/client";

const chatApi = MApi.getChatApi();

/**
 * Custom hook for chat activity
 */
function useChatActivity() {
  const [chatActivity, setChatActivity] = React.useState<ChatActivity[]>();

  const chatActivityRef = React.useRef(chatActivity);
  chatActivityRef.current = chatActivity;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const componentMounted = React.useRef(true);

  // Initial fetch
  React.useEffect(() => {
    fetchChatActivity();
  }, []);

  /**
   * Fetches chat activity
   */
  const fetchChatActivity = async () => {
    const activity = await chatApi.getChatActivity();

    setChatActivity(activity);
  };

  /**
   * Marks unread messages as read
   */
  const markMsgsAsRead = React.useCallback(async (targetIdentifier: string) => {
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

  /**
   * Handles new message sent event
   * @param data data
   */
  const onNewMsgSentUpdateActivity = React.useCallback(
    (data: unknown, activeDiscussionIdentifier: string) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

          // Updates the latest message date of the chat activity that the message was sent to
          setChatActivity((prev) => {
            const index = prev.findIndex((activity) =>
              [
                `user-${dataTyped.sourceUserEntityId}`,
                dataTyped.targetIdentifier,
              ].includes(activity.targetIdentifier)
            );

            // If activity already exists, update the latest message date
            if (index !== -1) {
              const updatedList = [...prev];
              updatedList[index].latestMessage = new Date(
                dataTyped.sentDateTime
              );

              // If discussion is not active, increment unread messages
              if (
                `user-${dataTyped.sourceUserEntityId}` !==
                activeDiscussionIdentifier
              ) {
                updatedList[index].unreadMessages++;
              }

              return updatedList;
            }

            // If activity doesn't exist, create a new one and add it to the list with unread messages set to 1
            const newActivity: ChatActivity = {
              targetIdentifier: dataTyped.targetIdentifier,
              latestMessage: new Date(dataTyped.sentDateTime),
              unreadMessages: 1,
            };

            return [...prev, newActivity];
          });
        }
      }
    },
    []
  );

  return {
    chatActivity,
    markMsgsAsRead,
    onNewMsgSentUpdateActivity,
  };
}

export default useChatActivity;
