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
    <>
      <div className="chat__rooms chat__rooms--public">
        <h4>JH:t</h4>
        <PublicRoomsList />
      </div>

      <div className="chat__rooms chat__rooms--private">
        <h4>PH:t</h4>
        <PrivateRoomList />
      </div>
    </>
  );

  return <>{rooms}</>;
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
    <ul className="chat__rooms-list">
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
    <ul className="chat__rooms-list">
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
    <li key={room.identifier} className="chat__room">
      <Dropdown
        key={room.identifier}
        content={room.name}
        openByHover
        alignSelf="left"
        alignSelfVertically="top"
      >
        <div className="chat__room-title" onClick={handleRoomClick}>
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
    <motion.div>
      <ChatRoomNewDialog>
        <motion.span className="new-room">New room</motion.span>
      </ChatRoomNewDialog>
    </motion.div>
  );
}

export { ChatRoomsLists, ChatRoom, ChatRoomNew };
