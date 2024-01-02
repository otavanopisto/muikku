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
import ChatOverview from "./chat-overview";

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

  let className = "chat-window__resizer";

  if (direction) {
    className += ` chat-window__resizer-${direction}`;
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
