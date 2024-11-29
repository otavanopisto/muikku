import * as React from "react";
import { IconButton } from "../general/button";
import ChatRoomNewDialog from "./dialogs/chat-room-new-dialog";
import { useChatContext } from "./context/chat-context";
import { ChatRoom, ChatUser } from "~/generated/client";
import { ChatProfile } from "./chat-profile";
import Dropdown from "~/components/general/dropdown";
import {
  ChatDashBoardTab,
  ChatRoomFilter,
  ChatUserFilter,
  filterRooms,
  getRoomSettingsKey,
  sortRoomsAplhabetically,
} from "./chat-helpers";
import ChatRoomEditAndInfoDialog from "./dialogs/chat-room-edit-info-dialog";
import Select from "react-select";
import { OptionDefault } from "../general/react-select/types";
import { useTranslation } from "react-i18next";

/**
 * ChatOverview
 * @returns JSX.Element
 */
function ChatOverview() {
  const { roomFilters, updateRoomFilters, userFilters, updateUserFilters } =
    useChatContext();
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
            <div className="chat__button-wrapper">
              <IconButton buttonModifiers={["chat"]} icon="filter" />
            </div>
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
  activeTab?: ChatDashBoardTab;
  onTabChange?: (tab: ChatDashBoardTab) => void;
}

/**
 * ChatOverviewHeader
 * @param props props
 * @returns JSX.Element
 */
function ChatOverviewHeader(props: ChatOverviewHeaderProps) {
  const { onTabChange, activeTab } = props;

  const { isMobileWidth, chatPermissions } = useChatContext();

  const { t } = useTranslation("chat");

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
      label: t("labels.people"),
    },
    {
      value: "blocked",
      label: t("labels.blocked"),
    },
    {
      value: "rooms",
      label: t("labels.rooms"),
    },
  ];

  return (
    <div className="chat__overview-panel-header">
      <div className="chat__overview-panel-header-title">
        {t("labels.dashboard")}
      </div>
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
          {options.map((o) => (
            <div
              key={o.value}
              role="menuitem"
              className={`chat__tab ${
                activeTab === o.value ? "chat__active-item" : ""
              }`}
              onClick={() => handleTabClick(o.value)}
            >
              {o.label}
            </div>
          ))}
        </div>
      )}

      <div className="chat__overview-panel-header-actions">
        {chatPermissions.canManagePublicRooms && (
          <div className="chat__button-wrapper">
            <ChatRoomNewDialog>
              <Dropdown
                alignSelfVertically="top"
                openByHover
                content={<p>{t("actions.addRoom", { ns: "chat" })}</p>}
              >
                <IconButton
                  icon="plus"
                  buttonModifiers={[
                    "chat",
                    `${isMobileWidth && "chat-invert"}`,
                  ]}
                  iconPosition="left"
                />
              </Dropdown>
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
    dashboardBlockedUsers,
    currentUser,
    openDiscussion,
    openBlockUserDialog,
    chatActivityByUserObject,
  } = useChatContext();

  const { t } = useTranslation("chat");

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
    (user: ChatUser) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
      return null;
    }

    return dashboardUsers.map((user) => {
      const isBlocked =
        dashboardBlockedUsers &&
        dashboardBlockedUsers.find(
          (blockedUser) => blockedUser.identifier === user.identifier
        ) !== undefined;

      return (
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
            {!isBlocked && user.type === "STUDENT" && (
              <div className="chat__button-wrapper">
                <Dropdown
                  alignSelfVertically="top"
                  openByHover
                  content={<p>{t("actions.blockUser", { ns: "chat" })}</p>}
                >
                  <IconButton
                    icon="blocked"
                    buttonModifiers={["chat", "chat-block"]}
                    onClick={handleBlockClick(user)}
                  />
                </Dropdown>
              </div>
            )}
          </OverviewListItemActions>
        </OverviewListItem>
      );
    });
  };

  return (
    <OverviewList
      className="chat__overview-panel-items-container"
      emptyMsg={t("content.emptySearchMsg", {
        context: "users",
      })}
      classNameModifiers={["users"]}
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

  const { t } = useTranslation(["chat"]);

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
    (user: ChatUser) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
      return null;
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
          <div className="chat__button-wrapper">
            <Dropdown
              alignSelfVertically="top"
              openByHover
              content={<p>{t("actions.unBlockUser", { ns: "chat" })}</p>}
            >
              <IconButton
                icon="blocked"
                buttonModifiers={["chat"]}
                onClick={handleOpenUnblockDialog(user)}
              />
            </Dropdown>
          </div>
        </OverviewListItemActions>
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat__overview-panel-items-container"
      emptyMsg={t("content.emptySearchMsg", {
        context: "blockedUsers",
        ns: "chat",
      })}
      classNameModifiers={["blocked"]}
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
    rooms,
    roomFilters,
    openDiscussion,
    openDeleteRoomDialog,
    chatPermissions,
    notificationSettings,
  } = useChatContext();

  const { t } = useTranslation("chat");

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
    (room: ChatRoom) =>
      (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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
      return null;
    }

    return filteredAndSortedRooms.map((room) => (
      <OverviewListItem
        key={room.identifier}
        onOpenClick={handleOpenDiscussion(room.identifier)}
      >
        <OverviewListItemContent>{room.name}</OverviewListItemContent>

        {room.type === "PUBLIC" && chatPermissions.canManagePublicRooms ? (
          <OverviewListItemActions>
            <div className="chat__button-wrapper">
              <ChatRoomEditAndInfoDialog room={room} defaults="edit">
                <Dropdown
                  alignSelfVertically="top"
                  openByHover
                  content={<p>{t("actions.editRoom", { ns: "chat" })}</p>}
                >
                  <IconButton icon="pencil" buttonModifiers={["chat"]} />
                </Dropdown>
              </ChatRoomEditAndInfoDialog>
            </div>
            <div className="chat__button-wrapper">
              <Dropdown
                alignSelfVertically="top"
                openByHover
                content={<p>{t("actions.deleteRoom", { ns: "chat" })}</p>}
              >
                <IconButton
                  icon="trash"
                  buttonModifiers={["chat"]}
                  onClick={handleDeleteRoom(room)}
                />
              </Dropdown>
            </div>
            {notificationSettings.notificationsEnabled && (
              <ToggleRoomNotificationsButton room={room} />
            )}
          </OverviewListItemActions>
        ) : notificationSettings.notificationsEnabled ? (
          <OverviewListItemActions>
            <ToggleRoomNotificationsButton room={room} />
          </OverviewListItemActions>
        ) : null}
      </OverviewListItem>
    ));
  };

  return (
    <OverviewList
      className="chat__overview-panel-items-container"
      emptyMsg={t("content.emptySearchMsg", {
        context: "rooms",
      })}
      classNameModifiers={["rooms"]}
    >
      {renderContent()}
    </OverviewList>
  );
}

/**
 * ToggleRoomNotificationsButtonProps
 */
interface ToggleRoomNotificationsButtonProps {
  room: ChatRoom;
}

/**
 * ToggleRoomNotificationsButton
 * @param props props
 * @returns JSX.Element
 */
function ToggleRoomNotificationsButton(
  props: ToggleRoomNotificationsButtonProps
) {
  const { room } = props;
  const { toggleRoomNotificationsImmediate, notificationSettings } =
    useChatContext();
  const { t } = useTranslation("chat");

  /**
   * Handles toggle notifications
   * @param e event
   */
  const handleToggleNotifications = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    toggleRoomNotificationsImmediate(
      room.identifier,
      room.type === "WORKSPACE"
    );
  };

  return (
    <div className="chat__button-wrapper">
      {notificationSettings.publicRoomEnabled.includes(room.identifier) ? (
        <Dropdown
          alignSelfVertically="top"
          openByHover
          content={<p>{t("actions.muteRoomSounds", { ns: "chat" })}</p>}
        >
          <IconButton
            icon="sounds_on"
            buttonModifiers={["chat"]}
            onClick={handleToggleNotifications}
          />
        </Dropdown>
      ) : (
        <Dropdown
          alignSelfVertically="top"
          openByHover
          content={<p>{t("actions.activateRoomSounds", { ns: "chat" })}</p>}
        >
          <IconButton
            icon="sounds_off"
            buttonModifiers={["chat"]}
            onClick={handleToggleNotifications}
          />
        </Dropdown>
      )}
    </div>
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
      cName += ` ${props.className}--${modifier}`;
    });
  }
  // if children length is 0, return empty message
  if (React.Children.count(children) === 0) {
    return (
      <div className={cName}>
        <div className="empty empty--chat">
          <span>{props.emptyMsg}</span>
        </div>
      </div>
    );
  }

  return <div className={cName}>{children}</div>;
}

/**
 * ChatOverviewListItemProps
 */
interface OverviewListItemProps {
  children?: React.ReactNode;
  onOpenClick?: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

/**
 * OverviewListItem
 * @param props props
 */
export function OverviewListItem(props: OverviewListItemProps) {
  const { onOpenClick, children } = props;

  return (
    <div className="chat__overview-panel-item" onClick={onOpenClick}>
      {children}
    </div>
  );
}

/**
 * OverviewListItemContentProps
 */
interface OverviewListItemContentProps {
  children?: React.ReactNode;
}

/**
 * OverviewListItemContent
 * @param props props
 */
export function OverviewListItemContent(props: OverviewListItemContentProps) {
  const { children } = props;

  return <div className="chat__overview-panel-item-data">{children}</div>;
}

/**
 * OverviewListItemMainContentProps
 */
interface OverviewListItemActionsProps {
  children?: React.ReactNode;
}

/**
 * OverviewListItemActions
 * @param props props
 */
export function OverviewListItemActions(props: OverviewListItemActionsProps) {
  const { children } = props;

  return <div className="chat__overview-panel-item-actions">{children}</div>;
}

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
export function OverviewUserFilters(props: OverviewUserFiltersProps) {
  const { currentFilters, onFiltersChange } = props;

  const { t } = useTranslation("chat");

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
          <div className="filter-category__label">
            {t("labels.filterSettings")}
          </div>
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
            {t("status.offline")}
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
            {t("status.online")}
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
            {t("labels.staff")}
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
            {t("labels.students")}
          </label>
        </div>
      </div>
    </>
  );
}

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
export function OverviewRoomFilters(props: OverviewRoomFiltersProps) {
  const { currentFilters, onFiltersChange } = props;

  const { t } = useTranslation("chat");

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
          <div className="filter-category__label">
            {t("labels.filterSettings", {
              ns: "chat",
            })}
          </div>
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
            {t("labels.rooms", {
              context: "workspace",
              ns: "chat",
            })}
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
            {t("labels.rooms", {
              context: "public",
              ns: "chat",
            })}
          </label>
        </div>
      </div>
    </>
  );
}

export default ChatOverview;
