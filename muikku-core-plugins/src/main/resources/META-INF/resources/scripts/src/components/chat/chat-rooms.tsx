import * as React from "react";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import { motion } from "framer-motion";
import Dropdown from "../general/dropdown";
import ChatRoomNewDialog from "./dialogs/chat-room-new-dialog";

/**
 * ChatRoomsListsProps
 */
interface ChatRoomsListsProps {
  minimized: boolean;
}

/**
 * ChatRoomsLists
 * @param props props
 * @returns JSX.Element
 */
function ChatRoomsLists(props: ChatRoomsListsProps) {
  const rooms = (
    <div
      className="chat-rooms-wrapper"
      style={{
        display: "flex",
        flexDirection: "column",
        margin: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <h4>JH:t</h4>
        <PublicRoomsList />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4>PH:t</h4>
        <PrivateRoomList />
      </div>
    </div>
  );

  return <div className="chat-rooms">{rooms}</div>;
}

/**
 * RoomsProps
 */
interface PrivateRoomListProps {}

/**
 * RoomsList
 * @param props props
 * @returns JSX.Element
 */
function PrivateRoomList(props: PrivateRoomListProps) {
  const { roomsPrivate, loadingRooms } = useChatContext();

  if (loadingRooms) {
    return <div>Loading...</div>;
  }

  if (roomsPrivate.length === 0) {
    return <div>No rooms found</div>;
  }

  return (
    <ul
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
      }}
    >
      {roomsPrivate.map((room) => (
        <ChatRoom key={room.identifier} room={room} />
      ))}
    </ul>
  );
}

/**
 * PublicRoomsListProps
 */
interface PublicRoomsListProps {}

/**
 * PublicRoomsList
 * @param props props
 * @returns JSX.Element
 */
function PublicRoomsList(props: PublicRoomsListProps) {
  const { roomsPublic, loadingRooms } = useChatContext();

  if (loadingRooms) {
    return <div>Loading...</div>;
  }

  if (roomsPublic.length === 0) {
    return <div>No rooms found</div>;
  }

  return (
    <ul
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
      }}
    >
      {roomsPublic.map((room) => (
        <ChatRoom key={room.identifier} room={room} canEdit canDelete />
      ))}
    </ul>
  );
}

/**
 * ChatRoomProps
 */
interface ChatRoomProps {
  room: ChatRoom;
  canEdit?: boolean;
  canDelete?: boolean;
}

const defaultRoomItemProps: Partial<ChatRoomProps> = {
  canEdit: false,
  canDelete: false,
};

/**
 * ChatRoom
 * @param props props
 * @returns JSX.Element
 */
function ChatRoom(props: ChatRoomProps) {
  props = { ...defaultRoomItemProps, ...props };
  const { room } = props;
  const { openDiscussion } = useChatContext();

  const handleRoomClick = React.useCallback(() => {
    openDiscussion(room.identifier);
  }, [openDiscussion, room.identifier]);

  // set minimized name to contain only four first letter and three dots
  /* const minimizedName = room.name.slice(0, 4) + "..."; */

  return (
    <li
      key={room.identifier}
      className="room-item"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "grey",
        borderRadius: "50px 0 0 50px",
        color: "white",
        position: "relative",
        padding: "10px",
        marginBottom: "10px",
        width: "auto",
      }}
    >
      <Dropdown
        key={room.identifier}
        content={room.name}
        openByHover
        alignSelf="left"
        alignSelfVertically="top"
      >
        <div
          className="room-item__name"
          onClick={handleRoomClick}
          style={{
            overflow: "hidden",
            textOverflow: "'...'",
            display: "inline-block",
            whiteSpace: "nowrap",
          }}
        >
          <span>{room.name}</span>
        </div>
      </Dropdown>
    </li>
  );
}

/**
 * NewChatRoomProps
 */
interface ChatRoomNewProps {}

/**
 * NewChatRoom
 * @param props props
 * @returns JSX.Element
 */
function ChatRoomNew(props: ChatRoomNewProps) {
  return (
    <motion.div
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "grey",
        borderRadius: "50px 0 0 50px",
        color: "white",
        position: "relative",
        padding: "10px",
        margin: "10px",
        width: "auto",
      }}
    >
      <ChatRoomNewDialog>
        <motion.span
          className="new-room"
          style={{
            display: "inline-block",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "clip",
          }}
        >
          New room
        </motion.span>
      </ChatRoomNewDialog>
    </motion.div>
  );
}

export { ChatRoomsLists, ChatRoom, ChatRoomNew };
