// Hook to handle loading roooms and people list from rest api.
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
} from "~/generated/client";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { useViews } from "../animated-views/context/hooks/useChatTabs";
import { chatControllerViews } from "../chat-helpers";
import usePeople from "./usePeople";
import useRooms from "./useRooms";
import variables from "~/sass/_exports.scss";
import { ChatDiscussionInstance } from "../utility/chat-discussion-instance";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

export type UseChat = ReturnType<typeof useChat>;

/**
 * useChat
 * @param userId userId
 */
function useChat(userId: number) {
  const { searchPeople, people, loadingPeople } = usePeople();
  const {
    searchRooms,
    rooms,
    loadingRooms,
    createNewRoom,
    updateRoom,
    deleteRoom,
  } = useRooms();
  const websocket = useChatWebsocketContext();

  const chatViews = useViews({
    views: chatControllerViews,
  });

  const [discussionInstances, setMessagesInstances] = React.useState<
    ChatDiscussionInstance[]
  >([]);

  // Whether to show the control box or bubble
  const [minimized, setMinimized] = React.useState<boolean>(true);

  // Panel states
  const [rightPanelOpen, setRightPanelOpen] = React.useState<boolean>(false);
  const [leftPanelOpen, setLeftPanelOpen] = React.useState<boolean>(false);

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
        setRightPanelOpen(false);
        setLeftPanelOpen(false);
      });
    }
  }, [minimized]);

  const activeDiscussion = [...people, ...rooms].find(
    (r) => r.identifier === activeRoomOrPerson
  );

  const usersWithoutMe = React.useMemo(
    () => people.filter((p) => p.id !== userId),
    [people, userId]
  );

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

  // Closes current view and goes back to overview or discussion if exists
  const closeView = React.useCallback(() => {
    if (activeRoomOrPerson) {
      chatViews.goTo("discussion");
    } else {
      chatViews.goTo("overview");
    }
  }, [activeRoomOrPerson, chatViews]);

  // Toggles the control box
  const toggleControlBox = React.useCallback(() => {
    setMinimized((minimized) => !minimized);
  }, []);

  // Opens the active room or person
  const openChatProfileSettings = React.useCallback(() => {
    chatViews.goTo("chat-profile-settings");
  }, [chatViews]);

  // Toggles the left panel or sets it to a specific state
  const toggleLeftPanel = React.useCallback((nextState?: boolean) => {
    if (nextState !== undefined) {
      setLeftPanelOpen(nextState);
    } else {
      setLeftPanelOpen((leftPanelOpen) => !leftPanelOpen);
    }
  }, []);

  // Toggles the right panel or sets it to a specific state
  const toggleRightPanel = React.useCallback((nextState?: boolean) => {
    if (nextState !== undefined) {
      setRightPanelOpen(nextState);
    } else {
      setRightPanelOpen((rightPanelOpen) => !rightPanelOpen);
    }
  }, []);

  // Sets the active room or person
  const openDiscussion = React.useCallback(
    (identifier: string) => {
      unstable_batchedUpdates(() => {
        if (isMobileWidth) {
          setLeftPanelOpen(false);
          setRightPanelOpen(false);
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

  // Closes the active room or person
  const closeDiscussion = React.useCallback(() => {
    chatViews.goTo("overview");
  }, [chatViews]);

  const canModerate = React.useMemo(() => {
    const user = people.find((p) => p.id === userId);
    return (user && user.type === "STAFF") || false;
  }, [people, userId]);

  return {
    userId,
    userMe: people.find((p) => p.id === userId),
    canModerate,
    usersWithoutMe,
    loadingPeople,
    loadingRooms,
    rooms,
    activeDiscussion,
    publicRooms: rooms.filter((r) => r.type === "PUBLIC"),
    privateRooms: rooms.filter((r) => r.type === "WORKSPACE"),
    searchPeople,
    searchRooms,
    minimized,
    toggleControlBox,
    chatViews,
    openChatProfileSettings,
    newChatRoom,
    updateNewRoomEditor,
    saveNewRoom,
    saveEditedRoom,
    deleteCustomRoom,
    openDiscussion,
    closeDiscussion,
    isMobileWidth,
    toggleRightPanel,
    toggleLeftPanel,
    leftPanelOpen,
    rightPanelOpen,
    closeView,
    discussionInstances,
  };
}

export default useChat;
