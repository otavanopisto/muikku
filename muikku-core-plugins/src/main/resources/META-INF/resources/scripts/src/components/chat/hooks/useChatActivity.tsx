import * as React from "react";
import MApi from "~/api/api";
import { ChatActivity, ChatMessage } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * Custom hook for chat activity
 * @param activeIdentifier active identifier
 */
function useChatActivity(activeIdentifier: string) {
  const websocket = useChatWebsocketContext();

  const [chatActivity, setChatActivity] = React.useState<ChatActivity[]>();

  const chatActivityRef = React.useRef(chatActivity);
  chatActivityRef.current = chatActivity;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const componentMounted = React.useRef(true);

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
              if (dataTyped.targetIdentifier !== activeIdentifier) {
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

            // If this is the active discussion, keep unread messages as 0
            if (dataTyped.targetIdentifier === activeIdentifier) {
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
  }, [activeIdentifier, websocket]);

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

  const chatActivityByUserObject: {
    [key: number]: ChatActivity;
  } = React.useMemo(() => {
    if (!chatActivity) {
      return {};
    }

    // Filter activities that are not user activities
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
