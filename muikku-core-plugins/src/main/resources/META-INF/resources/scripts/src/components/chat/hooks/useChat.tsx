/* eslint-disable jsdoc/require-jsdoc */
// Hook to handle loading roooms and people list from rest api.
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
import { useViews } from "../animated-views/context/hooks/useChatTabs";
import {
  chatControllerViews,
  filterUsers,
  sortUsersAlphabetically,
} from "../chat-helpers";
import useChatUsers from "./useUsers";
import useRooms from "./useRooms";
import variables from "~/sass/_exports.scss";
import { ChatDiscussionInstance } from "../utility/chat-discussion-instance";
import { useChatWebsocketContext } from "../context/chat-websocket-context";
import useChatActivity from "./useChatActivity";
import { useWebsocketsWithCallbacks } from "./useWebsocketsWithCallbacks";
import { useLocalStorage } from "usehooks-ts";

export type UseChat = ReturnType<typeof useChat>;

/**
 * Custom hook for chat that groups all chat related functionality
 * @param userId userId
 * @param currentUser currentUser
 */
function useChat(userId: number, currentUser: ChatUser) {
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
    unblockUser,
    onNewMgsSentUpdateActiveDiscussions,
  } = useChatUsers({ currentUser });
  const {
    roomFilters,
    rooms,
    loadingRooms,
    createNewRoom,
    updateRoom,
    deleteRoom,
    updateRoomFilters,
  } = useRooms();

  const chatViews = useViews({
    views: chatControllerViews,
  });

  const { chatActivity, markMsgsAsRead, onNewMsgSentUpdateActivity } =
    useChatActivity();

  const [discussionInstances, setMessagesInstances] = React.useState<
    ChatDiscussionInstance[]
  >([]);

  // Whether to show the control box or bubble
  const [minimized, setMinimized] = React.useState(true);

  // Panel states
  const [panelRightOpen, setPanelRightOpen] = useLocalStorage(
    "chat-panel-right",
    true
  );
  const [panelLeftOpen, setPanelLeftOpen] = useLocalStorage(
    "chat-panel-left",
    true
  );

  // Whether the current width is mobile
  const mobileBreakpoint = parseInt(variables.mobileBreakpointXl);
  const isMobileWidth = useIsAtBreakpoint(mobileBreakpoint);

  // Active room or person identifier
  const [activeDiscussionIdentifier, setActiveDiscussionIdentifier] =
    React.useState<string>(null);

  // Editor values
  const [newChatRoom, setNewChatRoom] = React.useState<CreateChatRoomRequest>({
    name: "",
    description: "",
  });

  const [userToBeBlocked, setUserToBeBlocked] = React.useState<ChatUser>(null);
  const [userToBeUnblocked, setUserToBeUnblocked] =
    React.useState<ChatUser>(null);

  const [roomToBeDeleted, setRoomToBeDeleted] = React.useState<ChatRoom>(null);

  // Shared websocket callbacks
  useWebsocketsWithCallbacks({
    "chat:message-sent": (data: unknown) => {
      onNewMgsSentUpdateActiveDiscussions(data);
      onNewMsgSentUpdateActivity(data, activeDiscussionIdentifier);
    },
  });

  /**
   * updateNewRoomEditor
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
   * saveNewRoom
   */
  const saveNewRoom = React.useCallback(async () => {
    await createNewRoom(newChatRoom);

    setNewChatRoom({
      name: "",
      description: "",
    });
  }, [createNewRoom, newChatRoom]);

  /**
   * saveEditedRoom
   */
  const saveEditedRoom = React.useCallback(
    async (identifier: string, editChatRoom: UpdateChatRoomRequest) => {
      await updateRoom(identifier, editChatRoom);
    },
    [updateRoom]
  );

  /**
   * deleteRoom
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

  // Toggles the control box
  const toggleControlBox = React.useCallback(() => {
    setMinimized((minimized) => !minimized);
  }, []);

  // Toggles the left panel or sets it to a specific state
  const toggleLeftPanel = React.useCallback(
    (nextState?: boolean) => {
      if (nextState !== undefined) {
        setPanelLeftOpen(nextState);
      } else {
        setPanelLeftOpen((panelLeftOpen) => !panelLeftOpen);
      }
    },
    [setPanelLeftOpen]
  );

  // Toggles the right panel or sets it to a specific state
  const toggleRightPanel = React.useCallback(
    (nextState?: boolean) => {
      if (nextState !== undefined) {
        setPanelRightOpen(nextState);
      } else {
        setPanelRightOpen((panelRightOpen) => !panelRightOpen);
      }
    },
    [setPanelRightOpen]
  );

  /**
   * closeView
   */
  const openOverview = React.useCallback(() => {
    chatViews.goTo("overview");
    setActiveDiscussionIdentifier(null);
  }, [chatViews]);

  // Sets the active room or person
  const openDiscussion = React.useCallback(
    async (identifier: string) => {
      if (isMobileWidth) {
        unstable_batchedUpdates(() => {
          setPanelLeftOpen(false);
          setPanelRightOpen(false);
        });
      }

      // When opening a discussion, mark all messages as read
      await markMsgsAsRead(identifier);

      // Check if message instance already exists for this identifier
      const existingIndex = discussionInstances.findIndex(
        (instance) => instance.targetIdentifier === identifier
      );

      if (existingIndex === -1) {
        // Create new message instance
        const newDiscussionInstance = new ChatDiscussionInstance(
          identifier,
          [identifier, `user-${userId}`],
          websocket
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
      isMobileWidth,
      markMsgsAsRead,
      discussionInstances,
      chatViews,
      setPanelLeftOpen,
      setPanelRightOpen,
      userId,
      websocket,
    ]
  );

  /**
   * Handles closing discussion with user
   */
  const closeDiscussionWithUser = React.useCallback(
    async (currentUser: ChatUser) => {
      // Close discussion if it is open
      if (activeDiscussionIdentifier === currentUser.identifier) {
        setActiveDiscussionIdentifier(null);
        chatViews.goTo("overview");
      }
      await blockUser(currentUser, "SOFT");
    },
    [activeDiscussionIdentifier, blockUser, chatViews]
  );

  /**
   * Handles closing and blocking discussion with user
   */
  const closeAndBlockDiscussionWithUser = React.useCallback(
    async (currentUser: ChatUser) => {
      await blockUser(currentUser, "HARD");

      // Close discussion if it is open
      if (activeDiscussionIdentifier === currentUser.identifier) {
        unstable_batchedUpdates(() => {
          setActiveDiscussionIdentifier(null);
          setUserToBeBlocked(null);
        });
      } else {
        setUserToBeBlocked(null);
      }

      chatViews.goTo("overview");
    },
    [activeDiscussionIdentifier, blockUser, chatViews]
  );

  /**
   * Handles unblocking discussion with user
   */
  const unblockDiscussionWithUser = React.useCallback(
    async (currentUser: ChatUser) => {
      await unblockUser(currentUser);
      setUserToBeUnblocked(null);
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

  // Users object including the current user
  const usersObjectIncludingMe: {
    [key: string]: ChatUser;
  } = React.useMemo(
    () => ({ ...usersObject, [currentUser.id]: currentUser }),
    [usersObject, currentUser]
  );

  // Users with chat activated, not blocked, sorted alphabetically
  const dashboardUsers = React.useMemo(() => {
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
    if (!userFilters) {
      return blockedUsersIds.map((id) => usersObject[id]);
    }

    return filterUsers(
      blockedUsersIds.map((id) => usersObject[id]),
      userFilters
    ).sort(sortUsersAlphabetically);
  }, [blockedUsersIds, userFilters, usersObject]);

  // My discussions with counselors, sorted alphabetically
  const myDiscussionsCouncelors = React.useMemo(
    () =>
      counselorIds.map((id) => usersObject[id]).sort(sortUsersAlphabetically),
    [counselorIds, usersObject]
  );

  // My discussions with other users than counselors, sorted by activity
  const myDiscussionsOthers = React.useMemo(() => {
    const sortUsersByActivity = (a: ChatUser, b: ChatUser) => {
      const aActivity = chatActivity.find(
        (activity) => activity.targetIdentifier === a.identifier
      );

      const bActivity = chatActivity.find(
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

    if (!chatActivity) {
      return usersWithDiscussionIds.map((id) => usersObject[id]);
    }

    return usersWithDiscussionIds
      .map((id) => usersObject[id])
      .sort(sortUsersByActivity);
  }, [usersWithDiscussionIds, chatActivity, usersObject]);

  return {
    activeDiscussion,
    canModerate,
    chatActivity,
    chatViews,
    closeAndBlockDiscussionWithUser,
    closeBlockUserDialog,
    closeCancelUnblockDialog,
    closeDiscussionWithUser,
    closeDeleteRoomDialog,
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
    panelLeftOpen,
    panelRightOpen,
    roomFilters,
    rooms,
    roomsPrivate: rooms.filter((r) => r.type === "WORKSPACE"),
    roomsPublic: rooms.filter((r) => r.type === "PUBLIC"),
    roomToBeDeleted,
    saveEditedRoom,
    saveNewRoom,
    toggleControlBox,
    toggleLeftPanel,
    toggleRightPanel,
    unblockDiscussionWithUser,
    updateNewRoomEditor,
    updateRoomFilters,
    updateUserFilters,
    userFilters,
    userId,
    usersObjectIncludingMe,
    userToBeBlocked,
    userToBeUnblocked,
  };
}

export default useChat;
