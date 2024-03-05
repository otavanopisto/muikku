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

  const [chatUsersActivities, setChatUsersActivities] =
    React.useState<ChatActivity[]>();
  const [chatRoomsActivities, setChatRoomsActivities] =
    React.useState<ChatActivity[]>();

  const chatUsersActivitiesRef = React.useRef(chatUsersActivities);
  const chatRoomsActivitiesRef = React.useRef(chatRoomsActivities);
  chatUsersActivitiesRef.current = chatUsersActivities;
  chatRoomsActivitiesRef.current = chatRoomsActivities;

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

          // Room activities
          if (dataTyped.targetIdentifier.startsWith("room-")) {
            setChatRoomsActivities((prev) => {
              const index = prev.findIndex(
                (activity) =>
                  activity.targetIdentifier === dataTyped.targetIdentifier
              );

              if (index !== -1) {
                const updatedList = [...prev];
                updatedList[index].latestMessage = new Date(
                  dataTyped.sentDateTime
                );

                if (
                  !browserIsVisibleAndFocused ||
                  dataTyped.targetIdentifier !== activeDiscussionIdentifier
                ) {
                  updatedList[index].unreadMessages++;
                }

                return updatedList;
              }

              const newActivity: ChatActivity = {
                targetIdentifier: dataTyped.targetIdentifier,
                latestMessage: new Date(dataTyped.sentDateTime),
                unreadMessages: 1,
              };

              if (
                browserIsVisibleAndFocused &&
                dataTyped.targetIdentifier === activeDiscussionIdentifier
              ) {
                newActivity.unreadMessages = 0;
              }

              return prev;
            });
          } else {
            // User activities
            setChatUsersActivities((prev) => {
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
                      (activity) =>
                        activity.targetIdentifier === sourceIdentifier
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

    const userActivities = activity.filter((activity) =>
      activity.targetIdentifier.startsWith("user-")
    );

    const roomActivities = activity.filter((activity) =>
      activity.targetIdentifier.startsWith("room-")
    );

    setChatUsersActivities(userActivities);
    setChatRoomsActivities(roomActivities);
  };

  /**
   * Marks unread messages as read
   * @param targetIdentifier target identifier
   */
  const markMsgsAsRead = React.useCallback(
    async (targetIdentifier: string) => {
      if (!browserIsVisibleAndFocused) return;

      if (targetIdentifier.startsWith("room-")) {
        await chatApi.markAsRead({
          identifier: targetIdentifier,
        });

        setChatRoomsActivities((prev) => {
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
      } else {
        await chatApi.markAsRead({
          identifier: targetIdentifier,
        });

        setChatUsersActivities((prev) => {
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
      }
    },
    [browserIsVisibleAndFocused]
  );

  // Activities as key (user id) value pair
  const chatActivityByUserObject: {
    [key: number]: ChatActivity;
  } = React.useMemo(() => {
    if (!chatUsersActivities) {
      return {};
    }

    // Filter activities that are user activities
    const userActivities = chatUsersActivities.filter((activity) =>
      activity.targetIdentifier.startsWith("user-")
    );

    return userActivities.reduce(
      (acc, activity) => ({
        ...acc,
        [activity.targetIdentifier.split("-")[1]]: activity,
      }),
      {}
    );
  }, [chatUsersActivities]);

  // Activities as key (room id) value pair
  const chatActivityByRoomObject: {
    [key: number]: ChatActivity;
  } = React.useMemo(() => {
    if (!chatRoomsActivities) {
      return {};
    }

    // Filter activities that are room activities
    const roomActivities = chatRoomsActivities.filter((activity) =>
      activity.targetIdentifier.startsWith("room-")
    );

    return roomActivities.reduce(
      (acc, activity) => ({
        ...acc,
        [activity.targetIdentifier.split("-")[1]]: activity,
      }),
      {}
    );
  }, [chatRoomsActivities]);

  return {
    chatUsersActivities,
    chatRoomsActivities,
    chatActivityByUserObject,
    chatActivityByRoomObject,
    markMsgsAsRead,
  };
}

export default useChatActivity;
