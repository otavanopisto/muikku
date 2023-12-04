import * as React from "react";
import { ChatRoom } from "~/generated/client";
import { useChatContext } from "./context/chat-context";
import { AnimatePresence, motion } from "framer-motion";

/**
 * RoomsProps
 */
interface ChatRoomsListsProps {
  minimized: boolean;
}

/**
 * Rooms
 * @param props props
 * @returns JSX.Element
 */
function ChatRoomsLists(props: ChatRoomsListsProps) {
  const { minimized } = props;

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
        <PublicRoomsList minimized={minimized} />
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <h4>PH:t</h4>
        <PrivateRoomList minimized={minimized} />
      </div>
    </div>
  );

  return <div className="chat-rooms">{rooms}</div>;
}

/**
 * RoomsProps
 */
interface PrivateRoomListProps {
  minimized: boolean;
}

/**
 * RoomsList
 * @param props props
 * @returns JSX.Element
 */
function PrivateRoomList(props: PrivateRoomListProps) {
  const { minimized } = props;

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
          <ChatRoom key={room.identifier} room={room} minimized={minimized} />
        ))}
      </AnimatePresence>
    </ul>
  );
}

/**
 * PublicRoomsListProps
 */
interface PublicRoomsListProps {
  minimized: boolean;
}

/**
 * RoomsList
 * @param props props
 * @returns JSX.Element
 */
function PublicRoomsList(props: PublicRoomsListProps) {
  const { minimized } = props;

  const { publicRooms, loadingRooms } = useChatContext();

  if (loadingRooms) {
    return <div>Loading...</div>;
  }

  if (publicRooms.length === 0) {
    return <div>No rooms found</div>;
  }

  /* const variants = {
    visible: { opacity: 1, x: 0, width: "auto", marginRight: "10px" },
    minimized: { opacity: 0, x: "-100%", width: "0px", marginRight: "0px" },
  }; */

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
            <ChatRoom
              key={room.identifier}
              room={room}
              canEdit
              canDelete
              minimized={minimized}
            />
          ))}
        </AnimatePresence>
      </motion.ul>
    </AnimatePresence>
  );
}

/**
 * PeopleItem
 */
interface ChatRoomProps {
  minimized: boolean;
  room: ChatRoom;
  canEdit?: boolean;
  canDelete?: boolean;
}

const defaultRoomItemProps: Partial<ChatRoomProps> = {
  canEdit: false,
  canDelete: false,
};

/**
 * PeopleItem
 * @param props props
 * @returns JSX.Element
 */
function ChatRoom(props: ChatRoomProps) {
  props = { ...defaultRoomItemProps, ...props };
  const { room, minimized } = props;
  const { openDiscussion } = useChatContext();

  const handleRoomClick = React.useCallback(() => {
    openDiscussion(room.identifier);
  }, [openDiscussion, room.identifier]);

  /* const variants = {
    visible: { opacity: 1, width: "auto" },
    minimized: { opacity: 1, width: "auto" },
  };

  const isActive = activeDiscussion?.identifier === room.identifier; */

  // set minimized name to contain only four first letter and three dots
  const minimizedName = room.name.slice(0, 4) + "...";

  return (
    <motion.li
      key={room.identifier}
      className="people-item"
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
      <AnimatePresence initial={false}>
        <div className="people-item__name" onClick={handleRoomClick}>
          {minimized ? minimizedName : room.name}
        </div>
      </AnimatePresence>
    </motion.li>
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
  const { openNewChatRoom } = useChatContext();

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
      onClick={openNewChatRoom}
    >
      New room
    </motion.div>
  );
}

export { ChatRoomsLists, ChatRoom, ChatRoomNew };
