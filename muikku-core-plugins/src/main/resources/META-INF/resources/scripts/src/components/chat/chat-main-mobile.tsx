/* eslint-disable camelcase */
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  Variants,
} from "framer-motion";
import * as React from "react";
import ChatViews from "./animated-views";
import { useChatContext } from "./context/chat-context";
import { AddIcon } from "./chat-helpers";
import { ChatUsersList } from "./chat-users";
import { ChatRoomsLists } from "./chat-rooms";
import ChatProfile from "./chat-profile";

const PANEL_LEFT_MAX_WIDTH = 250;
const PANEL_RIGHT_MAX_WIDTH = 200;

const leftPanelVariants: Variants = {
  open: {
    left: 0,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
  closed: {
    left: -PANEL_LEFT_MAX_WIDTH,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
};

const rightPanelVariants: Variants = {
  open: {
    right: 0,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
  closed: {
    right: -PANEL_RIGHT_MAX_WIDTH,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
};

/**
 * Experimenting with distilling swipe offset and velocity into a single variable, so the
 * less distance a user has swiped, the more velocity they need to register as a swipe.
 * Should accomodate longer swipes and short flicks without having binary checks on
 * just distance thresholds and velocity > 0.
 */
const swipeConfidenceThreshold = 10000;
/**
 * swipePower
 * @param offset offset
 * @param velocity velocity
 */
const swipePower = (offset: number, velocity: number) =>
  Math.abs(offset) * velocity;

/**
 * ChatMainMobileProps
 */
interface ChatMainMobileProps {}

/**
 * ChatMain
 * @param props props
 */
function ChatMainMobile(props: ChatMainMobileProps) {
  const { toggleLeftPanel, toggleRightPanel, leftPanelOpen, rightPanelOpen } =
    useChatContext();

  const animationControls = useAnimationControls();

  const peoplePanelRef = React.useRef<HTMLDivElement>(null);
  const roomsPanelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    /**
     * Detech outside click to close people panel
     * @param e e
     */
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        peoplePanelRef.current &&
        !peoplePanelRef.current.contains(e.target as Node)
      ) {
        toggleLeftPanel(false);
      }
    };

    /**
     * Detech outside click to close rooms panel
     * @param e e
     */
    const handleOutsideClickRooms = (e: MouseEvent) => {
      if (
        roomsPanelRef.current &&
        !roomsPanelRef.current.contains(e.target as Node)
      ) {
        toggleRightPanel(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("mousedown", handleOutsideClickRooms);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("mousedown", handleOutsideClickRooms);
    };
  }, [toggleLeftPanel, toggleRightPanel]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <motion.div
        ref={roomsPanelRef}
        initial={false}
        animate={leftPanelOpen ? "open" : "closed"}
        variants={leftPanelVariants}
        drag="x"
        dragElastic={0.2}
        dragMomentum={false}
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        onDragEnd={(e, { offset, velocity, point }) => {
          const swipe = swipePower(offset.x, velocity.x);

          if (!leftPanelOpen && swipe >= swipeConfidenceThreshold) {
            toggleLeftPanel(true);
          }
          if (leftPanelOpen && swipe <= -swipeConfidenceThreshold) {
            toggleLeftPanel(false);
          }
        }}
        className="chat-rooms__panel"
        style={{
          background: "azure",
          position: "absolute",
          left: 0,
          bottom: 0,
          top: 0,
          zIndex: 1,
          width: `${PANEL_LEFT_MAX_WIDTH}px`,
        }}
      >
        <div
          className="chat-prooms__panel-drag-handle"
          style={{
            position: "absolute",
            width: "15px",
            right: "-15px",
            top: "0",
            bottom: "0",
          }}
        />
        <div className="chat-rooms__panel-wrapper">
          <div
            onClick={() => toggleLeftPanel()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              background: "gray",
              height: "43px",
              padding: "10px",
            }}
          >
            <AddIcon />
          </div>

          <ChatRoomsLists minimized={false} />
        </div>
      </motion.div>
      <motion.div
        animate={animationControls}
        className="chat__panel-wrapper"
        style={{
          background: "antiquewhite",
          width: "auto",
        }}
      >
        <ChatViews
          wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
        />
      </motion.div>
      <motion.div
        ref={peoplePanelRef}
        initial={false}
        animate={rightPanelOpen ? "open" : "closed"}
        variants={rightPanelVariants}
        drag="x"
        dragElastic={0.2}
        dragMomentum={false}
        dragConstraints={{
          left: 0,
          right: 0,
        }}
        onDragEnd={(e, { offset, velocity, point }) => {
          const swipe = swipePower(offset.x, velocity.x);

          if (!rightPanelOpen && swipe <= -swipeConfidenceThreshold) {
            toggleRightPanel(true);
          }
          if (rightPanelOpen && swipe >= swipeConfidenceThreshold) {
            toggleRightPanel(false);
          }
        }}
        className="chat-people__panel"
        style={{
          background: "cadetblue",
          position: "absolute",
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: 1,
          width: PANEL_RIGHT_MAX_WIDTH,
        }}
      >
        <div
          className="chat-people__panel-drag-handle"
          style={{
            position: "absolute",
            width: "15px",
            left: "-15px",
            top: "0",
            bottom: "0",
          }}
        />
        <div className="chat-people__panel-wrapper">
          <div
            onClick={() => toggleRightPanel()}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              background: "gray",
              height: "43px",
              padding: "10px",
            }}
          >
            <AddIcon />
          </div>
          <ChatUsersList minimized={false} />
          <ChatProfile
            style={{
              width: "100%",
              position: "absolute",
              bottom: 0,
              display: "flex",
              justifyContent: "space-between",
              background: "gray",
              padding: "10px",
            }}
          />
        </div>
      </motion.div>
    </div>
  );
}

export default ChatMainMobile;
