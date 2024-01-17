import * as React from "react";
import Button, { IconButton } from "../general/button";
import ChatProfileAvatar from "./chat-profile-avatar";
import ChatRoomNewDialog from "./dialogs/chat-room-new-dialog";
import { motion } from "framer-motion";
import { useChatContext } from "./context/chat-context";
import { ChatRoom, ChatUser } from "~/generated/client";
import ChatUnblockDiscussionDialog from "./dialogs/chat-unblock-discussion-dialog";

type OverviewTab = "users" | "rooms" | "blocked";

/**
 * ChatOverview
 * @returns JSX.Element
 */
function ChatOverview() {
  const { searchRooms, updateSearchRooms, searchUsers, updateSearchUsers } =
    useChatContext();
  const [activeTab, setActiveTab] = React.useState<OverviewTab>("users");

  const handleOnTabChange = React.useCallback(
    (tab: OverviewTab) => {
      setActiveTab(tab);
    },
    [setActiveTab]
  );

  /**
   * Handles search change
   */
  const handleSearchChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      switch (activeTab) {
        case "users":
        case "blocked":
          updateSearchUsers(e.target.value);
          break;
        case "rooms":
          updateSearchRooms(e.target.value);
          break;
      }
    },
    [activeTab, updateSearchRooms, updateSearchUsers]
  );

  const searchValue = React.useMemo(() => {
    switch (activeTab) {
      case "users":
      case "blocked":
        return searchUsers;
      case "rooms":
        return searchRooms;
      default:
        return "";
    }
  }, [activeTab, searchRooms, searchUsers]);

  const content = React.useMemo(() => {
    switch (activeTab) {
      case "users":
        return <ChatOverviewUsersList />;
      case "blocked":
        return <ChatOverviewBlockedList />;
      case "rooms":
        return <ChatOverviewRoomsList />;
      default:
        return null;
    }
  }, [activeTab]);

  /* const filterContent = React.useMemo(() => {
    switch (activeTab) {
      case "users":
        return (
          <div
            className="chat-overview-filter"
            style={{
              display: "flex",
              flexDirection: "column",
              marginBottom: "10px",
            }}
          >
            <div
              className="chat-overview-filter-title"
              style={{
                marginBottom: "5px",
              }}
            >
              Suodatus
            </div>
            <div
              className="chat-overview-filter-content"
              style={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div
                className="chat-overview-filter-content-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    marginRight: "5px",
                  }}
                />
                <label>Näytä vain paikalla olevat</label>
              </div>
              <div
                className="chat-overview-filter-content-item"
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "5px",
                }}
              >
                <input
                  type="checkbox"
                  style={{
                    marginRight: "5px",
                  }}
                />
                <label>Näytä vain keskustelussa olevat</label>
              </div>
            </div>
          </div>
        );
      case "rooms":
        return null;
      default:
        return null;
    }
  }, [activeTab]); */

  return (
    <div
      className="chat-overview"
      style={{
        height: "100%",
        padding: "10px",
        display: "flex",
        flexDirection: "column",
        position: "absolute",
        inset: 0,
      }}
    >
      <ChatOverviewHeader
        activeTab={activeTab}
        onTabChange={handleOnTabChange}
      />
      <main
        style={{
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
      >
        <div
          className="chat-overview-search"
          style={{
            margin: "10px 0",
            display: "flex",
          }}
        >
          <input
            type="text"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
            style={{
              width: "100%",
              padding: "5px",
            }}
          />
          <IconButton icon="filter" />
        </div>
        {content}
      </main>
    </div>
  );
}

/**
 * ChatOverviewHeaderProps
 */
interface ChatOverviewHeaderProps {
  activeTab?: OverviewTab;
  onTabChange?: (tab: OverviewTab) => void;
}

/**
 * ChatOverviewHeader
 * @param props props
 * @returns JSX.Element
 */
function ChatOverviewHeader(props: ChatOverviewHeaderProps) {
  const { onTabChange } = props;

  const handleTabClick = React.useCallback(
    (tab: OverviewTab) => {
      onTabChange && onTabChange(tab);
    },
    [onTabChange]
  );

  return (
    <div
      className="chat-overview-header"
      style={{
        display: "flex",
        alignItems: "center",
        paddingBottom: "5px",
        borderBottom: "1px solid black",
      }}
    >
      <div
        className="chat-overview-header-title"
        style={{
          marginRight: "5px",
        }}
      >
        <h2>Dashboard</h2>
      </div>
      <div
        className="vertical-divider"
        style={{
          width: "1px",
          height: "25px",
          backgroundColor: "#ccc",
        }}
      />
      <div
        className="chat-overview-header-tabs"
        style={{
          display: "flex",
          alignItems: "center",
          marginLeft: "5px",
        }}
      >
        <motion.div
          className="chat-overview-header-tab"
          animate={{
            backgroundColor: props.activeTab === "users" ? "#ccc" : "white",
          }}
          whileHover={{
            backgroundColor: "#ccc",
            cursor: "pointer",
          }}
          style={{
            padding: "5px",
            marginRight: "5px",
          }}
          onClick={() => handleTabClick("users")}
        >
          Ihmiset
        </motion.div>
        <motion.div
          className="chat-overview-header-tab"
          animate={{
            backgroundColor: props.activeTab === "blocked" ? "#ccc" : "white",
          }}
          whileHover={{
            backgroundColor: "#ccc",
            cursor: "pointer",
          }}
          style={{
            padding: "5px",
            marginRight: "5px",
          }}
          onClick={() => handleTabClick("blocked")}
        >
          Estetyt
        </motion.div>
        <motion.div
          className="chat-overview-header-tab"
          animate={{
            backgroundColor: props.activeTab === "rooms" ? "#ccc" : "white",
          }}
          whileHover={{
            backgroundColor: "#ccc",
            cursor: "pointer",
          }}
          style={{
            padding: "5px",
            marginRight: "5px",
          }}
          onClick={() => handleTabClick("rooms")}
        >
          Huoneet
        </motion.div>
      </div>
      <div
        className="chat-overview-header-actions"
        style={{
          display: "flex",
          flexGrow: 1,
          justifyContent: "flex-end",
        }}
      >
        <div className="chat-overview-header-action">
          <ChatRoomNewDialog>
            <Button icon="plus" iconPosition="left">
              Uusi huone
            </Button>
          </ChatRoomNewDialog>
        </div>
      </div>
    </div>
  );
}

/**
 * ChatOverviewUsersList
 * @returns JSX.Element
 */
function ChatOverviewUsersList() {
  const { users, searchUsers, openDiscussion } = useChatContext();

  const filteredUsers = React.useMemo(() => {
    if (!searchUsers) {
      return users;
    }

    return users.filter((user) => user.nick.includes(searchUsers));
  }, [searchUsers, users]);

  const content =
    filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <ChatOverviewUsersListItem
          key={user.id}
          chatUser={user}
          onOpenClick={openDiscussion}
        />
      ))
    ) : (
      <div style={{ textAlign: "center" }}>Ei käyttäjiä</div>
    );

  return (
    <ListContainer
      className="chat-overview-users-list"
      emptyMsg="Haulla ei löytyny käyttäjä"
    >
      {content}
    </ListContainer>
  );
}

/**
 * ChatOverviewUsersListItemProps
 */
interface ChatOverviewUsersListItemProps {
  chatUser: ChatUser;
  onOpenClick?: (targetIdentifier: string) => void;
}

/**
 * ChatOverviewUsersListItem
 *
 * @param props props
 * @returns JSX.Element
 */
function ChatOverviewUsersListItem(props: ChatOverviewUsersListItemProps) {
  const { chatUser, onOpenClick } = props;

  /**
   * Handles open discussion
   * @param e e
   */
  const handleOpenDiscussion = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onOpenClick && onOpenClick(chatUser.identifier);
  };

  return (
    <motion.div
      className="chat-overview-users-list-item"
      whileHover={{
        backgroundColor: "#ccc",
        cursor: "pointer",
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
        borderBottom: "1px solid #ccc",
      }}
      onClick={handleOpenDiscussion}
    >
      <div
        className="chat-overview-users-list-item-user-info"
        style={{
          display: "flex",
        }}
      >
        <div className="chat-overview-users-list-item-user-info-avatar">
          <ChatProfileAvatar
            hasImage={chatUser.hasImage}
            id={chatUser.id}
            nick={chatUser.nick}
            status={chatUser.isOnline ? "online" : "offline"}
          />
        </div>
        <div
          className="chat-overview-users-list-item-user-info-details"
          style={{
            marginLeft: "10px",
          }}
        >
          <h4 className="chat-overview-users-list-item-user-info-name">
            {chatUser.nick}
          </h4>
          <h5 className="chat-overview-users-list-item-user-info-status">
            {chatUser.isOnline ? "Paikalla" : "Ei paikalla"}
          </h5>
        </div>
      </div>
      <div className="chat-overview-users-list-item-actions">
        <div className="chat-overview-users-list-item-action">
          <IconButton icon="chat" onClick={handleOpenDiscussion} />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ChatOverviewBlockedList
 * @returns JSX.Element
 */
function ChatOverviewBlockedList() {
  const { searchUsers, blockedUsers, openDiscussion } = useChatContext();

  const filteredUsers = React.useMemo(() => {
    if (!searchUsers) {
      return blockedUsers;
    }

    return blockedUsers.filter((user) => user.nick.includes(searchUsers));
  }, [searchUsers, blockedUsers]);

  const content =
    filteredUsers.length > 0 ? (
      filteredUsers.map((user) => (
        <ChatOverviewBlockedlistItem
          key={user.id}
          chatUser={user}
          onOpenClick={openDiscussion}
        />
      ))
    ) : (
      <div style={{ textAlign: "center" }}>Ei käyttäjiä</div>
    );

  return (
    <ListContainer
      className="chat-overview-users-list"
      emptyMsg="Haulla ei löytyny käyttäjiä tai käyttäjiä ei ole estetty"
    >
      {content}
    </ListContainer>
  );
}

/**
 * ChatOverviewUsersListItemProps
 */
interface ChatOverviewBlockedlistItemProps {
  chatUser: ChatUser;
  onOpenClick?: (targetIdentifier: string) => void;
  onUnblockClick?: (user: ChatUser) => void;
}

/**
 * ChatOverviewUsersListItem
 *
 * @param props props
 * @returns JSX.Element
 */
function ChatOverviewBlockedlistItem(props: ChatOverviewBlockedlistItemProps) {
  const { chatUser, onOpenClick } = props;

  /**
   * Handles open discussion
   * @param e e
   */
  const handleOpenDiscussion = React.useCallback(
    (
      e:
        | React.MouseEvent<HTMLDivElement, MouseEvent>
        | React.MouseEvent<HTMLAnchorElement, MouseEvent>
    ) => {
      e.stopPropagation();
      if (onOpenClick) {
        onOpenClick(chatUser.identifier);
      }
    },
    [chatUser, onOpenClick]
  );

  return (
    <motion.div
      className="chat-overview-users-list-item"
      whileHover={{
        backgroundColor: "#ccc",
        cursor: "pointer",
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
        borderBottom: "1px solid #ccc",
      }}
      onClick={handleOpenDiscussion}
    >
      <div
        className="chat-overview-users-list-item-user-info"
        style={{
          display: "flex",
        }}
      >
        <div className="chat-overview-users-list-item-user-info-avatar">
          <ChatProfileAvatar
            hasImage={chatUser.hasImage}
            id={chatUser.id}
            nick={chatUser.nick}
            status={chatUser.isOnline ? "online" : "offline"}
          />
        </div>
        <div
          className="chat-overview-users-list-item-user-info-details"
          style={{
            marginLeft: "10px",
          }}
        >
          <h4 className="chat-overview-users-list-item-user-info-name">
            {chatUser.nick}
          </h4>
          <h5 className="chat-overview-users-list-item-user-info-status">
            {chatUser.isOnline ? "Paikalla" : "Ei paikalla"}
          </h5>
        </div>
      </div>
      <div
        className="chat-overview-users-list-item-actions"
        style={{
          display: "flex",
        }}
      >
        <div className="chat-overview-users-list-item-action">
          <ChatUnblockDiscussionDialog user={chatUser}>
            <IconButton icon="blocked" />
          </ChatUnblockDiscussionDialog>
        </div>
        <div className="chat-overview-rooms-list-item-action">
          <IconButton icon="chat" onClick={handleOpenDiscussion} />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ChatOverviewUsersList
 * @returns JSX.Element
 */
function ChatOverviewRoomsList() {
  const { rooms, searchRooms, openDiscussion } = useChatContext();

  const filteredRooms = React.useMemo(() => {
    if (!searchRooms) {
      return rooms;
    }

    return rooms.filter((room) => room.name.includes(searchRooms));
  }, [searchRooms, rooms]);

  const content =
    filteredRooms.length > 0 ? (
      filteredRooms.map((room) => (
        <ChatOverviewRoomsListItem
          key={room.identifier}
          chatRoom={room}
          onOpenClick={openDiscussion}
        />
      ))
    ) : (
      <div style={{ textAlign: "center" }}>Ei käyttäjiä</div>
    );

  return (
    <ListContainer
      className="chat-overview-rooms-list"
      emptyMsg="Haulla ei löytyny käyttäjä"
    >
      {content}
    </ListContainer>
  );
}

/**
 * ChatOverviewRoomsListItemProps
 */
interface ChatOverviewRoomsListItemProps {
  chatRoom: ChatRoom;
  onOpenClick?: (targetIdentifier: string) => void;
}

/**
 * ChatOverviewRoomsListItemProps
 * @param props props
 * @returns JSX.Element
 */
function ChatOverviewRoomsListItem(props: ChatOverviewRoomsListItemProps) {
  const { chatRoom, onOpenClick } = props;

  /**
   * Handles open discussion
   * @param e e
   */
  const handleOpenDiscussion = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onOpenClick && onOpenClick(chatRoom.identifier);
  };

  return (
    <motion.div
      className="chat-overview-rooms-list-item"
      whileHover={{
        backgroundColor: "#ccc",
        cursor: "pointer",
      }}
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "5px",
        borderBottom: "1px solid #ccc",
      }}
      onClick={handleOpenDiscussion}
    >
      <div
        className="chat-overview-rooms-list-item-room-info"
        style={{
          display: "flex",
        }}
      >
        <h4>{chatRoom.name}</h4>
      </div>
      <div className="chat-overview-rooms-list-item-actions">
        <div className="chat-overview-rooms-list-item-action">
          <IconButton icon="chat" onClick={handleOpenDiscussion} />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * ListContainerProps
 */
interface ListContainerProps {
  children: React.ReactNode;
  emptyMsg: string;
  className?: string;
  classNameModifiers?: string[];
  onScrollTop?: () => void;
  onScrollBottom?: () => void;
}

/**
 * ListContainer
 * @param props props
 */
function ListContainer(props: ListContainerProps) {
  const {
    children,
    className,
    classNameModifiers,
    onScrollTop,
    onScrollBottom,
  } = props;

  const containerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = containerRef.current;

    if (!container) {
      return;
    }

    /**
     * Handles scroll
     */
    const handleScroll = () => {
      if (container.scrollTop === 0) {
        onScrollTop && onScrollTop();
      }

      if (
        Math.abs(
          container.scrollHeight - container.clientHeight - container.scrollTop
        ) <= 1
      ) {
        onScrollBottom && onScrollBottom();
      }
    };

    container.addEventListener("scroll", handleScroll);

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  });

  let cName: string = undefined;

  if (className) {
    cName = className;
  }

  if (props.classNameModifiers) {
    classNameModifiers.forEach((modifier) => {
      cName += ` ${props.className}-${modifier}`;
    });
  }

  return (
    <div
      ref={containerRef}
      className={cName}
      style={{
        flexGrow: 1,
        overflowY: "auto",
      }}
    >
      {children}
    </div>
  );
}

export default ChatOverview;
