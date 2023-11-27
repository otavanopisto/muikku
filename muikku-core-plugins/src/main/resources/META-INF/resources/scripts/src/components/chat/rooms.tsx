import * as React from "react";
import { ChatRoom } from "~/generated/client";
import { IconButton } from "../general/button";
import { useChatContext } from "./context/chat-context";
import { AnimatePresence, motion } from "framer-motion";

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
  const { openNewChatRoom } = useChatContext();

  const handleCreateRoom = openNewChatRoom;

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
        <h4>
          Publa huoneet <IconButton icon="plus" onClick={handleCreateRoom} />
        </h4>
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

  return <div className="chat-rooms">{rooms}</div>;
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
    <ul
      className="people-list"
      style={{
        display: "flex",
        flexDirection: "column",
        marginTop: "10px",
      }}
    >
      <AnimatePresence initial={false}>
        {privateRooms.map((room) => (
          <RoomItem key={room.identifier} room={room} />
        ))}
      </AnimatePresence>
    </ul>
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
    <AnimatePresence initial={false}>
      <motion.ul
        className="people-list"
        style={{
          display: "flex",
          flexDirection: "column",
          marginTop: "10px",
        }}
      >
        <AnimatePresence initial={false}>
          {publicRooms.map((room) => (
            <RoomItem key={room.identifier} room={room} canEdit canDelete />
          ))}
        </AnimatePresence>
      </motion.ul>
    </AnimatePresence>
  );
}

/**
 * PeopleItem
 */
interface PeopleItemProps {
  room: ChatRoom;
  canEdit?: boolean;
  canDelete?: boolean;
}

const defaultRoomItemProps: Partial<PeopleItemProps> = {
  canEdit: false,
  canDelete: false,
};

/**
 * PeopleItem
 * @param props props
 * @returns JSX.Element
 */
function RoomItem(props: PeopleItemProps) {
  props = { ...defaultRoomItemProps, ...props };
  const { room } = props;
  const { openDiscussion, activeDiscussion } = useChatContext();

  const handleRoomClick = React.useCallback(() => {
    openDiscussion(room.identifier);
  }, [openDiscussion, room.identifier]);

  const isActive = activeDiscussion?.identifier === room.identifier;

  return (
    <motion.li
      key={room.identifier}
      layout
      className="people-item"
      initial={{
        opacity: 0,
        y: -100,
        height: 0,
        padding: 0,
        marginBottom: 0,
      }}
      animate={{
        opacity: 1,
        y: 0,
        height: "auto",
        padding: "10px",
        marginBottom: "10px",
      }}
      exit={{
        opacity: 0,
        y: -100,
        height: 0,
        padding: 0,
        marginBottom: 0,
      }}
      transition={{ type: "tween" }}
      style={{
        display: "flex",
        alignItems: "center",
        backgroundColor: "grey",
        borderRadius: "50px 0 0 50px",
        color: "white",
        position: "relative",
      }}
    >
      <div className="people-item__name" onClick={handleRoomClick}>
        {room.name} {isActive && "(active)"}
      </div>
    </motion.li>
  );
}

export { Rooms, RoomItem };
