import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import MApi from "~/api/api";
import { ChatRoom } from "~/generated/client";
import { useChatWebsocketContext } from "../context/chat-websocket-context";

const chatApi = MApi.getChatApi();

/**
 * Custom hook to handle loading rooms from rest api.
 */
function useRooms() {
  const websocket = useChatWebsocketContext();

  const [rooms, setRooms] = React.useState<ChatRoom[]>([]);
  const [loadingRooms, setLoadingRooms] = React.useState<boolean>(false);
  const [searchRooms, setSearchRooms] = React.useState<string>("");

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
              rooms[index] = dataTyped;
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

  return { rooms, loadingRooms, searchRooms, setSearchRooms };
}

export default useRooms;
