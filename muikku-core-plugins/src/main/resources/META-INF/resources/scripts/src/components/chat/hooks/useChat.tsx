// Hook to handle loading roooms and people list from rest api.
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  ChatRoom,
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
} from "~/generated/client";
import useIsAtBreakpoint from "~/hooks/useIsAtBreakpoint";
import { useViews } from "../animated-views/context/hooks/useChatTabs";
import { chatControllerViews } from "../chat-helpers";
import usePeople from "./usePeople";
import useRooms from "./useRooms";
import variables from "~/sass/_exports.scss";

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
  const chatViews = useViews({
    views: chatControllerViews,
  });

  // Whether to show the control box or bubble
  const [minimized, setMinimized] = React.useState<boolean>(true);

  const [detached, setDetached] = React.useState<boolean>(false);
  const [fullScreen, setFullScreen] = React.useState<boolean>(false);

  // Panel states
  const [rightPanelOpen, setRightPanelOpen] = React.useState<boolean>(false);
  const [leftPanelOpen, setLeftPanelOpen] = React.useState<boolean>(false);

  const [activeRoomOrPerson, setActiveRoomOrPerson] =
    React.useState<string>(null);

  const [newChatRoom, setNewChatRoom] = React.useState<CreateChatRoomRequest>({
    name: "",
    description: "",
  });

  const [editChatRoom, setEditChatRoom] = React.useState<UpdateChatRoomRequest>(
    {
      name: "",
      description: "",
    }
  );

  const [roomIdentifierToEdit, setRoomIdentifierToEdit] =
    React.useState<string>(null);

  const [roomsSelected, setRoomsSelected] = React.useState<string[]>([]);

  // Ref to store and track window position
  const windowPositonRef = React.useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>(null);

  const mobileBreakpoint = parseInt(variables.mobileBreakpointXl);
  const isMobileWidth = useIsAtBreakpoint(mobileBreakpoint);

  const currentEditorValues = React.useMemo(() => {
    if (roomIdentifierToEdit) {
      return editChatRoom;
    } else {
      return newChatRoom;
    }
  }, [roomIdentifierToEdit, editChatRoom, newChatRoom]);

  // These are the all the rooms that are opened
  // sorted by roomsSelected array
  const openRooms = React.useMemo(
    () =>
      [...rooms, ...people]
        .filter((r) => roomsSelected.includes(r.identifier))
        .sort((a, b) => {
          const aIndex = roomsSelected.indexOf(a.identifier);
          const bIndex = roomsSelected.indexOf(b.identifier);

          return aIndex - bIndex;
        }),
    [rooms, people, roomsSelected]
  );

  React.useEffect(() => {
    if (isMobileWidth) {
      windowPositonRef.current = null;
      setDetached(false);
    }
  }, [isMobileWidth]);

  /**
   * saveNewRoom
   */
  const saveEditorChanges = React.useCallback(async () => {
    if (roomIdentifierToEdit) {
      await updateRoom(roomIdentifierToEdit, editChatRoom);
    } else {
      await createNewRoom(newChatRoom);
      setNewChatRoom({
        name: "",
        description: "",
      });
    }
    chatViews.goTo("overview");
  }, [
    chatViews,
    createNewRoom,
    editChatRoom,
    newChatRoom,
    roomIdentifierToEdit,
    updateRoom,
  ]);

  /**
   * updateRoomEditor
   * @param key key
   * @param value value
   */
  const updateRoomEditor = <T extends keyof ChatRoom>(
    key: T,
    value: ChatRoom[T]
  ) => {
    if (roomIdentifierToEdit) {
      setEditChatRoom((editChatRoom) => ({
        ...editChatRoom,
        [key]: value,
      }));
    } else {
      setNewChatRoom((newChatRoom) => ({
        ...newChatRoom,
        [key]: value,
      }));
    }
  };

  /**
   * deleteRoom
   */
  const deleteCustomRoom = React.useCallback(
    async (identifier: string) => {
      await deleteRoom(identifier);
    },
    [deleteRoom]
  );

  /**
   * openNewChatRoom
   */
  const openNewChatRoom = React.useCallback(() => {
    chatViews.goTo("room-editor");
  }, [chatViews]);

  /**
   * openEditChatRoom
   */
  const openEditChatRoom = React.useCallback(
    (roomIdentifier: string) => {
      chatViews.goTo("room-editor");
      const room = rooms.find((r) => r.identifier === roomIdentifier);
      if (room) {
        unstable_batchedUpdates(() => {
          setEditChatRoom({
            name: room.name,
            description: room.description,
          });
          setRoomIdentifierToEdit(roomIdentifier);
        });
      }
    },
    [chatViews, rooms]
  );

  /**
   * cancelRoomEditor
   */
  const cancelRoomEditor = React.useCallback(() => {
    chatViews.goTo("overview");
    setRoomIdentifierToEdit(null);
  }, [chatViews]);

  // Toggles the control box
  const toggleControlBox = React.useCallback(() => {
    setMinimized((minimized) => !minimized);
  }, []);

  // Sets the active room or person
  const openDiscussion = React.useCallback(
    (identifier: string) => {
      chatViews.goTo("discussion");
      setActiveRoomOrPerson(identifier);
    },
    [chatViews]
  );

  const toggleRightPanel = React.useCallback((nextState?: boolean) => {
    if (nextState !== undefined) {
      setRightPanelOpen(nextState);
    } else {
      setRightPanelOpen((rightPanelOpen) => !rightPanelOpen);
    }
  }, []);

  const toggleLeftPanel = React.useCallback((nextState?: boolean) => {
    if (nextState !== undefined) {
      setLeftPanelOpen(nextState);
    } else {
      setLeftPanelOpen((leftPanelOpen) => !leftPanelOpen);
    }
  }, []);

  const toggleFullscreen = React.useCallback(() => {
    setFullScreen((prev) => !prev);
  }, []);

  const toggleDetached = React.useCallback(() => {
    setDetached((prev) => !prev);
  }, []);

  return {
    userId,
    loadingPeople,
    loadingRooms,
    people,
    rooms,
    activeDiscussion: [...people, ...rooms].find(
      (r) => r.identifier === activeRoomOrPerson
    ),
    publicRooms: rooms.filter((r) => r.type === "PUBLIC"),
    privateRooms: rooms.filter((r) => r.type === "WORKSPACE"),
    searchPeople,
    searchRooms,
    roomsSelected,
    setRoomsSelected,
    openRooms,
    minimized,
    toggleControlBox,
    chatViews,
    openNewChatRoom,
    openEditChatRoom,
    cancelRoomEditor,
    updateRoomEditor,
    currentEditorValues,
    saveEditorChanges,
    deleteCustomRoom,
    openDiscussion,
    isMobileWidth,
    toggleRightPanel,
    toggleLeftPanel,
    leftPanelOpen,
    rightPanelOpen,
    windowPositonRef,
    toggleFullscreen,
    toggleDetached,
    detached,
    fullScreen,
  };
}

export default useChat;
