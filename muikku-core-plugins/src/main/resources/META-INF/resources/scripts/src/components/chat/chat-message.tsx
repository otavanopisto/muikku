import * as React from "react";
import { ChatMessage } from "~/generated/client";
import { localize } from "~/locales/i18n";
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
import useMessage, { MessageAction } from "./hooks/useMessage";
import ChatProfileAvatar from "./chat-profile-avatar";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import ChatMessageDeleteDialog from "./dialogs/chat-message-delete-dialog";

/**
 * ChatMessageProps
 */
interface ChatMessageProps {
  msg: ChatMessage;
}

/**
 * ChatMessage
 * @param props props
 * @returns JSX.Element
 */
const ChatMessage = (props: ChatMessageProps) => {
  const { isMobileWidth } = useChatContext();

  const {
    editedMessage,
    showDeleteDialog,
    closeDeleteDialog,
    myMsg,
    editMode,
    mainModerationActions,
    secondaryModerationActions,
    mobileModerationActions,
    toggleEditMode,
    deleteMessage,
    saveEditedMessage,
    handleEditedMessageChange,
  } = useMessage(props.msg);

  const { msg } = props;
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
      delay: 500,
    },
  });

  const on = true;

  const senderClass = myMsg ? "sender-me" : "sender-them";
  const messageLoadingClassName = !on
    ? "chat__message--loading"
    : "chat__message--loaded";

  const messageDeletedClass = archived ? "chat__message--deleted" : "";

  const showActions = (hoveringContent || hoveringActivator) && !isMobileWidth;

  const showMobileActions = mobileActionDrawerOpen && isMobileWidth;

  React.useEffect(() => {
    if (!editMode) return;

    unstable_batchedUpdates(() => {
      setHoveringContent(false);
      setHoveringActivator(false);
    });
  }, [editMode]);

  /**
   * Handles cancel edit
   */
  const handleCancelEdit = () => {
    toggleEditMode(false);
  };

  /**
   * Handles save
   */
  const handleSave = () => {
    saveEditedMessage();
  };

  /**
   * handleTextareaChange
   * @param e e
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    handleEditedMessageChange(e.target.value);
  };

  /**
   * Handles enter key down.
   * @param e e
   */
  const handleEnterKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Escape") {
      toggleEditMode(false);
      handleEditedMessageChange(msg.message);
    }

    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  const chatMessageContent = editMode ? (
    <React.Fragment key="editable">
      <ChatProfileAvatar
        id={msg.sourceUserEntityId}
        nick={msg.nick}
        hasImage={msg.hasImage}
      />
      <div className="chat__message-content-container">
        <div className="chat__message-meta">
          <span className={`chat__message-meta-sender`}>{msg.nick}</span>
          <span className="chat__message-meta-timestamp">
            {localize.formatDaily(msg.sentDateTime)}
          </span>
        </div>

        <div className="chat__message-editor">
          <textarea
            value={editedMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleEnterKeyDown}
          />
        </div>

        <div className="chat__message-footer">
          <span
            className="chat__message-footer-action"
            onClick={handleCancelEdit}
          >
            Peruuta
          </span>
          <span>Tai</span>
          <span className="chat__message-footer-action" onClick={handleSave}>
            Tallenna
          </span>
        </div>
      </div>
    </React.Fragment>
  ) : (
    <React.Fragment key="nonEditable">
      <ChatProfileAvatar
        id={msg.sourceUserEntityId}
        nick={msg.nick}
        hasImage={msg.hasImage}
      />
      <div className="chat__message-content-container">
        <div className="chat__message-meta">
          <span className={`chat__message-meta-sender`}>{msg.nick}</span>
          <span className="chat__message-meta-timestamp">
            {localize.formatDaily(msg.sentDateTime)}
          </span>
        </div>
        <div className="chat__message-body">
          {archived ? <i>Poistettu</i> : msg.message}
          {editedDateTime && (
            <div className="chat__message-edited-info">
              (Muokattu {localize.formatDaily(editedDateTime)})
            </div>
          )}
        </div>
      </div>
    </React.Fragment>
  );

  return (
    <>
      <div
        ref={activatorDelayHandler}
        {...longPressEvent}
        className={`chat__message chat__message--${senderClass} ${messageDeletedClass} ${messageLoadingClassName}`}
        onMouseEnter={() => {
          setHoveringActivator(true);
        }}
        onMouseLeave={() => {
          if (activatorDelayHandler.current) {
            clearTimeout(activatorDelayHandler.current);
          }

          if (hoveringActivator) {
            activatorDelayHandler.current = setTimeout(() => {
              setHoveringActivator(false);
            }, 200);
          }
        }}
      >
        {chatMessageContent}
      </div>

      <DesktopMessageActions
        mainActions={mainModerationActions}
        secondaryActions={secondaryModerationActions}
        open={showActions && mainModerationActions.length > 0}
        onHoverActionsStart={() => {
          if (contentDelayHandler.current) {
            clearTimeout(contentDelayHandler.current);
          }
          if (!hoveringContent && !editMode) setHoveringContent(true);
        }}
        onHoverActionsEnd={() => {
          if (contentDelayHandler.current) {
            clearTimeout(contentDelayHandler.current);
          }

          if (hoveringContent) {
            contentDelayHandler.current = setTimeout(() => {
              setHoveringContent(false);
            }, 200);
          }
        }}
      />

      <ChatMessageDeleteDialog
        open={showDeleteDialog}
        message={msg}
        onDelete={deleteMessage}
        onClose={closeDeleteDialog}
      />

      <MobileMessageActions
        actions={mobileModerationActions}
        open={showMobileActions && mobileModerationActions.length > 0}
        onClose={() => setMobileActionDrawerOpen(false)}
      />
    </>
  );
};

/**
 * DesktopMessageActionsProps
 */
interface DesktopMessageActionsProps {
  mainActions: MessageAction[];
  secondaryActions: MessageAction[];
  open: boolean;
  onHoverActionsStart?: () => void;
  onHoverActionsEnd?: () => void;
}

/**
 * DesktopMessageActions
 * @param props props
 * @returns JSX.Element
 */
function DesktopMessageActions(props: DesktopMessageActionsProps) {
  const { mainActions, open, onHoverActionsStart, onHoverActionsEnd } = props;

  return (
    <AnimatePresence initial={false} exitBeforeEnter>
      {open && mainActions.length > 0 && (
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
          onHoverStart={onHoverActionsStart}
          onHoverEnd={onHoverActionsEnd}
          className="chat__message-actions-wrapper"
          style={{
            position: "absolute",
            top: 0,
            right: "10px",
            display: "flex",
            justifyContent: "center",
            padding: "5px",
            borderRadius: "25px",
          }}
        >
          <div className="chat__message-actions">
            {mainActions.map((action, index) => (
              <div
                key={index}
                className={`chat__message-action icon-${action.icon}`}
                onClick={action.onClick}
              />
            ))}

            {/* {secondaryActions.length > 0 && (
              <Dropdown
                modifier="chat"
                items={secondaryActions.map((action, index) => (
                  <Link
                    key={index}
                    className={`link link--full link--chat-dropdown`}
                  >
                    <span className={`link__icon icon-${action.icon}`}></span>
                    <span>{action.text}</span>
                  </Link>
                ))}
              >
                <div className="chat__message-action icon-more_vert" />
              </Dropdown>
            )} */}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * MobileMessageActionsProps
 */
interface MobileMessageActionsProps {
  actions: MessageAction[];
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
  const { open, actions, onClose } = props;

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
    const { point } = info;

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
              padding: "10px",
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
              {actions.length > 0 &&
                actions.map((action, index) => (
                  <motion.li
                    key={index}
                    className={`chat__message-action-mobile icon-${action.icon}`}
                    style={{
                      padding: "10px 0",
                      fontSize: "1.2rem",
                    }}
                    onClick={(e) => {
                      action.onClick(e);
                      onClose && onClose();
                    }}
                  >
                    {action.text}
                  </motion.li>
                ))}
            </ul>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ChatMessage;
