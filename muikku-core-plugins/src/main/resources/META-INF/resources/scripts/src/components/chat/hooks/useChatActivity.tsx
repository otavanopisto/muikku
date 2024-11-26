import * as React from "react";
import { useReadLocalStorage } from "usehooks-ts";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { useWindowContext } from "~/context/window-context";
import { ChatActivity, ChatMessage } from "~/generated/client";
import i18n from "~/locales/i18n";
import { NotificationSettings } from "../chat-helpers";
import { useChatWebsocketContext } from "../context/chat-websocket-context";
import { useDocumentTitle } from "./useDocumentTitle";

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

  const { setTitle, resetTitle } = useDocumentTitle();
  const [hasUnreadMessages, setHasUnreadMessages] = React.useState(false);

  /**
   * Plays message sound
   */
  const playMessageSound = React.useCallback(() => {
    messageSound.play().catch((err) => {
      // Either display notification or log error
      // eslint-disable-next-line no-console
      console.warn("Failed to play message sound:", err);
    });
  }, []);

  /**
   * Checks if sound should be played
   * @param targetIdentifier target identifier
   */
  const shouldPlaySound = React.useCallback(
    (targetIdentifier: string) => {
      // If notifications are disabled, don't play sound
      if (!notificationSettings.notificationsEnabled) {
        return false;
      }

      // If private messages are enabled, play sound if target identifier is current user identifier
      if (
        notificationSettings.privateMessagesEnabled &&
        targetIdentifier === currentUserIdentifier
      ) {
        // If target identifier is the active discussion or current user and browser is visible and focused, play sound
        if (
          [activeDiscussionIdentifier, currentUserIdentifier].includes(
            targetIdentifier
          ) &&
          !browserIsVisibleAndFocused
        ) {
          return true;
        }

        // If target identifier is the active discussion (current and target user as this is two way communication), don't play sound
        return ![activeDiscussionIdentifier, currentUserIdentifier].includes(
          targetIdentifier
        );
      }

      // If target identifier is in public or private room enabled list, play sound
      if (
        [
          ...notificationSettings.publicRoomEnabled,
          ...notificationSettings.privateRoomEnabled,
        ].includes(targetIdentifier)
      ) {
        // If target identifier is the active discussion, don't play sound
        return targetIdentifier !== activeDiscussionIdentifier;
      }

      // Default false
      return false;
    },
    [
      activeDiscussionIdentifier,
      browserIsVisibleAndFocused,
      currentUserIdentifier,
      notificationSettings.notificationsEnabled,
      notificationSettings.privateMessagesEnabled,
      notificationSettings.privateRoomEnabled,
      notificationSettings.publicRoomEnabled,
    ]
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
    let titleInterval: NodeJS.Timeout;

    if (hasUnreadMessages && !browserIsVisibleAndFocused) {
      titleInterval = setInterval(() => {
        setTitle((prevTitle) =>
          prevTitle ===
          `🔔 ${i18n.t("notifications.newMessage", { ns: "chat" })}`
            ? document.title
            : `🔔 ${i18n.t("notifications.newMessage", { ns: "chat" })}`
        );
      }, 1000);
    } else {
      resetTitle();
    }

    return () => {
      if (titleInterval) {
        clearInterval(titleInterval);
        resetTitle();
      }
    };
  }, [hasUnreadMessages, browserIsVisibleAndFocused, setTitle, resetTitle]);

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
          } else {
            // eslint-disable-next-line no-console
            console.log("No sound notification");
          }

          let showFavIconMsg = false;

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

                // If browser is not visible and focused, show fav icon message
                if (!browserIsVisibleAndFocused) {
                  showFavIconMsg = true;
                }

                return updatedList;
              }

              const newActivity: ChatActivity = {
                targetIdentifier: dataTyped.targetIdentifier,
                latestMessage: new Date(dataTyped.sentDateTime),
                unreadMessages: 1,
              };

              // If browser is not visible and focused, show fav icon message
              if (!browserIsVisibleAndFocused) {
                showFavIconMsg = true;
              }

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

                // If browser is not visible and focused, show fav icon message
                if (!browserIsVisibleAndFocused) {
                  showFavIconMsg = true;
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

              // If browser is not visible and focused, show fav icon message
              if (!browserIsVisibleAndFocused) {
                showFavIconMsg = true;
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
          if (showFavIconMsg) {
            setHasUnreadMessages(true);
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

        setHasUnreadMessages(false);
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
      setHasUnreadMessages,
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
