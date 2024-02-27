import * as React from "react";
import { IconButton } from "../general/button";
import ChatRoomNewDialog from "./dialogs/chat-room-new-dialog";
import { useChatContext } from "./context/chat-context";
import { ChatRoom, ChatUser } from "~/generated/client";
import ChatProfile from "./chat-profile";
import Dropdown from "../general/dropdown";
import {
  ChatDashBoardTab,
  ChatRoomFilter,
  ChatUserFilter,
  filterRooms,
  sortRoomsAplhabetically,
} from "./chat-helpers";
import ChatRoomEditAndInfoDialog from "./dialogs/chat-room-edit-info-dialog";
import Select from "react-select";
import { OptionDefault } from "../general/react-select/types";

/**
 * ChatOverview
 * @returns JSX.Element
 */
function ChatOverview() {
  const {
    roomFilters,
    updateRoomFilters,
    userFilters,
    updateUserFilters,
    canModerate,
  } = useChatContext();
  const [activeTab, setActiveTab] = React.useState<ChatDashBoardTab>("users");

  const handleOnTabChange = React.useCallback(
    (tab: ChatDashBoardTab) => {
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
          updateUserFilters("search", e.target.value);
          break;
        case "rooms":
          updateRoomFilters("search", e.target.value);
          break;
      }
    },
    [activeTab, updateRoomFilters, updateUserFilters]
  );

  const searchValue = React.useMemo(() => {
    switch (activeTab) {
      case "users":
      case "blocked":
        return userFilters.search;
      case "rooms":
        return roomFilters.search;
      default:
        return "";
    }
  }, [activeTab, roomFilters.search, userFilters.search]);

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

  const filterContent = React.useMemo(() => {
    switch (activeTab) {
      case "users":
      case "blocked":
        return (
          <OverviewUserFilters
            currentFilters={userFilters.searchFilters}
            onFiltersChange={(filters) =>
              updateUserFilters("searchFilters", filters)
            }
          />
        );
      case "rooms":
        return (
          <OverviewRoomFilters
            currentFilters={roomFilters.searchFilters}
            onFiltersChange={(filters) =>
              updateRoomFilters("searchFilters", filters)
            }
          />
        );
      default:
        return null;
    }
  }, [
    activeTab,
    roomFilters.searchFilters,
    updateRoomFilters,
    updateUserFilters,
    userFilters.searchFilters,
  ]);

  return (
    <div className="chat__overview-panel">
      <ChatOverviewHeader
        canModerate={canModerate}
        activeTab={activeTab}
        onTabChange={handleOnTabChange}
      />
      <div className="chat__overview-panel-body">
        <div className="chat__overview-panel-search-container">
          <input
            type="text"
            className="chat__textfield chat__textfield--with-filter"
            placeholder="Search"
            value={searchValue}
            onChange={handleSearchChange}
          />
          <Dropdown modifier="chat" content={filterContent}>
            <IconButton buttonModifiers={["chat"]} icon="filter" />
          </Dropdown>
        </div>
        {content}
      </div>
    </div>
  );
}

/**
 * ChatOverviewHeaderProps
 */
interface ChatOverviewHeaderProps {
  canModerate: boolean;
  activeTab?: ChatDashBoardTab;
  onTabChange?: (tab: ChatDashBoardTab) => void;
}

/**
 * ChatOverviewHeader
 * @param props props
 * @returns JSX.Element
 */
function ChatOverviewHeader(props: ChatOverviewHeaderProps) {
  const { onTabChange, canModerate, activeTab } = props;

  const { isMobileWidth } = useChatContext();

  /**
   * Handles tab click
   */
  const handleTabClick = React.useCallback(
    (tab: ChatDashBoardTab) => {
      onTabChange && onTabChange(tab);
    },
    [onTabChange]
  );

  /**
   * Handles select change
   */
  const handleSelectChange = React.useCallback(
    (option: OptionDefault<ChatDashBoardTab>) => {
      onTabChange && onTabChange(option.value);
    },
    [onTabChange]
  );

  const options: OptionDefault<ChatDashBoardTab>[] = [
    {
      value: "users",
      label: "Ihmiset",
    },
    {
      value: "blocked",
      label: "Estetyt",
    },
    {
      value: "rooms",
      label: "Huoneet",
    },
  ];

  return (
    <div className="chat__overview-panel-header">
      <div className="chat__overview-panel-header-title">Dashboard</div>
      {isMobileWidth ? (
        <Select
          className="react-select-override react-select-override--chat-mobile"
          classNamePrefix="react-select-override"
          options={options}
          value={options.find((o) => o.value === activeTab)}
          onChange={handleSelectChange}
          styles={{
            // eslint-disable-next-line jsdoc/require-jsdoc
            container: (baseStyles, state) => ({
              ...baseStyles,
              width: "fit-content",
            }),
          }}
        />
      ) : (
        <div className="chat__tabs" role="menu">
          <div
            role="menuitem"
            className={`chat__tab ${
              activeTab === "users" ? "chat__active-item" : ""
            }`}
            onClick={() => handleTabClick("users")}
          >
            Ihmiset
          </div>
          <div
            role="menuitem"
            className={`chat__tab ${
              activeTab === "blocked" ? "chat__active-item" : ""
            }`}
            onClick={() => handleTabClick("blocked")}
          >
            Estetyt
          </div>
          <div
            role="menuitem"
            className={`chat__tab ${
              activeTab === "rooms" ? "chat__active-item" : ""
            }`}
            onClick={() => handleTabClick("rooms")}
          >
            Huoneet
          </div>
        </div>
      )}

      <div className="chat__overview-panel-header-actions">
        {canModerate && (
          <div className="chat__overview-panel-header-action">
            <ChatRoomNewDialog>
              <IconButton
                icon="plus"
                buttonModifiers={[`${isMobileWidth ? "chat-invert" : "chat"}`]}
                iconPosition="left"
              />
            </ChatRoomNewDialog>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * ChatOverviewUsersList
 * @returns JSX.Element
 */
function ChatOverviewUsersList() {
  const {
    dashboardUsers,
    currentUser,
    openDiscussion,
    openBlockUserDialog,
    chatActivityByUserObject,
  } = useChatContext();

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
   * Handles block click
   */
  const handleBlockClick = React.useCallback(
    (user: ChatUser) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      openBlockUserDialog(user);
    },
    [openBlockUserDialog]
  );

  /**
   * Renders list of users or empty message
   * @returns JSX.Element
   */
  const renderContent = () => {
    if (dashboardUsers.length === 0) {
      return <div style={{ textAlign: "center" }}>Ei käyttäjiä</div>;
    }

    return dashboardUsers.map((user) => (
      <OverviewListItem
        key={user.id}
        onOpenClick={handleOpenDiscussion(user.identifier)}
      >
        <OverviewListItemContent>
          <ChatProfile
            user={user}
            primaryInfo={user.nick}
            secondaryInfo={currentUser.type === "STAFF" && user.name}
            chatActivity={chatActivityByUserObject[user.id]}
          />
        </OverviewListItemContent>
        <OverviewListItemActions>
          <IconButton
            icon="blocked"
            buttonModifiers={["chat-block"]}
            onClick={handleBlockClick(user)}
          />
        </OverviewListItemActions>
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat__overview-panel-items-container"
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
  const {
    dashboardBlockedUsers,
    currentUser,
    openDiscussion,
    openCancelUnblockDialog,
  } = useChatContext();

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
    if (dashboardBlockedUsers.length === 0) {
      return <div style={{ textAlign: "center" }}>Ei käyttäjiä</div>;
    }

    return dashboardBlockedUsers.map((user) => (
      <OverviewListItem
        key={user.id}
        onOpenClick={handleOpenDiscussion(user.identifier)}
      >
        <OverviewListItemContent>
          <ChatProfile
            user={user}
            primaryInfo={user.nick}
            secondaryInfo={currentUser.type === "STAFF" && user.name}
          />
        </OverviewListItemContent>

        <OverviewListItemActions>
          <IconButton
            icon="blocked"
            buttonModifiers={["chat"]}
            onClick={handleOpenUnblockDialog(user)}
          />
        </OverviewListItemActions>
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat__overview-panel-items-container"
      emptyMsg="Haulla ei löytyny käyttäjiä tai käyttäjiä ei ole estetty"
    >
      {renderContent()}
    </OverviewList>
  );
}

/**
 * ChatOverviewRoomsList
 * @returns JSX.Element
 */
function ChatOverviewRoomsList() {
  const {
    canModerate,
    rooms,
    roomFilters,
    openDiscussion,
    openDeleteRoomDialog,
  } = useChatContext();

  const filteredAndSortedRooms = React.useMemo(() => {
    if (!roomFilters) {
      return rooms;
    }

    return filterRooms(rooms, roomFilters).sort(sortRoomsAplhabetically);
  }, [roomFilters, rooms]);

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
   * Handles delete room
   */
  const handleDeleteRoom = React.useCallback(
    (room: ChatRoom) => (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      openDeleteRoomDialog(room);
    },
    [openDeleteRoomDialog]
  );

  /**
   * renderContent
   * @returns JSX.Element
   */
  const renderContent = () => {
    if (filteredAndSortedRooms.length === 0) {
      return <div style={{ textAlign: "center" }}>Ei huoneita</div>;
    }

    return filteredAndSortedRooms.map((room) => (
      <OverviewListItem
        key={room.identifier}
        onOpenClick={handleOpenDiscussion(room.identifier)}
      >
        <OverviewListItemContent>{room.name}</OverviewListItemContent>

        {canModerate && room.type === "PUBLIC" && (
          <OverviewListItemActions>
            <ChatRoomEditAndInfoDialog room={room} defaults="edit">
              <IconButton icon="pencil" buttonModifiers={["chat"]} />
            </ChatRoomEditAndInfoDialog>

            <IconButton
              icon="trash"
              buttonModifiers={["chat"]}
              onClick={handleDeleteRoom(room)}
            />
          </OverviewListItemActions>
        )}
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat__overview-panel-items-container"
      emptyMsg="Haulla ei löytyny huoneita"
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

  return <div className={cName}>{children}</div>;
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
    <div className="chat__overview-panel-item" onClick={onOpenClick}>
      {props.children}
    </div>
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

  return <div className="chat__overview-panel-item-data">{children}</div>;
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

  return <div className="chat__overview-panel-item-actions">{children}</div>;
};

/**
 * UserFilterProps
 */
interface OverviewUserFiltersProps {
  currentFilters: ChatUserFilter[];
  onFiltersChange?: (filters: ChatUserFilter[]) => void;
}

/**
 * OverviewUserFilters
 * @param props props
 * @returns JSX.Element
 */
export const OverviewUserFilters = (props: OverviewUserFiltersProps) => {
  const { currentFilters, onFiltersChange } = props;

  /**
   * Handles user filter change
   */
  const handleFilterChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const updatedFilters = [...currentFilters];

      // Get possible existing index of clicked value
      const indexOfActiveFilter = updatedFilters.findIndex((f) => f === value);

      // If filter is already active, remove it
      if (indexOfActiveFilter !== -1) {
        updatedFilters.splice(indexOfActiveFilter, 1);
      } else {
        updatedFilters.push(value as ChatUserFilter);
      }

      onFiltersChange && onFiltersChange(updatedFilters);
    },
    [currentFilters, onFiltersChange]
  );

  return (
    <>
      <div className="dropdown__container-item">
        <div className="filter-category">
          <div className="filter-category__label">Suodatusasetukset</div>
        </div>
      </div>
      <div className="dropdown__container-item">
        <div className="filter-item filter-item--chat">
          <input
            type="checkbox"
            value="offline"
            id="user-offline-filter"
            checked={currentFilters.includes("offline")}
            onChange={handleFilterChange}
          />
          <label htmlFor="user-offline-filter" className="filter-item__label">
            Ei paikalla
          </label>
        </div>
      </div>
      <div className="dropdown__container-item">
        <div className="filter-item filter-item--chat">
          <input
            type="checkbox"
            value="online"
            id="user-online-filter"
            checked={currentFilters.includes("online")}
            onChange={handleFilterChange}
          />
          <label htmlFor="user-online-filter" className="filter-item__label">
            Paikalla
          </label>
        </div>
      </div>
      <div className="dropdown__container-item">
        <div className="filter-item filter-item--chat">
          <input
            type="checkbox"
            value="staff"
            id="user-staff-filter"
            checked={currentFilters.includes("staff")}
            onChange={handleFilterChange}
          />
          <label htmlFor="user-staff-filter" className="filter-item__label">
            Henkilökunta
          </label>
        </div>
      </div>
      <div className="dropdown__container-item">
        <div className="filter-item filter-item--chat">
          <input
            type="checkbox"
            value="students"
            id="user-students-filter"
            checked={currentFilters.includes("students")}
            onChange={handleFilterChange}
          />
          <label htmlFor="user-students-filter" className="filter-item__label">
            Opiskelijat
          </label>
        </div>
      </div>
    </>
  );
};

/**
 * OverviewRoomFiltersProps
 */
interface OverviewRoomFiltersProps {
  currentFilters: ChatRoomFilter[];
  onFiltersChange?: (filters: ChatRoomFilter[]) => void;
}

/**
 * OverviewRoomFilters
 * @param props props
 * @returns JSX.Element
 */
export const OverviewRoomFilters = (props: OverviewRoomFiltersProps) => {
  const { currentFilters, onFiltersChange } = props;

  /**
   * Handles user filter change
   */
  const handleFilterChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      const updatedFilters = [...currentFilters];

      // Get possible existing index of clicked value
      const indexOfActiveFilter = updatedFilters.findIndex((f) => f === value);

      // If filter is already active, remove it
      if (indexOfActiveFilter !== -1) {
        updatedFilters.splice(indexOfActiveFilter, 1);
      } else {
        updatedFilters.push(value as ChatRoomFilter);
      }

      onFiltersChange && onFiltersChange(updatedFilters);
    },
    [currentFilters, onFiltersChange]
  );

  return (
    <>
      <div className="dropdown__container-item">
        <div className="filter-category">
          <div className="filter-category__label">Suodatusasetukset</div>
        </div>
      </div>
      <div className="dropdown__container-item">
        <div className="filter-item filter-item--workspace-page">
          <input
            type="checkbox"
            value="private"
            id="private-room-filter"
            checked={currentFilters.includes("private")}
            onChange={handleFilterChange}
          />
          <label htmlFor="private-room-filter" className="filter-item__label">
            Työtila -huone
          </label>
        </div>
      </div>
      <div className="dropdown__container-item">
        <div className="filter-item filter-item--workspace-page">
          <input
            type="checkbox"
            value="public"
            id="public-room-filter"
            checked={currentFilters.includes("public")}
            onChange={handleFilterChange}
          />
          <label htmlFor="public-room-filter" className="filter-item__label">
            Julkinen huone
          </label>
        </div>
      </div>
    </>
  );
};

export default ChatOverview;
