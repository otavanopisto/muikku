import * as React from "react";
import { ChatMessage } from "~/generated/client";
import { localize } from "~/locales/i18n";
import Avatar from "../general/avatar";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
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

/**
 * Modal component for mobile message actions
 * Animated from bottom of screen.
 * @param props props
 */
function MobileMessageActions(props: MobileMessageActionsProps) {
  const { open, onClose } = props;

  // Using y motion value to animate the black drop opacity
  // change when dragging the drawer
  const y = useMotionValue(0);
  const background = useTransform(
    y,
    [-100, 100],
    ["rgb(0, 0, 0, 1)", "rgb(0, 0, 0, 0)"]
  );

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

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      {open && (
        <>
          <motion.div
            className="black-drop-wrapper"
            onClick={handleBlackDropClick}
            animate={{
              background: `rgba(0,0,0,${0.5})`,
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
            drag="y"
            dragElastic={{
              bottom: 0.1,
              top: 0,
            }}
            dragMomentum={false}
            dragConstraints={{
              top: 0,
              bottom: 0,
            }}
            initial={{
              bottom: "-100%",
              opacity: 0,
            }}
            animate={{
              bottom: 0,
              opacity: 1,
            }}
            exit={{
              bottom: "-100%",
              opacity: 0,
            }}
            transition={{
              type: "tween",
              duration: 0.2,
            }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
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
