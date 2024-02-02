/* eslint-disable jsdoc/require-jsdoc */
// Hook to handle loading roooms and people list from rest api.
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  ChatUser,
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
} from "~/generated/client";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { useViews } from "../animated-views/context/hooks/useChatTabs";
import { chatControllerViews } from "../chat-helpers";
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
    userFilters,
    updateUserFilters,
    users,
    counselorUsers,
    usersWithActiveDiscussion,
    blockedUsers,
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
      await deleteRoom(identifier);
    },
    [deleteRoom]
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
      await blockUser(currentUser, "SOFT");

      // Close discussion if it is open
      if (activeDiscussionIdentifier === currentUser.identifier) {
        setActiveDiscussionIdentifier(null);
        chatViews.goTo("overview");
      }
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

  // Whether the current user can moderate
  const canModerate = React.useMemo(
    () => currentUser.type === "STAFF",
    [currentUser.type]
  );

  // Current active discussion
  const activeDiscussionMemoized = React.useMemo(() => {
    if (!activeDiscussionIdentifier || !users || !rooms) {
      return null;
    }

    return [...users, ...rooms].find(
      (r) => r.identifier === activeDiscussionIdentifier
    );
  }, [users, rooms, activeDiscussionIdentifier]);

  return {
    activeDiscussion: activeDiscussionMemoized,
    userToBeBlocked,
    blockedUsers,
    userToBeUnblocked,
    canModerate,
    chatActivity,
    chatViews,
    closeAndBlockDiscussionWithUser,
    closeDiscussionWithUser,
    closeBlockUserDialog,
    closeCancelUnblockDialog,
    counselorUsers,
    currentUser,
    deleteCustomRoom,
    discussionInstances,
    isMobileWidth,
    loadingRooms,
    markMsgsAsRead,
    minimized,
    newChatRoom,
    openDiscussion,
    openOverview,
    openBlockUserDialog,
    openCancelUnblockDialog,
    panelLeftOpen,
    panelRightOpen,
    rooms,
    roomsPrivate: rooms.filter((r) => r.type === "WORKSPACE"),
    roomsPublic: rooms.filter((r) => r.type === "PUBLIC"),
    saveEditedRoom,
    saveNewRoom,
    roomFilters,
    toggleControlBox,
    toggleLeftPanel,
    toggleRightPanel,
    userFilters,
    unblockDiscussionWithUser,
    updateNewRoomEditor,
    updateRoomFilters,
    updateUserFilters,
    userId,
    users,
    usersWithActiveDiscussion,
  };
}

export default useChat;
