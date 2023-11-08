import * as React from "react";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "./context/chat-context";

/**
 * RoomsList
 * @returns JSX.Element
 */
function RoomsList() {
  const { rooms, loadingRooms } = useChatContext();

  if (loadingRooms) {
    return <div>Loading...</div>;
  }

  if (rooms.length === 0) {
    return <div>No rooms found</div>;
  }

  return (
    <div
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      {rooms.map((room) => (
        <RoomItem key={room.id} room={room} />
      ))}
    </div>
  );
}

/**
 * PeopleItem
 */
interface PeopleItemProps {
  room: ChatRoom;
}

/**
 * PeopleItem
 * @param props props
 * @returns JSX.Element
 */
function RoomItem(props: PeopleItemProps) {
  const { room } = props;

  return (
    <div
      className="people-item"
      style={{
        display: "flex",
      }}
    >
      <div className="people-item__avatar"></div>
      <div className="people-item__name"></div>
    </div>
  );
}

export { RoomsList, RoomItem };
