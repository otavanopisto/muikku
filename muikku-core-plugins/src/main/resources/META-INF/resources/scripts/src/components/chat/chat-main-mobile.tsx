/* eslint-disable camelcase */
import {
  AnimatePresence,
  motion,
  MotionStyle,
  PanInfo,
  useAnimationControls,
  useMotionValue,
  useTransform,
  Variants,
} from "framer-motion";
import * as React from "react";
import ChatViews from "./animated-views";
import { useChatContext } from "./context/chat-context";
import { AddIcon, swipeConfidenceThreshold, swipePower } from "./chat-helpers";
import { ChatMyDiscussions } from "./chat-my-discussions";
import { ChatRoomsLists } from "./chat-rooms";
import ChatProfile from "./chat-profile";

const PANEL_LEFT_MAX_WIDTH = 250;
const PANEL_RIGHT_MAX_WIDTH = 200;

/**
 * ChatMainMobileProps
 */
interface ChatMainMobileProps {}

/**
 * ChatMain
 * @param props props
 */
function ChatMainMobile(props: ChatMainMobileProps) {
  const { toggleLeftPanel, toggleRightPanel, panelLeftOpen, panelRightOpen } =
    useChatContext();

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        position: "fixed",
        zIndex: 1000,
      }}
    >
      <ChatPanel
        open={panelLeftOpen}
        panelMaxWidth={PANEL_LEFT_MAX_WIDTH}
        panelPosition="left"
        onOpen={() => toggleLeftPanel(true)}
        onClose={() => toggleLeftPanel(false)}
      >
        <div
          onClick={() => toggleLeftPanel()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            height: "43px",
            padding: "10px",
          }}
        >
          <AddIcon />
        </div>

        <ChatRoomsLists minimized={false} />
      </ChatPanel>

      <motion.div>
        <ChatViews
          wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
        />
      </motion.div>

      <ChatPanel
        open={panelRightOpen}
        onOpen={() => toggleRightPanel(true)}
        onClose={() => toggleRightPanel(false)}
        panelMaxWidth={PANEL_RIGHT_MAX_WIDTH}
        panelPosition="right"
      >
        <div
          onClick={() => toggleRightPanel()}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            height: "43px",
            padding: "10px",
          }}
        >
          <AddIcon />
        </div>
        <ChatMyDiscussions />
        <ChatProfile
          style={{
            width: "100%",
            position: "absolute",
            bottom: 0,
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        />
      </ChatPanel>
    </div>
  );
}

/**
 * ChatLeftPanelProps
 */
interface ChatLeftPanelProps {
  open: boolean;
  panelMaxWidth?: number;
  panelPosition?: "left" | "right";
  children: React.ReactNode;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * ChatLeftPanel
 * @param props props
 * @returns JSX.Element
 */
function ChatPanel(props: ChatLeftPanelProps) {
  const { open, onOpen, children, onClose, panelMaxWidth, panelPosition } =
    props;

  const panelConstraints = React.useRef<HTMLDivElement>(null);

  const panelAnimateControls = useAnimationControls();

  const [initalized, setInitialized] = React.useState(false);

  const [isDragging, setIsDragging] = React.useState(false);
  const [isAnimating, setIsAnimating] = React.useState(false);

  // Using x motion value to animate the black drop opacity
  // change when dragging the drawer
  const x = useMotionValue(
    panelPosition === "left" ? 0 : window.innerWidth + panelMaxWidth
  );

  const useTransformRange1 =
    panelPosition === "left"
      ? [-panelMaxWidth, panelMaxWidth]
      : [0, panelMaxWidth];

  const useTransformRange2 =
    panelPosition === "left"
      ? ["rgb(0, 0, 0, 0)", "rgb(0, 0, 0, 0.5)"]
      : ["rgb(0, 0, 0, 0.5)", "rgb(0, 0, 0, 0)"];

  const background = useTransform(x, useTransformRange1, useTransformRange2);

  React.useEffect(() => {
    if (!initalized) {
      setInitialized(true);
      return;
    }

    /**
     * Animates panel depending of open prop
     */
    const animatePanel = async () => {
      setIsAnimating(true);

      if (open) {
        await panelAnimateControls.start("open");
      } else {
        await panelAnimateControls.start("closed");
      }

      setIsAnimating(false);
    };

    animatePanel();
  }, [panelAnimateControls, open, panelPosition, initalized]);

  /**
   * Animates panel open while tracking animation state
   */
  const animateOpen = async () => {
    setIsAnimating(true);

    await panelAnimateControls.start("open");

    setIsAnimating(false);
  };

  /**
   * Animates panel close while tracking animation state
   */
  const animateClose = async () => {
    setIsAnimating(true);

    await panelAnimateControls.start("closed");

    setIsAnimating(false);
  };

  /**
   * Handle black drop click
   * @param e event
   */
  const handleBlackDropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onClose();
  };

  /**
   * Handles drag start
   */
  const handleDragStart = () => {
    setIsDragging(true);
  };

  /**
   * handleDragENd
   * @param event event
   * @param info info
   */
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { offset, velocity, point } = info;

    const swipe = swipePower(offset.x, velocity.x);

    setIsDragging(false);

    switch (panelPosition) {
      case "left":
        // Set panel open when drag offset is greater than 50% of max width
        // Set panel closed when drag offset is less than 50% of max width
        if (!open) {
          if (
            point.x > panelMaxWidth / 2 ||
            swipe >= swipeConfidenceThreshold
          ) {
            onOpen();
          } else {
            animateClose();
          }
        } else if (open) {
          point.x < panelMaxWidth / 2 || swipe <= -swipeConfidenceThreshold
            ? onClose()
            : animateOpen();
        }

        break;
      case "right":
        if (!open) {
          window.innerWidth - point.x >= panelMaxWidth / 2 ||
          swipe <= -swipeConfidenceThreshold
            ? onOpen()
            : animateClose();
        } else if (open) {
          point.x - (window.innerWidth - panelMaxWidth) >= panelMaxWidth / 2 ||
          swipe >= swipeConfidenceThreshold
            ? onClose()
            : animateOpen();
        }
        break;

      default:
        return;
    }
  };

  const leftPanelVariants: Variants = {
    open: {
      x: 0,
      transition: {
        duration: 0.3,
        type: "tween",
      },
    },
    closed: {
      x: -panelMaxWidth,
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
      x: panelMaxWidth,
      transition: {
        duration: 0.3,
        type: "tween",
      },
    },
  };

  const panelVariants =
    panelPosition === "left" ? leftPanelVariants : rightPanelVariants;

  const leftVariantConstraints = (
    <div
      ref={panelConstraints}
      className="panel-drag-constraints"
      style={{
        width: 2 * panelMaxWidth,
        position: "fixed",
        left: -panelMaxWidth,
      }}
    />
  );

  const rightVariantConstraints = (
    <div
      ref={panelConstraints}
      className="right-panel-drag-constraints"
      style={{
        width: 2 * panelMaxWidth,
        position: "fixed",
        right: -panelMaxWidth,
      }}
    />
  );

  const leftHandle = (
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
  );

  const rightHandle = (
    <div
      className="chat-prooms__panel-drag-handle"
      style={{
        position: "absolute",
        width: "15px",
        left: "-15px",
        top: "0",
        bottom: "0",
      }}
    />
  );

  const panelHandle = panelPosition === "left" ? leftHandle : rightHandle;

  const constrainElement =
    panelPosition === "left" ? leftVariantConstraints : rightVariantConstraints;

  const panelStyles: MotionStyle =
    panelPosition === "left"
      ? {
          position: "absolute",
          bottom: 0,
          top: 0,
          zIndex: 3,
          width: `${panelMaxWidth}px`,
          x,
          left: 0,
        }
      : {
          position: "absolute",
          bottom: 0,
          top: 0,
          zIndex: 3,
          width: `${panelMaxWidth}px`,
          x,
          right: 0,
        };

  return (
    <>
      {constrainElement}

      <AnimatePresence initial={false} exitBeforeEnter>
        {(open || isDragging || isAnimating) && (
          <motion.div
            className="black-drop-wrapper"
            onClick={handleBlackDropClick}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background,
              zIndex: 2,
            }}
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={"closed"}
        animate={panelAnimateControls}
        variants={panelVariants}
        drag="x"
        dragElastic={false}
        dragMomentum={false}
        dragConstraints={panelConstraints}
        dragTransition={{
          bounceStiffness: 800,
          bounceDamping: 100,
        }}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className="chat-panel"
        style={panelStyles}
      >
        {panelHandle}

        <div className="chat-panel-wrapper">{children}</div>
      </motion.div>
    </>
  );
}

export default ChatMainMobile;
