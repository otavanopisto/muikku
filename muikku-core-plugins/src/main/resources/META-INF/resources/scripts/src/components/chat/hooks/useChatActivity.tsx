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
   * Handles new message sent event
   * @param data data
   */
  const onNewMsgSentUpdateActivity = React.useCallback((data: unknown) => {
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
            updatedList[index].latestMessage = new Date(dataTyped.sentDateTime);

            return updatedList;
          }

          // If activity doesn't exist, create a new one
          const newActivity: ChatActivity = {
            targetIdentifier: dataTyped.targetIdentifier,
            latestMessage: new Date(dataTyped.sentDateTime),
          };

          return [...prev, newActivity];
        });
      }
    }
  }, []);

  return {
    chatActivity,
    onNewMsgSentUpdateActivity,
  };
}

export default useChatActivity;
