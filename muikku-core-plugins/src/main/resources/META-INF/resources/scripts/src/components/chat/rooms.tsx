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
        <RoomItem key={room.identifier} room={room} />
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
  const { setRoomsSelected } = useChatContext();

  const handleRoomClick = React.useCallback(() => {
    setRoomsSelected((roomsSelected) => {
      if (roomsSelected.includes(room.identifier)) {
        return roomsSelected.filter((r) => r !== room.identifier);
      }
      return [...roomsSelected, room.identifier];
    });
  }, [room.identifier, setRoomsSelected]);

  return (
    <div
      className="people-item"
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "grey",
        borderRadius: "50px 0 0 50px",
        color: "white",
        padding: "10px",
        marginBottom: "10px",
      }}
      onClick={handleRoomClick}
    >
      <div className="people-item__name">{room.name} AKTIIVINEN</div>
    </div>
  );
}

export { RoomsList, RoomItem };
