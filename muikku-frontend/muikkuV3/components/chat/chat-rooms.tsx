import * as React from "react";
import { ChatActivity, ChatRoom } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import Dropdown from "../general/dropdown";
import { sortRoomsAplhabetically } from "./chat-helpers";

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

  const {
    roomsPrivate,
    loadingRooms,
    activeDiscussion,
    openDiscussion,
    chatActivityByRoomObject,
  } = useChatContext();

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
    return <div className="chat__rooms-empty">-</div>;
  }

  const sortedRooms = roomsPrivate.sort(sortRoomsAplhabetically);

  return (
    <>
      {sortedRooms.map((room) => {
        const roomId = parseInt(room.identifier.split("-")[1]);

        return (
          <ChatRoom
            key={room.identifier}
            room={room}
            isActive={activeDiscussion?.identifier === room.identifier}
            chatActivity={chatActivityByRoomObject[roomId]}
            onItemClick={handleRoomItemClick}
          />
        );
      })}
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

  const {
    roomsPublic,
    loadingRooms,
    openDiscussion,
    activeDiscussion,
    chatActivityByRoomObject,
  } = useChatContext();

  /**
   * Handles room item click
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
    return <div className="chat__rooms-empty">-</div>;
  }

  const sortedRooms = roomsPublic.sort(sortRoomsAplhabetically);

  return (
    <>
      {sortedRooms.map((room) => {
        const roomId = parseInt(room.identifier.split("-")[1]);

        return (
          <ChatRoom
            key={room.identifier}
            room={room}
            isActive={activeDiscussion?.identifier === room.identifier}
            chatActivity={chatActivityByRoomObject[roomId]}
            onItemClick={handleRoomItemClick}
          />
        );
      })}
    </>
  );
}

/**
 * ChatRoomProps
 */
interface ChatRoomProps {
  room: ChatRoom;
  isActive: boolean;
  chatActivity?: ChatActivity;
  onItemClick?: (identifier: string) => void;
}

/**
 * ChatRoom
 * @param props props
 * @returns JSX.Element
 */
function ChatRoom(props: ChatRoomProps) {
  const { room, isActive, chatActivity, onItemClick } = props;

  /**
   * Handle room click
   */
  const handleRoomClick = React.useCallback(() => {
    if (onItemClick) {
      onItemClick(room.identifier);
    }
  }, [onItemClick, room.identifier]);

  const roomClassName = isActive
    ? "chat__room chat__active-item"
    : "chat__room";

  const roomNameModifiers =
    chatActivity?.unreadMessages > 0 ? ["highlight"] : [];

  return (
    <Dropdown
      key={room.identifier}
      content={room.name}
      openByHover
      alignSelf="left"
      alignSelfVertically="top"
    >
      <div key={room.identifier} className={roomClassName} role="menuitem">
        <div className="chat__room-name-container">
          <div
            className={`chat__room-name ${roomNameModifiers
              .map((modifier) => `chat__room-name--${modifier}`)
              .join(" ")}`}
            onClick={handleRoomClick}
          >
            {room.name}
          </div>
        </div>
      </div>
    </Dropdown>
  );
}

export { PrivateRoomList, PublicRoomsList, ChatRoom };
