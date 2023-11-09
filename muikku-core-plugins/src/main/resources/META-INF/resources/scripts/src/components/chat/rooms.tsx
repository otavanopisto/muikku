import * as React from "react";
import MApi from "~/api/api";
import {
  ChatRoom,
  CreateChatRoomRequest,
  UpdateChatRoomRequest,
} from "~/generated/client";
import { IconButton } from "../general/button";
import { useChatContext } from "./context/chat-context";

const chatApi = MApi.getChatApi();

/**
 * RoomsProps
 */
interface RoomsProps {}

/**
 * Rooms
 * @param props props
 * @returns JSX.Element
 */
function Rooms(props: RoomsProps) {
  const [createNewRoom, setCreateNewRoom] = React.useState<boolean>(false);
  const [newRoom, setNewRoom] = React.useState<CreateChatRoomRequest>({
    name: "",
    description: "",
  });

  const saveRoom = async () => {
    await chatApi.createChatRoom({
      createChatRoomRequest: newRoom,
    });

    setCreateNewRoom(false);
    setNewRoom({
      name: "",
      description: "",
    });
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setNewRoom((newRoom) => ({
      ...newRoom,
      name: e.target.value,
    }));
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.persist();
    setNewRoom((newRoom) => ({
      ...newRoom,
      description: e.target.value,
    }));
  };

  return (
    <div
      className="chat-rooms"
      style={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="chat-room-editor">
        <div
          className="chat-room-editor__button"
          onClick={() => setCreateNewRoom(!createNewRoom)}
        >
          {createNewRoom ? "Sulje" : "Luo uusi huone"}
        </div>
        {createNewRoom && (
          <div className="chat-room-editor__form">
            <input
              type="text"
              placeholder="Nimi"
              onChange={handleTitleChange}
              value={newRoom.name || ""}
            />
            <input
              type="text"
              placeholder="Kuvaus"
              onChange={handleDescriptionChange}
              value={newRoom.description || ""}
            />
            <button onClick={saveRoom}>Tallenna</button>
          </div>
        )}
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          marginBottom: "10px",
        }}
      >
        <h4>Publa huoneet</h4>
        <PublicRoomsList />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4>Priva huoneet</h4>
        <PrivateRoomList />
      </div>
    </div>
  );
}

/**
 * RoomsList
 * @returns JSX.Element
 */
function PrivateRoomList() {
  const { privateRooms, loadingRooms } = useChatContext();

  if (loadingRooms) {
    return <div>Loading...</div>;
  }

  if (privateRooms.length === 0) {
    return <div>No rooms found</div>;
  }

  return (
    <div
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
      }}
    >
      {privateRooms.map((room) => (
        <RoomItem key={room.identifier} room={room} />
      ))}
    </div>
  );
}

/**
 * RoomsList
 * @returns JSX.Element
 */
function PublicRoomsList() {
  const { publicRooms, loadingRooms } = useChatContext();

  if (loadingRooms) {
    return <div>Loading...</div>;
  }

  if (publicRooms.length === 0) {
    return <div>No rooms found</div>;
  }

  return (
    <div
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
      }}
    >
      {publicRooms.map((room) => (
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

  const [edit, setEdit] = React.useState<boolean>(false);
  const [editedRoom, setEditedRoom] = React.useState<UpdateChatRoomRequest>({
    name: room.name || "",
    description: room.description || "",
  });

  const saveEdited = async () => {
    await chatApi.updateChatRoom({
      identifier: room.identifier,
      updateChatRoomRequest: editedRoom,
    });

    setEdit(false);
  };

  const deleteRoom = async () => {
    await chatApi.deleteChatRoom({
      identifier: room.identifier,
    });
  };

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
    >
      {edit ? (
        <div className="people-item__edit">
          <input
            type="text"
            placeholder="Nimi"
            onChange={(e) => {
              e.persist();
              setEditedRoom((editedRoom) => ({
                ...editedRoom,
                name: e.target.value,
              }));
            }}
            value={editedRoom.name || ""}
          />
          <input
            type="text"
            placeholder="Kuvaus"
            onChange={(e) => {
              e.persist();
              setEditedRoom((editedRoom) => ({
                ...editedRoom,
                description: e.target.value,
              }));
            }}
            value={editedRoom.description || ""}
          />
          <button onClick={saveEdited}>Tallenna</button>
        </div>
      ) : (
        <div className="people-item__name">
          {room.name}
          <IconButton icon="chat" onClick={handleRoomClick} />
          <IconButton icon="pencil" onClick={() => setEdit(true)} />
          <IconButton icon="trash" onClick={deleteRoom} />
        </div>
      )}
    </div>
  );
}

export { Rooms, RoomItem };
