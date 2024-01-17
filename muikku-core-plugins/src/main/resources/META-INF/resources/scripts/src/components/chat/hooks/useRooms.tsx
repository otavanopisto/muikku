import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import {
  ChatRoom,
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
} from "~/generated/client";
import { ChatRoomFilters } from "../chat-helpers";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * Custom hook to handle loading rooms from rest api.
 */
function useRooms() {
  const websocket = useChatWebsocketContext();

  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = React.useState<boolean>(false);

  const [roomFilters, setRoomFilters] = React.useState<ChatRoomFilters>({
    search: "",
    searchFilters: [],
  });

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    fetchRooms();
  }, []);

  /**
   * Fetch rooms
   */
  const fetchRooms = async () => {
    setLoadingRooms(true);

    const rooms = await chatApi.getChatRooms();

    unstable_batchedUpdates(() => {
      setRooms(rooms);
      setLoadingRooms(false);
    });
  };

  /**
   * createNewRoom
   * @param newRoom newRoom
   */
  const createNewRoom = async (newRoom: CreateChatRoomRequest) => {
    await chatApi.createChatRoom({
      createChatRoomRequest: newRoom,
    });
  };

  /**
   * updateRoom
   * @param identifier identifier
   * @param updatedRoom updatedRoom
   */
  const updateRoom = async (
    identifier: string,
    updatedRoom: UpdateChatRoomRequest
  ) => {
    await chatApi.updateChatRoom({
      identifier: identifier,
      updateChatRoomRequest: updatedRoom,
    });
  };

  /**
   * deleteRoom
   * @param identifier identifier
   */
  const deleteRoom = async (identifier: string) => {
    await chatApi.deleteChatRoom({
      identifier: identifier,
    });
  };

  React.useEffect(() => {
    /**
     * onChatRoomCreateMsg
     * @param data created ChatRoom.
     */
    const onChatRoomCreateMsg = (data: ChatRoom) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatRoom = JSON.parse(data);
          setRooms((rooms) => [...rooms, dataTyped]);
        }
      }
    };

    /**
     * onChatRoomUpdateMsg
     * @param data updated ChatRoom.
     */
    const onChatRoomUpdateMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatRoom = JSON.parse(data);

          setRooms((rooms) => {
            const index = rooms.findIndex(
              (room) => room.identifier === dataTyped.identifier
            );

            if (index !== -1) {
              const updateRooms = [...rooms];
              updateRooms[index] = dataTyped;
              return updateRooms;
            }

            return rooms;
          });
        }
      }
    };

    /**
     * Handles changes when ever there has happened some changes with defined message
     *
     * @param data deleted ChatRoom.
     */
    const onChatRoomDeleteMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: {
            identifier: string;
          } = JSON.parse(data);

          setRooms((rooms) => {
            const index = rooms.findIndex(
              (room) => room.identifier === dataTyped.identifier
            );

            if (index !== -1) {
              const updatedRooms = [...rooms];
              updatedRooms.splice(index, 1);
              return updatedRooms;
            }

            return rooms;
          });
        }
      }
    };

    // Adding event callback to handle changes when ever
    // there has happened some changes with that message
    websocket.addEventCallback("chat:room-created", onChatRoomCreateMsg);
    websocket.addEventCallback("chat:room-updated", onChatRoomUpdateMsg);
    websocket.addEventCallback("chat:room-deleted", onChatRoomDeleteMsg);

    return () => {
      // Remove callback when unmounting
      websocket.removeEventCallback("chat:room-created", onChatRoomCreateMsg);
      websocket.removeEventCallback("chat:room-updated", onChatRoomUpdateMsg);
      websocket.removeEventCallback("chat:room-deleted", onChatRoomDeleteMsg);
    };
  }, [websocket]);

  /**
   * Update user filters
   */
  const updateRoomFilters = React.useCallback(
    <T extends keyof ChatRoomFilters>(key: T, value: ChatRoomFilters[T]) => {
      setRoomFilters((prev) => ({
        ...prev,
        [key]: value,
      }));
    },
    []
  );

  return {
    createNewRoom,
    deleteRoom,
    loadingRooms,
    roomFilters,
    rooms,
    updateRoom,
    updateRoomFilters,
  };
}

export default useRooms;
