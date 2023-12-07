import { AnimatePresence, motion } from "framer-motion";
import * as React from "react";
import {
  ChatRoom,
  ChatUser,
  instanceOfChatRoom,
  instanceOfChatUser,
} from "~/generated/client";
import { ChatView } from "./animated-views";
import AnimatedView from "./animated-views/animated-view";
import ChatDiscussion from "./chat-discussion";
import ChatProfileSettings from "./chat-profile-settings";
import ChatRoomEditor from "./editors/chat-room-editor";

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
        <h3>Overview</h3>
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
  {
    name: "Room-editor",
    identifier: "room-editor",
    component: (
      <AnimatedView>
        <ChatRoomEditor />
      </AnimatedView>
    ),
  },
  {
    name: "Chat profile settings",
    identifier: "chat-profile-settings",
    component: (
      <AnimatedView>
        <ChatProfileSettings />
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

  let className = "resizer";

  if (direction) {
    className += ` resizer-${direction}`;
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
            backgroundColor: "#e3e3e3",
            scale: 1.1,
          }}
        />
      )}
    </AnimatePresence>
  );
});

ResizerHandle.displayName = "ResizerHandle";
