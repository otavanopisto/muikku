import * as React from "react";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import Dropdown from "../general/dropdown";

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
      <div className="chat__rooms chat__rooms--public" role="menu">
        <div className="chat__rooms-category-title">Julkiset huoneet</div>
        <PublicRoomsList />
      </div>

      <div className="chat__rooms chat__rooms--private" role="menu">
        <div className="chat__rooms-category-title">Kurssien huoneet</div>
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
    <>
      {roomsPrivate.map((room) => (
        <ChatRoom key={room.identifier} room={room} />
      ))}
    </>
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
    <>
      {roomsPublic.map((room) => (
        <ChatRoom key={room.identifier} room={room} canEdit canDelete />
      ))}
    </>
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
    <Dropdown
      key={room.identifier}
      content={room.name}
      openByHover
      alignSelf="left"
      alignSelfVertically="top"
    >
      <div key={room.identifier} className="chat__room" role="menuitem">
        <div className="chat__room-name-container" onClick={handleRoomClick}>
          <div className="chat__room-name">{room.name}</div>
        </div>
      </div>
    </Dropdown>
  );
}

export { ChatRoomsLists, ChatRoom };
