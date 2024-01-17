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

export type UseChat = ReturnType<typeof useChat>;

/**
 * Custom hook for chat that groups all chat related functionality
 * @param userId userId
 * @param currentUser currentUser
 */
function useChat(userId: number, currentUser: ChatUser) {
  const websocket = useChatWebsocketContext();

  const {
    searchUsers,
    updateSearchUsers,
    users,
    counselorUsers,
    usersWithActiveDiscussion,
    blockedUsers,
    blockUser,
    unblockUser,
    onNewMgsSentUpdateActiveDiscussions,
  } = useChatUsers({ currentUser });
  const {
    searchRooms,
    rooms,
    loadingRooms,
    createNewRoom,
    updateRoom,
    deleteRoom,
    updateSearchRooms,
  } = useRooms();

  const { chatActivity, onNewMsgSentUpdateActivity } = useChatActivity();

  const chatViews = useViews({
    views: chatControllerViews,
  });

  // Shared websocket callbacks
  useWebsocketsWithCallbacks({
    "chat:message-sent": (data: unknown) => {
      onNewMgsSentUpdateActiveDiscussions(data);
      onNewMsgSentUpdateActivity(data);
    },
  });

  const [discussionInstances, setMessagesInstances] = React.useState<
    ChatDiscussionInstance[]
  >([]);

  // Whether to show the control box or bubble
  const [minimized, setMinimized] = React.useState<boolean>(true);

  // Panel states
  const [panelRightOpen, setPanelRightOpen] = React.useState<boolean>(false);
  const [panelLeftOpen, setPanelLeftOpen] = React.useState<boolean>(false);

  // Whether the current width is mobile
  const mobileBreakpoint = parseInt(variables.mobileBreakpointXl);
  const isMobileWidth = useIsAtBreakpoint(mobileBreakpoint);

  // Active room or person identifier
  const [activeRoomOrPerson, setActiveRoomOrPerson] =
    React.useState<string>(null);

  // Editor values
  const [newChatRoom, setNewChatRoom] = React.useState<CreateChatRoomRequest>({
    name: "",
    description: "",
  });

  React.useEffect(() => {
    if (minimized) {
      unstable_batchedUpdates(() => {
        setPanelRightOpen(false);
        setPanelLeftOpen(false);
      });
    }
  }, [minimized]);

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
  const toggleLeftPanel = React.useCallback((nextState?: boolean) => {
    if (nextState !== undefined) {
      setPanelLeftOpen(nextState);
    } else {
      setPanelLeftOpen((panelLeftOpen) => !panelLeftOpen);
    }
  }, []);

  // Toggles the right panel or sets it to a specific state
  const toggleRightPanel = React.useCallback((nextState?: boolean) => {
    if (nextState !== undefined) {
      setPanelRightOpen(nextState);
    } else {
      setPanelRightOpen((panelRightOpen) => !panelRightOpen);
    }
  }, []);

  /**
   * closeView
   */
  const openOverview = React.useCallback(() => {
    chatViews.goTo("overview");
  }, [chatViews]);

  // Sets the active room or person
  const openDiscussion = React.useCallback(
    (identifier: string) => {
      unstable_batchedUpdates(() => {
        if (isMobileWidth) {
          setPanelLeftOpen(false);
          setPanelRightOpen(false);
        }

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

        setActiveRoomOrPerson(identifier);
        chatViews.goTo("discussion");
      });
    },
    [chatViews, isMobileWidth, discussionInstances, userId, websocket]
  );

  /**
   * Handles closing discussion with user
   */
  const closeDiscussionWithUser = React.useCallback(
    async (currentUser: ChatUser) => {
      await blockUser(currentUser, "SOFT");

      // Close discussion if it is open
      if (activeRoomOrPerson === currentUser.identifier) {
        setActiveRoomOrPerson(null);
        chatViews.goTo("overview");
      }
    },
    [activeRoomOrPerson, blockUser, chatViews]
  );

  /**
   * Handles closing and blocking discussion with user
   */
  const closeAndBlockDiscussionWithUser = React.useCallback(
    async (currentUser: ChatUser) => {
      await blockUser(currentUser, "HARD");
    },
    [blockUser]
  );

  /**
   * unblockDiscussion
   */
  const unblockDiscussionWithUser = React.useCallback(
    async (currentUser: ChatUser) => {
      await unblockUser(currentUser);
    },
    [unblockUser]
  );

  const canModerate = React.useMemo(
    () => currentUser.type === "STAFF",
    [currentUser.type]
  );

  const activeDiscussionMemoized = React.useMemo(() => {
    if (!activeRoomOrPerson || !users || !rooms) {
      return null;
    }

    return [...users, ...rooms].find(
      (r) => r.identifier === activeRoomOrPerson
    );
  }, [users, rooms, activeRoomOrPerson]);

  return {
    activeDiscussion: activeDiscussionMemoized,
    blockedUsers,
    canModerate,
    chatActivity,
    chatViews,
    closeAndBlockDiscussionWithUser,
    closeDiscussionWithUser,
    counselorUsers,
    currentUser,
    deleteCustomRoom,
    discussionInstances,
    isMobileWidth,
    loadingRooms,
    minimized,
    newChatRoom,
    openDiscussion,
    openOverview,
    panelLeftOpen,
    panelRightOpen,
    rooms,
    roomsPrivate: rooms.filter((r) => r.type === "WORKSPACE"),
    roomsPublic: rooms.filter((r) => r.type === "PUBLIC"),
    saveEditedRoom,
    saveNewRoom,
    searchRooms,
    searchUsers,
    toggleControlBox,
    toggleLeftPanel,
    toggleRightPanel,
    unblockDiscussionWithUser,
    updateNewRoomEditor,
    updateSearchRooms,
    updateSearchUsers,
    userId,
    users,
    usersWithActiveDiscussion,
  };
}

export default useChat;
