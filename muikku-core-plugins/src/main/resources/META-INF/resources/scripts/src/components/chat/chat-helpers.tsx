import { AnimatePresence, motion } from "framer-motion";
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

export type ChatSettingVisibilityOption = OptionDefault<ChatUserVisibilityEnum>;

export const selectOptions: ChatSettingVisibilityOption[] = [
  {
    label: "Kaikille",
    value: "ALL",
  },
  {
    label: "Henkilökunnalle",
    value: "STAFF",
  },
  {
    label: "Ei kenellekkään",
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
          return user.isOnline;
        case "offline":
          return !user.isOnline;
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

/**
 * CloseIcon
 * @returns JSX.Element
 */
export function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 20 20"
    >
      <path
        d="M 3 3 L 17 17"
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
      <path
        d="M 17 3 L 3 17"
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}

/**
 * AddIcon
 * @returns JSX.Element
 */
export function AddIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="10"
      height="10"
      viewBox="0 0 20 20"
      style={{ transform: "rotate(45deg)", stroke: "black" }}
    >
      <path
        d="M 3 3 L 17 17"
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
      <path
        d="M 17 3 L 3 17"
        fill="transparent"
        strokeWidth="3"
        strokeLinecap="round"
      ></path>
    </svg>
  );
}

/**
 * ResizerHandleProps
 */
interface ResizerHandleProps {
  visible: boolean;
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
  const { visible, direction } = props;

  let className = "chat__resizer";

  if (direction) {
    className += ` chat__resizer-${direction}`;
  }

  return (
    <AnimatePresence initial={false}>
      {visible && (
        <motion.div
          role="button"
          ref={ref}
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          whileHover={{
            backgroundColor: "#666",
            scale: 1.1,
          }}
        />
      )}
    </AnimatePresence>
  );
});

ResizerHandle.displayName = "ResizerHandle";
