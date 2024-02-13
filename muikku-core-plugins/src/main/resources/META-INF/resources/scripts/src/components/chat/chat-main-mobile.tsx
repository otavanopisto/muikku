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
import { swipeConfidenceThreshold, swipePower } from "./chat-helpers";
import {
  ChatMyActiveDiscussions,
  ChatMyCounselorsDiscussions,
} from "./chat-my-discussions";
import { PrivateRoomList, PublicRoomsList } from "./chat-rooms";
import { ChatMyProfileWithSettings } from "./chat-profile";
import Button, { IconButton } from "../general/button";
import { OverviewButton } from "./chat-main";

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
  const [panelLeftOpen, setPanelLeftOpen] = React.useState(false);
  const [panelRightOpen, setPanelRightOpen] = React.useState(false);

  const panelLeftArrow = panelLeftOpen ? "arrow-left" : "arrow-right";
  const panelRightArrow = panelRightOpen ? "arrow-right" : "arrow-left";

  return (
    <div className="chat-mobile">
      <ChatPanel
        open={panelLeftOpen}
        panelMaxWidth={PANEL_LEFT_MAX_WIDTH}
        panelPosition="left"
        onOpen={() => setPanelLeftOpen(true)}
        onClose={() => setPanelLeftOpen(false)}
      >
        <div
          onClick={() => setPanelLeftOpen(!panelLeftOpen)}
          className="chat__button-wrapper chat__button-wrapper--rooms"
        >
          <IconButton buttonModifiers={["chat"]} icon={panelLeftArrow} />
        </div>
        <div className="chat__rooms-container">
          <OverviewButton onClick={() => setPanelLeftOpen(false)} />
          <div className="chat__rooms chat__rooms--public" role="menu">
            <div className="chat__rooms-category-title">Julkiset huoneet</div>
            <PublicRoomsList onItemClick={() => setPanelLeftOpen(false)} />
          </div>

          <div className="chat__rooms chat__rooms--private" role="menu">
            <div className="chat__rooms-category-title">Kurssien huoneet</div>
            <PrivateRoomList onItemClick={() => setPanelLeftOpen(false)} />
          </div>
        </div>
      </ChatPanel>

      <div className="chat-mobile__main-container">
      <motion.div>
        <ChatViews
          wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
        />
      </motion.div>
      </div>

      <ChatPanel
        open={panelRightOpen}
        onOpen={() => setPanelRightOpen(true)}
        onClose={() => setPanelRightOpen(false)}
        panelMaxWidth={PANEL_RIGHT_MAX_WIDTH}
        panelPosition="right"
      >
        <div
          onClick={() => setPanelRightOpen(!panelRightOpen)}
          className="chat__button-wrapper chat__button-wrapper--users"
        >
          <IconButton buttonModifiers={["chat"]} icon={panelRightArrow} />
        </div>
        <div className="chat__users-container">
          <div
            className="chat__users chat__users--guidance-councelors"
            role="menu"
          >
            <ChatMyCounselorsDiscussions
              onItemClick={() => setPanelRightOpen(false)}
            />
          </div>
          <div className="chat__users chat__users--others" role="menu">
            <div className="chat__users-category-title">Keskustelut</div>
            <ChatMyActiveDiscussions
              onItemClick={() => setPanelRightOpen(false)}
            />
          </div>
        </div>
        <ChatMyProfileWithSettings />
      </ChatPanel>
      <div className="chat-mobile__footer">
      <IconButton buttonModifiers={["chat"]} icon={panelLeftArrow} />
      <Button buttonModifiers={["chat"]}>Dashboard</Button>
      <IconButton buttonModifiers={["chat"]} icon={panelRightArrow} />
      </div>
    </div>
  );
}

/**
 * ChatPanelProps
 */
interface ChatPanelProps {
  open: boolean;
  panelMaxWidth?: number;
  panelPosition?: "left" | "right";
  children: React.ReactNode;
  onOpen: () => void;
  onClose: () => void;
}

/**
 * ChatPanel
 * @param props props
 * @returns JSX.Element
 */
function ChatPanel(props: ChatPanelProps) {
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

  // Range1 is the transform range for the panel
  // And uses x value to animate the panel
  const useTransformRange1 =
    panelPosition === "left" ? [-panelMaxWidth, 0] : [0, panelMaxWidth];

  // Range2 is the opacity range for the black drop
  // depending on the panel position and value that is used with conjuction with useTransformRange1
  const useTransformRange2 =
    panelPosition === "left"
      ? ["rgb(0, 0, 0, 0)", "rgb(0, 0, 0, 0.5)"]
      : ["rgb(0, 0, 0, 0.5)", "rgb(0, 0, 0, 0)"];

  // Actual background value that is used to animate the black drop with previous ranges
  // For example: When left panel x value is 0 then background opacity is 0.5 and vice versa
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
      style={{
        width: 2 * panelMaxWidth,
        position: "fixed",
        right: -panelMaxWidth,
      }}
    />
  );

  const leftHandle = (
    <div
      className="chat-rooms__panel-drag-handle"
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
      className="chat-rooms__panel-drag-handle"
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

  const blackDropStyles: MotionStyle = {
    background,
    zIndex: open && 6,
  };

  let panelStyles: MotionStyle = {
    width: `${panelMaxWidth}px`,
    x,
    right: 0,
    zIndex: open && 6,
  };

  if (panelPosition === "left") {
    panelStyles = {
      ...panelStyles,
      left: 0,
    };
  }

  return (
    <>
      {constrainElement}

      <AnimatePresence initial={false} exitBeforeEnter>
        {(open || isDragging || isAnimating) && (
          <motion.div
            className="chat-mobile__back-drop"
            onClick={handleBlackDropClick}
            style={blackDropStyles}
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
        className="chat-mobile__panel"
        style={panelStyles}
      >
        {panelHandle}

        <>{children}</>
      </motion.div>
    </>
  );
}

export default ChatMainMobile;
