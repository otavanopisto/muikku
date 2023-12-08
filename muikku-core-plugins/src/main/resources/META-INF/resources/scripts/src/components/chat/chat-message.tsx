import * as React from "react";
import { ChatMessage } from "~/generated/client";
import { localize } from "~/locales/i18n";
import Avatar from "../general/avatar";
import {
  AnimatePresence,
  motion,
  PanInfo,
  useAnimationControls,
  useMotionValue,
  useTransform,
  Variants,
} from "framer-motion";
import { useChatContext } from "./context/chat-context";
import useLongPress from "./hooks/useLongPress";

/**
 * ChatMessageProps
 */
interface ChatMessageProps {
  senderIsMe: boolean;
  msg: ChatMessage;
}

// const chatApi = MApi.getChatApi();

/**
 * ChatMessage
 * @param props props
 * @returns JSX.Element
 */
const ChatMessage = (props: ChatMessageProps) => {
  const { isMobileWidth } = useChatContext();

  const { senderIsMe, msg } = props;
  const { archived, editedDateTime } = msg;

  const [mobileActionDrawerOpen, setMobileActionDrawerOpen] =
    React.useState(false);

  const [hoveringContent, setHoveringContent] = React.useState(false);
  const [hoveringActivator, setHoveringActivator] = React.useState(false);

  // Delay handler refs
  const activatorDelayHandler = React.useRef(null);
  const contentDelayHandler = React.useRef(null);

  const longPressEvent = useLongPress({
    // eslint-disable-next-line jsdoc/require-jsdoc
    onLongPress: (e) => {
      setMobileActionDrawerOpen(true);
    },
    obj: {
      shouldPreventDefault: true,
      delay: 1000,
    },
  });

  const on = true;

  const senderClass = senderIsMe ? "sender-me" : "sender-them";
  const messageLoadingClassName = !on
    ? "chat__message--loading"
    : "chat__message--loaded";

  const messageDeletedClass = archived ? "chat__message--deleted" : "";

  const showActions = (hoveringContent || hoveringActivator) && !isMobileWidth;

  const showMobileActions = mobileActionDrawerOpen && isMobileWidth;

  return (
    <>
      <div
        className="chat__message-wrapper"
        style={{
          position: "relative",
        }}
      >
        <motion.div
          ref={activatorDelayHandler}
          {...longPressEvent}
          initial={{ background: "#fff" }}
          whileFocus={{ background: "#e3e3e3" }}
          whileHover={{
            background: "#e3e3e3",
            transition: { duration: 0.2 },
          }}
          onHoverStart={() => {
            setHoveringActivator(true);
          }}
          onHoverEnd={() => {
            if (activatorDelayHandler.current) {
              clearTimeout(activatorDelayHandler.current);
            }

            if (hoveringActivator) {
              activatorDelayHandler.current = setTimeout(() => {
                setHoveringActivator(false);
              }, 200);
            }
          }}
          className={`chat__message chat__message--${senderClass} ${messageDeletedClass} ${messageLoadingClassName}`}
        >
          <div className="chat__message-content-container" key="nonEditable">
            <Avatar
              firstName={msg.nick}
              hasImage={msg.hasImage}
              id={msg.sourceUserEntityId}
            />
            <div className="chat__message-content-wrapper">
              <div className="chat__message-meta">
                <span className={`chat__message-meta-sender`}>{msg.nick}</span>
                <span className="chat__message-meta-timestamp">
                  {localize.formatDaily(msg.sentDateTime)}
                </span>
              </div>
              <div className="chat__message-content">
                {archived ? <i>Poistettu</i> : msg.message}
                {editedDateTime && (
                  <div className="chat__message-edited-info">
                    (Muokattu {localize.formatDaily(editedDateTime)})
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <AnimatePresence initial={false} exitBeforeEnter>
          {showActions && (
            <motion.div
              initial={{
                right: "-50px",
                opacity: 0,
              }}
              animate={{
                right: 10,
                opacity: 1,
              }}
              exit={{
                right: "-50px",
                opacity: 0,
              }}
              transition={{
                type: "tween",
                duration: 0.2,
              }}
              onHoverStart={() => {
                if (contentDelayHandler.current) {
                  clearTimeout(contentDelayHandler.current);
                }
                if (!hoveringContent) setHoveringContent(true);
              }}
              onHoverEnd={() => {
                if (contentDelayHandler.current) {
                  clearTimeout(contentDelayHandler.current);
                }

                if (hoveringContent) {
                  contentDelayHandler.current = setTimeout(() => {
                    setHoveringContent(false);
                  }, 200);
                }
              }}
              className="chat__message-actions-wrapper"
              style={{
                position: "absolute",
                top: 0,
                right: "10px",
                display: "flex",
                justifyContent: "center",
                background: "gray",
                padding: "5px",
                borderRadius: "25px",
              }}
            >
              <div
                className={`chat__message-actions ${
                  senderIsMe
                    ? "chat__message-actions--sender-me"
                    : "chat__message-actions--sender-them"
                }`}
              >
                <div className="chat__message-action icon-pencil" />
                <div className="chat__message-action icon-trash" />
                <div className="chat__message-action icon-more_vert" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <MobileMessageActions
        open={showMobileActions}
        onClose={() => setMobileActionDrawerOpen(false)}
      />
    </>
  );
};

/**
 * MobileMessageActionsProps
 */
interface MobileMessageActionsProps {
  open: boolean;
  onClose?: () => void;
}

const variants: Variants = {
  open: {
    bottom: 0,
    opacity: 1,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
  closed: {
    bottom: "-100%",
    opacity: 0,
    transition: {
      type: "tween",
      duration: 0.3,
    },
  },
};

/**
 * Modal component for mobile message actions
 * Animated from bottom of screen.
 * @param props props
 */
function MobileMessageActions(props: MobileMessageActionsProps) {
  const { open, onClose } = props;

  const actionsPanelRef = React.useRef<HTMLDivElement>(null);

  const drawerAnimateControls = useAnimationControls();

  const [, setIsDragging] = React.useState(false);
  const [, setIsAnimating] = React.useState(false);

  // Using y motion value to animate the black drop opacity
  // change when dragging the drawer
  const y = useMotionValue(0);

  React.useEffect(() => {
    /**
     * Animate the drawer when it's opened or closed
     */
    const animate = async () => {
      setIsAnimating(true);

      if (open) {
        await drawerAnimateControls.start("open");
      } else {
        await drawerAnimateControls.start("closed");
        y.set(0, false);
      }

      setIsAnimating(false);
    };

    animate();
  }, [open, drawerAnimateControls, y]);

  /**
   * Handle black drop click
   * @param e event
   */
  const handleBlackDropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();
    onClose && onClose();
  };

  /**
   * Handles drag start
   * @param event event
   * @param info info
   */
  const handleDragStart = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    setIsDragging(true);
  };

  /**
   * Handles drag end
   * @param event event
   * @param info info
   */
  const handleDragEnd = (
    event: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    const { /* offset, velocity, */ point } = info;

    /* const swipe = swipePower(offset.x, velocity.x); */

    setIsDragging(false);

    // If the drawer is dragged more than 50% of its height
    // close the drawer or else animate it back to its original position
    if (
      point.y >=
      actionsPanelRef.current.offsetHeight / 2 /* ||
      Math.abs(swipe) > swipeConfidenceThreshold */
    ) {
      onClose && onClose();
    } else {
      animateOpen();
    }
  };

  /**
   * animateOpen
   */
  const animateOpen = async () => {
    setIsAnimating(true);

    await drawerAnimateControls.start({
      y: 0,
      opacity: 1,
      transition: {
        type: "tween",
        duration: 0.2,
      },
    });

    setIsAnimating(false);
  };

  // Default input range for y motion value transformers
  let inpurtRange = [0, 100];

  // If the actions panel ref exists, set the input range second value
  // to the actions panel height
  if (actionsPanelRef.current) {
    inpurtRange = [0, actionsPanelRef.current.offsetHeight];
  }

  // Using y motion value to animate the black drop background
  const background = useTransform(y, inpurtRange, [
    "rgb(0, 0, 0, 0.5)",
    "rgb(0, 0, 0, 0)",
  ]);

  // Using y motion value to animate the drawer opacity
  const opacity = useTransform(y, inpurtRange, [1, 0]);

  return (
    <AnimatePresence exitBeforeEnter>
      {open && (
        <>
          <motion.div
            key="drawer-blackDrop"
            className="black-drop-wrapper"
            onClick={handleBlackDropClick}
            initial={{
              background: `rgba(0,0,0,0)`,
            }}
            animate={{
              background: `rgba(0,0,0,0.5)`,
            }}
            exit={{
              background: `rgba(0,0,0,0)`,
            }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background,
              zIndex: 1,
            }}
          />

          <motion.div
            key="drawer-actionsPanel"
            ref={actionsPanelRef}
            drag="y"
            dragElastic={false}
            dragMomentum={false}
            dragConstraints={{
              top: 0,
            }}
            variants={variants}
            initial="closed"
            animate={drawerAnimateControls}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              opacity,
              background: "antiquewhite",
              padding: "0 10px",
              width: "100%",
              zIndex: 1,
              y,
            }}
          >
            <ul
              className="chat__message-actions-mobile"
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                listStyle: "none",
                padding: 0,
                margin: 0,
              }}
            >
              <motion.li
                className="chat__message-action-mobile icon-pencil"
                style={{
                  padding: "10px 0",
                  fontSize: "1.2rem",
                }}
              >
                Muokkaa
              </motion.li>
              <motion.li
                className="chat__message-action-mobile icon-trash"
                style={{
                  padding: "10px 0",
                  fontSize: "1.2rem",
                }}
              >
                Posta
              </motion.li>
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ChatMessage;
