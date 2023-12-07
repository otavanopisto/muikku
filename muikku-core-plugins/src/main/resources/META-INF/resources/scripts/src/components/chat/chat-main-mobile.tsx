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
    x: 0,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
  closed: {
    x: -PANEL_LEFT_MAX_WIDTH,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
};

const rightPanelVariants: Variants = {
  open: {
    x: 0,
    transition: {
      duration: 0.3,
      type: "tween",
    },
  },
  closed: {
    x: PANEL_RIGHT_MAX_WIDTH,
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

  const leftPanelConstraints = React.useRef<HTMLDivElement>(null);
  const rightPanelConstraints = React.useRef<HTMLDivElement>(null);

  const animationControls = useAnimationControls();

  const leftPanelAnimateControls = useAnimationControls();
  const rightPanelAnimateControls = useAnimationControls();

  const peoplePanelRef = React.useRef<HTMLDivElement>(null);
  const roomsPanelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    leftPanelAnimateControls.start(leftPanelOpen ? "open" : "closed");
    rightPanelAnimateControls.start(rightPanelOpen ? "open" : "closed");
  }, [
    leftPanelAnimateControls,
    leftPanelOpen,
    rightPanelAnimateControls,
    rightPanelOpen,
  ]);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <div
        ref={leftPanelConstraints}
        className="left-panel-drag-constraints"
        style={{
          width: 2 * PANEL_LEFT_MAX_WIDTH,
          position: "fixed",
          left: -PANEL_LEFT_MAX_WIDTH,
        }}
      />
      <motion.div
        ref={roomsPanelRef}
        initial={false}
        animate={leftPanelAnimateControls}
        variants={leftPanelVariants}
        drag="x"
        dragElastic={false}
        dragMomentum={false}
        dragConstraints={leftPanelConstraints}
        dragTransition={{
          bounceStiffness: 800,
          bounceDamping: 100,
        }}
        onDragEnd={(e, { offset, velocity, point }) => {
          const swipe = swipePower(offset.x, velocity.x);

          // Set panel open when drag offset is greater than 50% of max width
          // Set panel closed when drag offset is less than 50% of max width
          if (!leftPanelOpen) {
            point.x > PANEL_LEFT_MAX_WIDTH / 2 ||
            swipe >= swipeConfidenceThreshold
              ? toggleLeftPanel(true)
              : leftPanelAnimateControls.start({
                  x: -PANEL_LEFT_MAX_WIDTH,
                  transition: {
                    duration: 0.3,
                    type: "tween",
                  },
                });
          } else if (leftPanelOpen) {
            point.x < PANEL_LEFT_MAX_WIDTH / 2 ||
            swipe <= -swipeConfidenceThreshold
              ? toggleLeftPanel(false)
              : leftPanelAnimateControls.start({
                  x: 0,
                  transition: {
                    duration: 0.3,
                    type: "tween",
                  },
                });
          }
        }}
        className="chat-rooms__panel"
        style={{
          background: "azure",
          position: "absolute",
          left: 0,
          bottom: 0,
          top: 0,
          zIndex: 2,
          width: `${PANEL_LEFT_MAX_WIDTH}px`,
          x: 0,
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

      <div
        ref={rightPanelConstraints}
        className="right-panel-drag-constraints"
        style={{
          width: 2 * PANEL_RIGHT_MAX_WIDTH,
          position: "fixed",
          right: -PANEL_RIGHT_MAX_WIDTH,
        }}
      />
      <motion.div
        ref={peoplePanelRef}
        initial={false}
        animate={rightPanelAnimateControls}
        variants={rightPanelVariants}
        drag="x"
        dragElastic={false}
        dragMomentum={false}
        dragConstraints={rightPanelConstraints}
        dragTransition={{
          bounceStiffness: 800,
          bounceDamping: 100,
        }}
        onDragEnd={(e, { offset, velocity, point }) => {
          const swipe = swipePower(offset.x, velocity.x);

          if (!rightPanelOpen) {
            window.innerWidth - point.x >= PANEL_RIGHT_MAX_WIDTH / 2 ||
            swipe <= -swipeConfidenceThreshold
              ? toggleRightPanel(true)
              : rightPanelAnimateControls.start({
                  x: 0,
                  transition: {
                    duration: 0.3,
                    type: "tween",
                  },
                });
          } else if (rightPanelOpen) {
            point.x - (window.innerWidth - PANEL_RIGHT_MAX_WIDTH) >=
              PANEL_RIGHT_MAX_WIDTH / 2 || swipe >= swipeConfidenceThreshold
              ? toggleRightPanel(false)
              : rightPanelAnimateControls.start({
                  x: PANEL_RIGHT_MAX_WIDTH,
                  transition: {
                    duration: 0.3,
                    type: "tween",
                  },
                });
          }
        }}
        className="chat-people__panel"
        style={{
          background: "cadetblue",
          position: "absolute",
          right: 0,
          bottom: 0,
          top: 0,
          zIndex: 2,
          width: PANEL_RIGHT_MAX_WIDTH,
          x: window.innerWidth + PANEL_RIGHT_MAX_WIDTH,
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
