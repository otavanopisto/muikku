import { AnimatePresence, motion, Variants } from "framer-motion";
import { TFunction } from "i18next";
import * as React from "react";
import {
  ChatRoom,
  ChatUser,
  instanceOfChatRoom,
  instanceOfChatUser,
  ChatUserVisibilityEnum,
} from "~/generated/client";
import { OptionDefault } from "../general/react-select/types";
import { ChatView } from "./animated-views";
import AnimatedView from "./animated-views/animated-view";
import ChatDiscussion from "./chat-discussion";
import ChatOverview from "./chat-overview";

export type ActiveDiscussion = ChatRoom | ChatUser | null;

/**
 * Notification settings
 */
export interface NotificationSettings {
  notificationsEnabled: boolean;
  privateMessagesEnabled: boolean;
  publicRoomEnabled: string[];
  privateRoomEnabled: string[];
}

/**
 * ChatPermissions
 */
export interface ChatPermissions {
  canManagePublicRooms: boolean;
}

/**
 * Room type
 */
export type RoomType = "privateRoom" | "publicRoom";

/**
 * ChatUserFilter
 */
export type ChatUserFilter = "online" | "offline" | "students" | "staff";

/**
 * ChatUserFilters
 */
export interface ChatUserFilters {
  search: string;
  searchFilters: ChatUserFilter[];
}

export type ChatRoomFilter = "private" | "public";

/**
 * ChatRoomFilters
 */
export interface ChatRoomFilters {
  search: string;
  searchFilters: ChatRoomFilter[];
}
export type ChatDashBoardTab = "users" | "rooms" | "blocked";

export type ChatSettingVisibilityOption = OptionDefault<ChatUserVisibilityEnum>;

/**
 * Get room settings key
 * @param isPrivate is private
 * @returns room settings key
 */
export const getRoomSettingsKey = (isPrivate: boolean): RoomType =>
  isPrivate ? "privateRoom" : "publicRoom";

/**
 * Toggle room notification
 * @param settings settings
 * @param roomId room id
 * @param roomType room type
 * @returns new settings
 */
export const toggleRoomNotification = (
  settings: NotificationSettings,
  roomId: string,
  roomType: RoomType
): NotificationSettings => {
  const key = `${roomType}Enabled` as const;
  const enabledRooms = settings[key];

  return {
    ...settings,
    [key]: enabledRooms.includes(roomId)
      ? enabledRooms.filter((id) => id !== roomId)
      : [...enabledRooms, roomId],
  };
};

/**
 * selectOptions
 * @param t t
 */
export const selectOptions = (t: TFunction): ChatSettingVisibilityOption[] => [
  {
    label: t("labels.visibilityFilterAll", {
      ns: "chat",
    }),
    value: "ALL",
  },
  {
    label: t("labels.visibilityFilterStaff", {
      ns: "chat",
    }),
    value: "STAFF",
  },
  {
    label: t("labels.visibilityFilterNone", {
      ns: "chat",
    }),
    value: "NONE",
  },
];

/**
 * sortUsersAlphabetically
 * @param a a
 * @param b b
 */
export const sortUsersAlphabetically = (a: ChatUser, b: ChatUser) => {
  if (a.nick < b.nick) {
    return -1;
  }

  if (a.nick > b.nick) {
    return 1;
  }

  return 0;
};

/**
 * sortRoomsAplhabetically
 * @param a a
 * @param b b
 */
export const sortRoomsAplhabetically = (a: ChatRoom, b: ChatRoom) => {
  if (a.name < b.name) {
    return -1;
  }

  if (a.name > b.name) {
    return 1;
  }

  return 0;
};

/**
 * isObjEmpty
 * @param obj obj
 */
export const isObjEmpty = (obj: object) => Object.keys(obj).length === 0;

/**
 * filterUsers
 * @param users users
 * @param filters filters
 * @returns filtered users
 */
export const filterUsers = (users: ChatUser[], filters: ChatUserFilters) => {
  const { search, searchFilters } = filters;

  const filteredUsers = users.filter((user) => {
    const { nick } = user;

    const searchTerms = [nick];

    const searchTermsMatch = searchTerms.some((term) =>
      term.toLowerCase().includes(search.toLowerCase())
    );

    const searchFiltersStatusMatch = searchFilters.some((filter) => {
      switch (filter) {
        case "online":
          return user.presence === "ONLINE";
        case "offline":
          return user.presence === "OFFLINE";
        default:
          return false;
      }
    });

    const searchFiltersUserTypeMatch = searchFilters.some((filter) => {
      switch (filter) {
        case "students":
          return user.type === "STUDENT";
        case "staff":
          return user.type === "STAFF";
        default:
          return false;
      }
    });

    return (
      searchTermsMatch && searchFiltersStatusMatch && searchFiltersUserTypeMatch
    );
  });

  return filteredUsers;
};

/**
 * filterUsers
 * @param rooms users
 * @param filters filters
 * @returns filtered users
 */
export const filterRooms = (rooms: ChatRoom[], filters: ChatRoomFilters) => {
  const { search, searchFilters } = filters;

  const filteredRooms = rooms.filter((room) => {
    const { name } = room;

    const searchTerms = [name];

    const searchTermsMatch = searchTerms.some((term) =>
      term.toLowerCase().includes(search.toLowerCase())
    );

    const searchFiltersMatch = searchFilters.some((filter) => {
      switch (filter) {
        case "private":
          return room.type === "WORKSPACE";
        case "public":
          return room.type === "PUBLIC";

        default:
          return false;
      }
    });

    return searchTermsMatch && searchFiltersMatch;
  });

  return filteredRooms;
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
export const swipeConfidenceThreshold = 10000;

/**
 * swipePower
 * @param offset offset
 * @param velocity velocity
 */
export const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

/**
 * Type guard for MessageThread
 * @param value value
 * @returns value is MessageThread
 */
export const isChatRoom = (value: object): value is ChatRoom =>
  instanceOfChatRoom(value);

/**
 * Type guard for MessageThread
 * @param value value
 * @returns value is MessageThread
 */
export const isChatUser = (value: object): value is ChatUser =>
  instanceOfChatUser(value);

/**
 * generateHash
 * @param string string
 * @returns hash
 */
export const generateHash = (string: string) => {
  let hash = 0;
  let chr = 0;

  if (string.length === 0) return hash;

  for (let i = 0; i < string.length; i++) {
    chr = string.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

/**
 * parseLines
 * @param value value
 * @returns parsed lines
 */
export const parseLines = (value: string) =>
  value.split("\n").map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));

/**
 * List of controller panel views
 */
export const chatControllerViews: ChatView[] = [
  {
    name: "Overview",
    identifier: "overview",
    component: (
      <AnimatedView>
        <ChatOverview />
      </AnimatedView>
    ),
  },
  {
    name: "Discussion",
    identifier: "discussion",
    component: (
      <AnimatedView>
        <ChatDiscussion />
      </AnimatedView>
    ),
  },
];

const resizerVariants: Variants = {
  hidden: {
    backgroundColor: "rgba(0, 0, 0, 0)",
    transition: {
      duration: 0.2,
    },
  },
  visible: {
    scale: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    transition: {
      duration: 0.2,
    },
  },
  visiblepad: {
    scale: 2,
    backgroundColor: "rgba(1, 1, 1, 0.5)",
    transition: {
      duration: 0.2,
    },
  },
  hoverdesktop: {
    scale: 1.5,
    backgroundColor: "rgba(1, 1, 1, 0.5)",
    transition: {
      duration: 0.2,
    },
  },
};

/**
 * ResizerHandleProps
 */
interface ResizerHandleProps {
  visible: boolean;
  isPad: boolean;
  direction?: "tl" | "t" | "tr" | "r" | "l" | "bl" | "b" | "br";
}

/**
 * ResizerHandle
 * @param props props
 */
export const ResizerHandle = React.forwardRef<
  HTMLDivElement,
  ResizerHandleProps
>((props, ref) => {
  const { visible, direction, isPad } = props;

  let className = "chat__resizer";

  if (direction) {
    className += ` chat__resizer-${direction}`;
  }

  const activeVariants = visible ? ["visible"] : ["hidden"];
  let hoverVariant = "hoverdesktop";

  if (isPad) {
    activeVariants.push("visiblepad");
    hoverVariant = undefined;
  }

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          role="button"
          ref={ref}
          className={className}
          variants={resizerVariants}
          initial={["hidden"]}
          animate={activeVariants}
          exit={["hidden"]}
          whileHover={hoverVariant}
        />
      )}
    </AnimatePresence>
  );
});

ResizerHandle.displayName = "ResizerHandle";
