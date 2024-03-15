import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";
import MApi, { isMApiError } from "~/api/api";
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
 * @param displayNotification displayNotification
 */
function useRooms(displayNotification: DisplayNotificationTriggerType) {
  const websocket = useChatWebsocketContext();

  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = React.useState<boolean>(false);

  const [roomFilters, setRoomFilters] = React.useState<ChatRoomFilters>({
    search: "",
    searchFilters: ["private", "public"],
  });

  const componentMounted = React.useRef(true);

  React.useEffect(() => {
    fetchRooms();
  }, []);

  React.useEffect(() => {
    /**
     * Handles chat room create event
     * @param data created ChatRoom.
     */
    const onChatRoomCreateMsg = (data: unknown) => {
      if (componentMounted.current) {
        if (typeof data === "string") {
          const dataTyped: ChatRoom = JSON.parse(data);
          setRooms((rooms) => [...rooms, dataTyped]);
        }
      }
    };

    /**
     * Handles chat room update event
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
   * Create new room
   * @param newRoom newRoom
   */
  const createNewRoom = React.useCallback(
    async (newRoom: CreateChatRoomRequest) => {
      try {
        await chatApi.createChatRoom({
          createChatRoomRequest: newRoom,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification("Huoneen luonti epäonnistui", "error");
      }
    },
    [displayNotification]
  );

  /**
   * Update room
   * @param identifier identifier
   * @param updatedRoom updatedRoom
   */
  const updateRoom = React.useCallback(
    async (identifier: string, updatedRoom: UpdateChatRoomRequest) => {
      try {
        await chatApi.updateChatRoom({
          identifier: identifier,
          updateChatRoomRequest: updatedRoom,
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }
        displayNotification("Huoneen päivitys epäonnistui", "error");
      }
    },
    [displayNotification]
  );

  /**
   * Delete room
   * @param identifier identifier
   */
  const deleteRoom = React.useCallback(async (identifier: string) => {
    await chatApi.deleteChatRoom({
      identifier: identifier,
    });
  }, []);

  /**
   * Update user filters
   * @param key key of filter
   * @param value value of filter
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
