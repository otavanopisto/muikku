import * as React from "react";
import Button, { IconButton } from "../general/button";
import ChatRoomNewDialog from "./dialogs/chat-room-new-dialog";
import { motion } from "framer-motion";
import { useChatContext } from "./context/chat-context";
import { ChatUser } from "~/generated/client";
import ChatProfile from "./chat-profile";

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

  /**
   * Handles open discussion
   */
  const handleOpenDiscussion = React.useCallback(
    (targetIdentifier: string) =>
      (
        e:
          | React.MouseEvent<HTMLDivElement, MouseEvent>
          | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      ) => {
        e.stopPropagation();
        openDiscussion(targetIdentifier);
      },
    [openDiscussion]
  );

  /**
   * renderContent
   * @returns JSX.Element
   */
  const renderContent = () => {
    if (filteredUsers.length === 0) {
      return <div style={{ textAlign: "center" }}>Ei käyttäjiä</div>;
    }

    return filteredUsers.map((user) => (
      <OverviewListItem
        key={user.id}
        onOpenClick={handleOpenDiscussion(user.identifier)}
      >
        <OverviewListItemContent>
          <ChatProfile user={user} />
        </OverviewListItemContent>
        <OverviewListItemActions>
          <OverviewListItemAction>
            <IconButton
              icon="chat"
              onClick={handleOpenDiscussion(user.identifier)}
            />
          </OverviewListItemAction>
        </OverviewListItemActions>
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat-overview-users-list"
      emptyMsg="Haulla ei löytyny käyttäjä"
    >
      {renderContent()}
    </OverviewList>
  );
}

/**
 * ChatOverviewBlockedList
 * @returns JSX.Element
 */
function ChatOverviewBlockedList() {
  const { searchUsers, blockedUsers, openDiscussion, openCancelUnblockDialog } =
    useChatContext();

  const filteredUsers = React.useMemo(() => {
    if (!searchUsers) {
      return blockedUsers;
    }

    return blockedUsers.filter((user) => user.nick.includes(searchUsers));
  }, [searchUsers, blockedUsers]);

  /**
   * Handles open discussion
   */
  const handleOpenDiscussion = React.useCallback(
    (targetIdentifier: string) =>
      (
        e:
          | React.MouseEvent<HTMLDivElement, MouseEvent>
          | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      ) => {
        e.stopPropagation();
        openDiscussion(targetIdentifier);
      },
    [openDiscussion]
  );

  /**
   * Handles open unblock dialog
   */
  const handleOpenUnblockDialog = React.useCallback(
    (user: ChatUser) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      openCancelUnblockDialog(user);
    },
    [openCancelUnblockDialog]
  );

  /**
   * renderContent
   * @returns JSX.Element
   */
  const renderContent = () => {
    if (filteredUsers.length === 0) {
      return <div style={{ textAlign: "center" }}>Ei käyttäjiä</div>;
    }

    return filteredUsers.map((user) => (
      <OverviewListItem
        key={user.id}
        onOpenClick={handleOpenDiscussion(user.identifier)}
      >
        <OverviewListItemContent>
          <ChatProfile user={user} />
        </OverviewListItemContent>

        <OverviewListItemActions>
          <OverviewListItemAction>
            <IconButton
              icon="blocked"
              onClick={handleOpenUnblockDialog(user)}
            />
            <IconButton
              icon="chat"
              onClick={handleOpenDiscussion(user.identifier)}
            />
          </OverviewListItemAction>
        </OverviewListItemActions>
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat-overview-users-list"
      emptyMsg="Haulla ei löytyny käyttäjiä tai käyttäjiä ei ole estetty"
    >
      {renderContent()}
    </OverviewList>
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

  /**
   * Handles open discussion
   */
  const handleOpenDiscussion = React.useCallback(
    (targetIdentifier: string) =>
      (
        e:
          | React.MouseEvent<HTMLDivElement, MouseEvent>
          | React.MouseEvent<HTMLAnchorElement, MouseEvent>
      ) => {
        e.stopPropagation();
        openDiscussion(targetIdentifier);
      },
    [openDiscussion]
  );

  /**
   * renderContent
   * @returns JSX.Element
   */
  const renderContent = () => {
    if (filteredRooms.length === 0) {
      return <div style={{ textAlign: "center" }}>Ei huoneita</div>;
    }

    return filteredRooms.map((room) => (
      <OverviewListItem
        key={room.identifier}
        onOpenClick={handleOpenDiscussion(room.identifier)}
      >
        <OverviewListItemContent>
          <h4>{room.name}</h4>
        </OverviewListItemContent>
        <OverviewListItemActions>
          <OverviewListItemAction>
            <IconButton
              icon="chat"
              onClick={handleOpenDiscussion(room.identifier)}
            />
          </OverviewListItemAction>
        </OverviewListItemActions>
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat-overview-rooms-list"
      emptyMsg="Haulla ei löytyny käyttäjä"
    >
      {renderContent()}
    </OverviewList>
  );
}

/**
 * OverviewListProps
 */
interface OverviewListProps {
  children: React.ReactNode;
  emptyMsg: string;
  className?: string;
  classNameModifiers?: string[];
}

/**
 * OverviewList
 * @param props props
 */
function OverviewList(props: OverviewListProps) {
  const { children, className, classNameModifiers } = props;

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

/**
 * ChatOverviewListItemProps
 */
interface OverviewListItemProps {
  onOpenClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

/**
 * OverviewListItem
 * @param props props
 */
export const OverviewListItem: React.FC<OverviewListItemProps> = (props) => {
  const { onOpenClick } = props;

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
      onClick={onOpenClick}
    >
      {props.children}
    </motion.div>
  );
};

/**
 * OverviewListItemContentProps
 */
interface OverviewListItemContentProps {}

/**
 * OverviewListItemContent
 * @param props props
 */
export const OverviewListItemContent: React.FC<OverviewListItemContentProps> = (
  props
) => {
  const { children } = props;

  return (
    <div
      className="chat-overview-users-list-item-user-info"
      style={{
        display: "flex",
      }}
    >
      {children}
    </div>
  );
};

/**
 * OverviewListItemMainContentProps
 */
interface OverviewListItemActionsProps {}

/**
 * OverviewListItemActions
 * @param props props
 */
export const OverviewListItemActions: React.FC<OverviewListItemActionsProps> = (
  props
) => {
  const { children } = props;

  return (
    <div className="chat-overview-rooms-list-item-actions">{children}</div>
  );
};

/**
 * OverviewListItemActionProps
 */
interface OverviewListItemActionProps {}

/**
 * OverviewListItemAction
 * @param props props
 */
export const OverviewListItemAction: React.FC<OverviewListItemActionProps> = (
  props
) => {
  const { children } = props;

  return <div className="chat-overview-rooms-list-item-action">{children}</div>;
};

export default ChatOverview;
