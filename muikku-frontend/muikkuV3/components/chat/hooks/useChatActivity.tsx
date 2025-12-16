import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { useReadLocalStorage } from "usehooks-ts";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
import { useWindowContext } from "~/context/window-context";
import { ChatActivity, ChatMessage, ChatRoom } from "~/generated/client";
import i18n from "~/locales/i18n";
import generateKey from "~/util/generate-keys";
import { titleManager } from "~/util/title-manager";
import { NotificationSettings } from "../chat-helpers";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

const messageSound = new Audio("/sounds/chat-message-alert.mp3");

/**
 * Custom hook for chat activity
 * @param activeDiscussionIdentifier active identifier
 * @param currentUserIdentifier current user identifier
 * @param notificationSettings notification settings
 * @param rooms rooms
 * @param displayNotification display notification
 */
function useChatActivity(
  activeDiscussionIdentifier: string,
  currentUserIdentifier: string,
  notificationSettings: NotificationSettings,
  rooms: ChatRoom[],
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

  const [newMsgNotification, setNewMsgNotification] =
    React.useState<ChatMessage | null>(null);

  const notificationIdsRef = React.useRef<Set<string>>(new Set());

  React.useCallback(
    () => () => {
      componentMounted.current = false;
    },
    []
  );

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
   * Should give notification. Checks if specific notification settings are enabled
   * and conditions are met for giving a notification.
   * @param chatMessage chat message
   */
  const shouldGiveNotification = React.useCallback(
    (chatMessage: ChatMessage) => {
      if (!notificationSettings.notificationsEnabled) {
        return { soundNotification: false, newMsgTabNotification: null };
      }

      // Check if the message is directed to the current user
      const isTargetUser =
        chatMessage.targetIdentifier === currentUserIdentifier;

      // Check if the message is the active discussion
      const isActiveDiscussion =
        chatMessage.targetIdentifier === activeDiscussionIdentifier;

      // Check if the notification settings are enabled for the room of the message
      const isEnabledRoom = [
        ...notificationSettings.publicRoomEnabled,
        ...notificationSettings.privateRoomEnabled,
      ].includes(chatMessage.targetIdentifier);

      // Check if the message should be notified
      const shouldNotify =
        (isTargetUser && notificationSettings.privateMessagesEnabled) ||
        isEnabledRoom;

      const showTabNotification = shouldNotify && !browserIsVisibleAndFocused;

      const playSoundNotification =
        shouldNotify && (!isActiveDiscussion || !browserIsVisibleAndFocused);

      return {
        soundNotification: playSoundNotification,
        newMsgTabNotification: showTabNotification ? chatMessage : null,
      };
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

  /**
   * Updates the activity list
   * @param activities previous activity list
   * @param targetId target identifier
   * @param messageDate message date
   */
  const updateActivity = React.useCallback(
    (activities: ChatActivity[], targetId: string, messageDate: Date) => {
      const index = activities.findIndex(
        (activity) => activity.targetIdentifier === targetId
      );
      const isActive =
        browserIsVisibleAndFocused &&
        targetId === activeDiscussionIdentifier &&
        !minimized;

      // If the activity already exists, update it
      if (index !== -1) {
        const updatedList = [...activities];
        updatedList[index] = {
          ...updatedList[index],
          latestMessage: messageDate,
          unreadMessages: isActive ? 0 : updatedList[index].unreadMessages + 1,
        };
        return updatedList;
      }

      // Otherwise add a new activity
      return [
        ...activities,
        {
          targetIdentifier: targetId,
          latestMessage: messageDate,
          unreadMessages: isActive ? 0 : 1,
        },
      ];
    },
    [activeDiscussionIdentifier, browserIsVisibleAndFocused, minimized]
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

        unstable_batchedUpdates(() => {
          if (componentMounted.current) {
            setChatUsersActivities(userActivities);
            setChatRoomsActivities(roomActivities);
          }
        });
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

  // Handle new message notifications
  React.useEffect(() => {
    // If no new message notification or browser is visible and focused, do nothing
    if (!newMsgNotification || browserIsVisibleAndFocused) {
      return;
    }

    // Generate notification ID that we can track
    const notificationId = newMsgNotification.targetIdentifier.startsWith(
      "room-"
    )
      ? `new-message-room-${generateKey()}`
      : `new-message-${generateKey()}`;

    notificationIdsRef.current.add(notificationId);

    // Handle room messages
    if (newMsgNotification.targetIdentifier.startsWith("room-")) {
      const room = rooms.find(
        (room) => room.identifier === newMsgNotification.targetIdentifier
      );

      if (!room) {
        return;
      }

      titleManager.addNotification({
        id: notificationId,
        text: `🔔 ${i18n.t("notifications.newMessage_room", {
          ns: "chat",
          nick: newMsgNotification.nick,
          roomName: room.name,
          context: "room",
        })}`,
      });
    } else {
      // Handle direct messages
      titleManager.addNotification({
        id: notificationId,
        text: `🔔 ${i18n.t("notifications.newMessage", {
          ns: "chat",
          nick: newMsgNotification.nick,
        })}`,
      });
    }
  }, [newMsgNotification, browserIsVisibleAndFocused, rooms]);

  // Handle browser visibility changes
  React.useEffect(() => {
    // If browser is visible and focused, clear notifications
    if (browserIsVisibleAndFocused) {
      setNewMsgNotification(null);
      notificationIdsRef.current.forEach((id) => {
        titleManager.removeNotification(id);
      });
      notificationIdsRef.current.clear();
    }
  }, [browserIsVisibleAndFocused]);

  // Cleanup existing chat msg notifications when component unmounts
  React.useEffect(
    () => () => {
      notificationIdsRef.current.forEach((id) => {
        titleManager.removeNotification(id);
      });
    },
    []
  );

  // New message websocket handling
  React.useEffect(() => {
    /**
     * Simplified message handling
     * @param data data
     */
    const handleNewMessage = (data: unknown) => {
      if (typeof data !== "string") return;

      const message: ChatMessage = JSON.parse(data);
      const notifications = shouldGiveNotification(message);

      if (notifications.soundNotification) {
        // eslint-disable-next-line no-console
        messageSound.play().catch(console.warn);
      }

      const targetId = message.targetIdentifier;
      const messageDate = new Date(message.sentDateTime);

      if (targetId.startsWith("room-")) {
        setChatRoomsActivities((prev) =>
          updateActivity(prev, targetId, messageDate)
        );
      } else {
        const userTargetId =
          currentUserIdentifier === `user-${message.sourceUserEntityId}`
            ? message.targetIdentifier
            : `user-${message.sourceUserEntityId}`;
        setChatUsersActivities((prev) =>
          updateActivity(prev, userTargetId, messageDate)
        );
      }

      setNewMsgNotification(notifications.newMsgTabNotification);
    };

    websocket.addEventCallback("chat:message-sent", handleNewMessage);
    return () =>
      websocket.removeEventCallback("chat:message-sent", handleNewMessage);
  }, [
    activeDiscussionIdentifier,
    browserIsVisibleAndFocused,
    currentUserIdentifier,
    minimized,
    playMessageSound,
    shouldGiveNotification,
    updateActivity,
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
