import * as React from "react";
import { useReadLocalStorage } from "usehooks-ts";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { useWindowContext } from "~/context/window-context";
import { ChatActivity, ChatMessage } from "~/generated/client";
import i18n from "~/locales/i18n";
import { useChatWebsocketContext } from "../context/chat-websocket-context";
import { NotificationSettings } from "./useChatNotificationSettings";

const chatApi = MApi.getChatApi();

const messageSound = new Audio("/sounds/Muikku_Lyhyt_Variaatio2.mp3");

/**
 * Custom hook for chat activity
 * @param activeDiscussionIdentifier active identifier
 * @param currentUserIdentifier current user identifier
 * @param notificationSettings notification settings
 * @param displayNotification display notification
 */
function useChatActivity(
  activeDiscussionIdentifier: string,
  currentUserIdentifier: string,
  notificationSettings: NotificationSettings,
  displayNotification: DisplayNotificationTriggerType
) {
  const websocket = useChatWebsocketContext();

  const [chatUsersActivities, setChatUsersActivities] =
    React.useState<ChatActivity[]>();
  const [chatRoomsActivities, setChatRoomsActivities] =
    React.useState<ChatActivity[]>();

  const componentMounted = React.useRef(true);

  const browserIsVisibleAndFocused = useWindowContext();

  const minimized = useReadLocalStorage<boolean>("chat-minimized");

  /**
   * Plays message sound
   */
  const playMessageSound = React.useCallback(() => {
    // eslint-disable-next-line no-console
    console.log("Playing message sound", messageSound);
    messageSound.play().catch((err) => {
      // eslint-disable-next-line no-console
      console.warn("Failed to play message sound:", err);
    });
  }, []);

  /**
   * Checks if sound should be played
   * @param targetIdentifier target identifier
   */
  const shouldPlaySound = React.useCallback(
    (targetIdentifier: string) =>
      targetIdentifier === currentUserIdentifier ||
      targetIdentifier.startsWith("room-"),
    [currentUserIdentifier]
  );

  // Initial fetch
  React.useEffect(() => {
    /**
     * Fetches chat activity
     */
    const fetchChatActivity = async () => {
      try {
        const activity = await chatApi.getChatActivity();

        const userActivities = activity.filter((activity) =>
          activity.targetIdentifier.startsWith("user-")
        );

        const roomActivities = activity.filter((activity) =>
          activity.targetIdentifier.startsWith("room-")
        );

        setChatUsersActivities(userActivities);
        setChatRoomsActivities(roomActivities);
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification(
          i18n.t("notifications.loadError", {
            context: "activity",
            ns: "chat",
          }),
          "error"
        );
      }
    };

    fetchChatActivity();
  }, [displayNotification]);

  React.useEffect(() => {
    /**
     * Handles new message sent event
     * @param data data
     */
    const onNewMsgSentUpdateActivity = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatMessage = JSON.parse(data);

          if (shouldPlaySound(dataTyped.targetIdentifier)) {
            playMessageSound();
          }

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
                  minimized ||
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
                  minimized ||
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
    minimized,
    playMessageSound,
    shouldPlaySound,
    websocket,
  ]);

  /**
   * Marks unread messages as read
   * @param targetIdentifier target identifier
   */
  const markMsgsAsRead = React.useCallback(
    async (targetIdentifier: string) => {
      // If the target identifier is a room, find the activity in the room activities list
      // else find the activity in the user activities list
      const existingActivity = targetIdentifier.startsWith("room-")
        ? chatRoomsActivities?.find(
            (activity) => activity.targetIdentifier === targetIdentifier
          )
        : chatUsersActivities?.find(
            (activity) => activity.targetIdentifier === targetIdentifier
          );

      // If browser is not visible and focused or
      // there is no existing activity or there are no unread messages, return
      if (
        !browserIsVisibleAndFocused ||
        !existingActivity ||
        existingActivity.unreadMessages === 0
      ) {
        return;
      }

      try {
        await chatApi.markAsRead({
          identifier: targetIdentifier,
        });

        // Otherwise mark the messages as read for the target identifier
        // and update correct activity list (room or user)
        if (targetIdentifier.startsWith("room-")) {
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
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        displayNotification(
          i18n.t("notifications.markAsReadError", {
            ns: "chat",
          }),
          "error"
        );
      }
    },
    [
      browserIsVisibleAndFocused,
      chatRoomsActivities,
      chatUsersActivities,
      displayNotification,
    ]
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
