import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  ChatRoom,
  ChatUser,
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
} from "~/generated/client";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import useViews from "../animated-views/context/hooks/useChatTabs";
import {
  chatControllerViews,
  filterUsers,
  isObjEmpty,
  sortUsersAlphabetically,
} from "../chat-helpers";
import useChatUsers from "./useUsers";
import useRooms from "./useRooms";
import { ChatDiscussionInstance } from "../utility/chat-discussion-instance";
import { useChatWebsocketContext } from "../context/chat-websocket-context";
import useChatActivity from "./useChatActivity";
import { breakpoints } from "~/util/breakpoints";
import { useLocalStorage } from "usehooks-ts";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import useChatNotificationSettings from "./useChatNotificationSettings";

export type UseChat = ReturnType<typeof useChat>;

/**
 * Custom hook for chat that groups all chat related functionality
 * @param currentUser currentUser
 * @param displayNotification displayNotification
 */
function useChat(
  currentUser: ChatUser,
  displayNotification: DisplayNotificationTriggerType
) {
  const websocket = useChatWebsocketContext();

  const {
    usersObject,
    userFilters,
    updateUserFilters,
    usersWithChatActiveIds,
    counselorIds,
    usersWithDiscussionIds,
    blockedUsersIds,
    blockUser,
    closePrivateDiscussion,
    unblockUser,
  } = useChatUsers({ currentUser, displayNotification });
  const {
    roomFilters,
    rooms,
    loadingRooms,
    createNewRoom,
    updateRoom,
    deleteRoom,
    updateRoomFilters,
  } = useRooms(displayNotification);

  const {
    notificationSettings,
    toggleRoomNotificationsImmediate,
    saveNotificationSettingsChanges,
    updateNotificationSettings,
    resetNotificationSettingsChanges,
  } = useChatNotificationSettings(currentUser.id, displayNotification);

  const chatViews = useViews({
    views: chatControllerViews,
  });

  // Active room or person identifier
  const [activeDiscussionIdentifier, setActiveDiscussionIdentifier] =
    React.useState<string>(null);

  const {
    chatUsersActivities,
    chatRoomsActivities,
    chatActivityByUserObject,
    chatActivityByRoomObject,
    markMsgsAsRead,
  } = useChatActivity(
    activeDiscussionIdentifier,
    currentUser.identifier,
    notificationSettings,
    rooms,
    displayNotification
  );

  // Discussion instances
  const [discussionInstances, setMessagesInstances] = React.useState<
    ChatDiscussionInstance[]
  >([]);

  // Whether to show the control box or bubble
  const [minimized, setMinimized] = useLocalStorage<boolean>(
    "chat-minimized",
    false
  );

  // Whether the current width is mobile
  const isMobileWidth = useIsAtBreakpoint(breakpoints.breakpointMobileXl);

  // Editor values
  const [newChatRoom, setNewChatRoom] = React.useState<CreateChatRoomRequest>({
    name: "",
    description: "",
  });

  // User to be blocked, unblocked, or room to be deleted dialog states
  const [userToBeBlocked, setUserToBeBlocked] = React.useState<ChatUser>(null);
  const [userToBeUnblocked, setUserToBeUnblocked] =
    React.useState<ChatUser>(null);
  const [roomToBeDeleted, setRoomToBeDeleted] = React.useState<ChatRoom>(null);

  /**
   * Handles updating the new room editor
   * @param key key
   * @param value value
   */
  const updateNewRoomEditor = <T extends keyof CreateChatRoomRequest>(
    key: T,
    value: CreateChatRoomRequest[T]
  ) => {
    setNewChatRoom((newChatRoom) => ({
      ...newChatRoom,
      [key]: value,
    }));
  };

  /**
   * Handles creating a new room
   */
  const saveNewRoom = React.useCallback(async () => {
    await createNewRoom(newChatRoom);

    setNewChatRoom({
      name: "",
      description: "",
    });
  }, [createNewRoom, newChatRoom]);

  /**
   * Handles updating a custom room
   * @param identifier identifier
   * @param editChatRoom editChatRoom
   */
  const saveEditedRoom = React.useCallback(
    async (identifier: string, editChatRoom: UpdateChatRoomRequest) => {
      await updateRoom(identifier, editChatRoom);
    },
    [updateRoom]
  );

  /**
   * Handles deleting a custom room
   * @param identifier identifier
   */
  const deleteCustomRoom = React.useCallback(
    async (identifier: string) => {
      // Close discussion if it is open
      if (activeDiscussionIdentifier === identifier) {
        setActiveDiscussionIdentifier(null);
        chatViews.goTo("overview");
      }

      await deleteRoom(identifier);
    },
    [activeDiscussionIdentifier, chatViews, deleteRoom]
  );

  /**
   * Toggles the control box
   */
  const toggleControlBox = React.useCallback(() => {
    setMinimized((minimized) => !minimized);
  }, [setMinimized]);

  /**
   * Handles opening overview
   */
  const openOverview = React.useCallback(() => {
    chatViews.goTo("overview");
    setActiveDiscussionIdentifier(null);
  }, [chatViews]);

  /**
   * Handles opening discussion with user
   * @param identifier identifier
   */
  const openDiscussion = React.useCallback(
    async (identifier: string) => {
      // Check if message instance already exists for this identifier
      const existingIndex = discussionInstances.findIndex(
        (instance) => instance.targetIdentifier === identifier
      );

      if (existingIndex === -1) {
        // Create new message instance
        const newDiscussionInstance = new ChatDiscussionInstance(
          identifier,
          currentUser.identifier,
          websocket,
          displayNotification
        );

        const updatedInstanceList = [
          ...discussionInstances,
          newDiscussionInstance,
        ];

        setMessagesInstances(updatedInstanceList);
      }

      setActiveDiscussionIdentifier(identifier);
      chatViews.goTo("discussion");
    },
    [
      discussionInstances,
      chatViews,
      currentUser.identifier,
      websocket,
      displayNotification,
    ]
  );

  /**
   * Handles closing discussion with user
   * @param currentUser currentUser
   */
  const closeDiscussionWithUser = React.useCallback(
    async (targetUser: ChatUser) => {
      // Close discussion if it is open
      if (activeDiscussionIdentifier === targetUser.identifier) {
        setActiveDiscussionIdentifier(null);
        chatViews.goTo("overview");
      }
      await closePrivateDiscussion(targetUser);
      await markMsgsAsRead(targetUser.identifier);
    },
    [
      activeDiscussionIdentifier,
      chatViews,
      closePrivateDiscussion,
      markMsgsAsRead,
    ]
  );

  /**
   * Handles closing and blocking discussion with user
   * @param currentUser currentUser
   */
  const closeAndBlockDiscussionWithUser = React.useCallback(
    async (targetUser: ChatUser) => {
      await blockUser(targetUser);
      await markMsgsAsRead(targetUser.identifier);

      // Close discussion if it is open
      if (activeDiscussionIdentifier === targetUser.identifier) {
        unstable_batchedUpdates(() => {
          setActiveDiscussionIdentifier(null);
        });
      }

      chatViews.goTo("overview");
    },
    [activeDiscussionIdentifier, blockUser, chatViews, markMsgsAsRead]
  );

  /**
   * Handles unblocking discussion with user
   * @param currentUser currentUser
   */
  const unblockDiscussionWithUser = React.useCallback(
    async (currentUser: ChatUser) => {
      await unblockUser(currentUser);
    },
    [unblockUser]
  );

  /**
   * Handles canceling unblocking discussion with user
   * @param user user which unblocking was canceled
   */
  const openCancelUnblockDialog = React.useCallback((user: ChatUser) => {
    setUserToBeUnblocked(user);
  }, []);

  /**
   * Handles closing cancel unblocking discussion with user
   */
  const closeCancelUnblockDialog = React.useCallback(() => {
    setUserToBeUnblocked(null);
  }, []);

  /**
   * Handles opening block user dialog
   * @param user user to be blocked
   */
  const openBlockUserDialog = React.useCallback((user: ChatUser) => {
    setUserToBeBlocked(user);
  }, []);

  /**
   * Handles closing block user dialog
   */
  const closeBlockUserDialog = React.useCallback(() => {
    setUserToBeBlocked(null);
  }, []);

  /**
   * Handles opening delete room dialog
   * @param room room to be deleted
   */
  const openDeleteRoomDialog = React.useCallback((room: ChatRoom) => {
    setRoomToBeDeleted(room);
  }, []);

  /**
   * Handles closing delete room dialog
   */
  const closeDeleteRoomDialog = React.useCallback(() => {
    setRoomToBeDeleted(null);
  }, []);

  // Whether the current user can moderate
  const canModerate = React.useMemo(
    () => currentUser.type === "STAFF",
    [currentUser.type]
  );

  // Current active discussion
  const activeDiscussion = React.useMemo(() => {
    if (!activeDiscussionIdentifier || !rooms) {
      return null;
    }

    // All users with or without active discussion
    const allUsers = Object.values(usersObject);

    return [...allUsers, ...rooms].find(
      (r) => r.identifier === activeDiscussionIdentifier
    );
  }, [activeDiscussionIdentifier, rooms, usersObject]);

  // Users with chat activated, not blocked, sorted alphabetically
  const dashboardUsers = React.useMemo(() => {
    if (isObjEmpty(usersObject)) {
      return [];
    }

    if (!userFilters) {
      return usersWithChatActiveIds
        .map((id) => usersObject[id])
        .filter((u) => !blockedUsersIds.includes(u.id))
        .sort(sortUsersAlphabetically);
    }

    return filterUsers(
      usersWithChatActiveIds
        .map((id) => usersObject[id])
        .filter((u) => !blockedUsersIds.includes(u.id)),
      userFilters
    ).sort(sortUsersAlphabetically);
  }, [userFilters, usersWithChatActiveIds, usersObject, blockedUsersIds]);

  // Blocked users, filtered and sorted alphabetically
  const dashboardBlockedUsers = React.useMemo(() => {
    if (isObjEmpty(usersObject)) {
      return [];
    }

    if (!userFilters) {
      return blockedUsersIds.map((id) => usersObject[id]);
    }

    return filterUsers(
      blockedUsersIds.map((id) => usersObject[id]),
      userFilters
    ).sort(sortUsersAlphabetically);
  }, [blockedUsersIds, userFilters, usersObject]);

  // My discussions with counselors, sorted alphabetically
  const myDiscussionsCouncelors = React.useMemo(() => {
    if (isObjEmpty(usersObject) || counselorIds.length === 0) {
      return [];
    }

    return Object.values(usersObject)
      .filter((u) => counselorIds.includes(u.id))
      .sort(sortUsersAlphabetically);
  }, [counselorIds, usersObject]);

  // My discussions with other users than counselors, sorted by activity
  const myDiscussionsOthers = React.useMemo(() => {
    if (isObjEmpty(usersObject)) {
      return [];
    }

    /**
     * Sorter for users by activity
     * @param a a
     * @param b b
     */
    const sortUsersByActivity = (a: ChatUser, b: ChatUser) => {
      const aActivity = chatUsersActivities.find(
        (activity) => activity.targetIdentifier === a.identifier
      );

      const bActivity = chatUsersActivities.find(
        (activity) => activity.targetIdentifier === b.identifier
      );

      const aLastMessage = aActivity?.latestMessage || undefined;
      const bLastMessage = bActivity?.latestMessage || undefined;

      if (!aLastMessage) {
        return 1;
      }

      if (!bLastMessage) {
        return -1;
      }

      return bLastMessage.getTime() - aLastMessage.getTime();
    };

    if (!chatUsersActivities) {
      return usersWithDiscussionIds.map((id) => usersObject[id]);
    }

    return usersWithDiscussionIds
      .map((id) => usersObject[id])
      .filter((u) => counselorIds.indexOf(u.id) === -1)
      .sort(sortUsersByActivity);
  }, [usersObject, chatUsersActivities, usersWithDiscussionIds, counselorIds]);

  // Private rooms
  const roomsPrivate = React.useMemo(
    () => rooms.filter((r) => r.type === "WORKSPACE"),
    [rooms]
  );

  // Public rooms
  const roomsPublic = React.useMemo(
    () => rooms.filter((r) => r.type === "PUBLIC"),
    [rooms]
  );

  // count for unread messages
  const unreadMsgCount = React.useMemo(() => {
    let counter = 0;

    if (!chatUsersActivities) return counter;

    chatUsersActivities.forEach((cA) => {
      counter += cA.unreadMessages;
    });

    return counter;
  }, [chatUsersActivities]);

  return {
    activeDiscussion,
    canModerate,
    chatUsersActivities,
    chatRoomsActivities,
    chatActivityByUserObject,
    chatActivityByRoomObject,
    chatViews,
    closeAndBlockDiscussionWithUser,
    closeBlockUserDialog,
    closeCancelUnblockDialog,
    closeDeleteRoomDialog,
    closeDiscussionWithUser,
    currentUser,
    dashboardBlockedUsers,
    dashboardUsers,
    deleteCustomRoom,
    discussionInstances,
    isMobileWidth,
    loadingRooms,
    markMsgsAsRead,
    minimized,
    myDiscussionsCouncelors,
    myDiscussionsOthers,
    newChatRoom,
    openBlockUserDialog,
    openCancelUnblockDialog,
    openDeleteRoomDialog,
    openDiscussion,
    openOverview,
    roomFilters,
    rooms,
    roomsPrivate,
    roomsPublic,
    roomToBeDeleted,
    saveEditedRoom,
    saveNewRoom,
    toggleControlBox,
    unblockDiscussionWithUser,
    unreadMsgCount,
    updateNewRoomEditor,
    updateRoomFilters,
    updateUserFilters,
    userFilters,
    userToBeBlocked,
    userToBeUnblocked,
    notificationSettings,
    saveNotificationSettingsChanges,
    toggleRoomNotificationsImmediate,
    updateNotificationSettings,
    resetNotificationSettingsChanges,
  };
}

export default useChat;
