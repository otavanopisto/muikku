import * as React from "react";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import Dropdown from "../general/dropdown";
import { sortRoomsAplhabetically } from "./chat-helpers";

/**
 * ChatRoomsListsProps
 */
/* interface ChatRoomsListsProps {
  onClick: () => void;
} */

/**
 * ChatRoomsLists
 * @param props props
 * @returns JSX.Element
 */
/* function ChatRoomsLists(props: ChatRoomsListsProps) {
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
} */

/**
 * PrivateRoomListProps
 */
interface PrivateRoomListProps {
  onItemClick?: () => void;
}

/**
 * RoomsList
 * @param props props
 * @returns JSX.Element
 */
function PrivateRoomList(props: PrivateRoomListProps) {
  const { onItemClick } = props;

  const { roomsPrivate, loadingRooms, activeDiscussion, openDiscussion } =
    useChatContext();

  /**
   * handleRoomItemClick
   * @param identifier identifier
   */
  const handleRoomItemClick = (identifier: string) => {
    openDiscussion(identifier);
    onItemClick && onItemClick();
  };

  if (loadingRooms) {
    return <div>...</div>;
  }

  if (roomsPrivate.length === 0) {
    return <div>No rooms</div>;
  }

  const sortedRooms = roomsPrivate.sort(sortRoomsAplhabetically);

  return (
    <>
      {sortedRooms.map((room) => (
        <ChatRoom
          key={room.identifier}
          room={room}
          isActive={activeDiscussion?.identifier === room.identifier}
          onItemClick={handleRoomItemClick}
        />
      ))}
    </>
  );
}

/**
 * PublicRoomsListProps
 */
interface PublicRoomsListProps {
  onItemClick?: () => void;
}

/**
 * PublicRoomsList
 * @param props props
 * @returns JSX.Element
 */
function PublicRoomsList(props: PublicRoomsListProps) {
  const { onItemClick } = props;

  const { roomsPublic, loadingRooms, openDiscussion, activeDiscussion } =
    useChatContext();

  /**
   * handleRoomItemClick
   * @param identifier identifier
   */
  const handleRoomItemClick = (identifier: string) => {
    openDiscussion(identifier);
    onItemClick && onItemClick();
  };

  if (loadingRooms) {
    return <div>...</div>;
  }

  if (roomsPublic.length === 0) {
    return <div>No rooms</div>;
  }

  const sortedRooms = roomsPublic.sort(sortRoomsAplhabetically);

  return (
    <>
      {sortedRooms.map((room) => (
        <ChatRoom
          key={room.identifier}
          room={room}
          onItemClick={handleRoomItemClick}
          isActive={activeDiscussion?.identifier === room.identifier}
        />
      ))}
    </>
  );
}

/**
 * ChatRoomProps
 */
interface ChatRoomProps {
  room: ChatRoom;
  isActive: boolean;
  onItemClick?: (identifier: string) => void;
}

/**
 * ChatRoom
 * @param props props
 * @returns JSX.Element
 */
function ChatRoom(props: ChatRoomProps) {
  const { room, isActive, onItemClick } = props;

  /**
   * Handle room click
   */
  const handleRoomClick = React.useCallback(() => {
    if (onItemClick) {
      onItemClick(room.identifier);
    }
  }, [onItemClick, room.identifier]);

  const className = isActive ? "chat__room chat__active-item" : "chat__room";

  return (
    <Dropdown
      key={room.identifier}
      content={room.name}
      openByHover
      alignSelf="left"
      alignSelfVertically="top"
    >
      <div key={room.identifier} className={className} role="menuitem">
        <div className="chat__room-name-container">
          <div className="chat__room-name" onClick={handleRoomClick}>
            {room.name}
          </div>
        </div>
      </div>
    </Dropdown>
  );
}

export { PrivateRoomList, PublicRoomsList, ChatRoom };
