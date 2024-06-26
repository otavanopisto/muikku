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
import ChatMessageDeleteDialog from "./dialogs/chat-message-delete-dialog";
import Button, { IconButton } from "../general/button";
import TextareaAutosize from "react-textarea-autosize";
import { generateHash, parseLines } from "./chat-helpers";
import ChatUserInfoPopover from "./chat-user-info-popover";
import {
  fetchUserInfo,
  useChatUserInfoContext,
} from "./context/chat-user-info-context";
import { useTranslation } from "react-i18next";
import Dropdown from "~/components/general/dropdown";

/**
 * ChatMessageProps
 */
interface ChatMessageProps {
  msg: ChatMessage;
  disableLongPress: boolean;
  editModeActive: boolean;
  onEditClick: (msg: ChatMessage) => void;
}

/**
 * ChatMessage
 * @param props props
 * @returns JSX.Element
 */
const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  function ChatMessage(props, ref) {
    const { msg, editModeActive, onEditClick, disableLongPress } = props;

    const { isMobileWidth, currentUser } = useChatContext();

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
    } = useMessage({
      msg,
      onEditClick: onEditClick,
    });

    const context = useChatUserInfoContext();

    const { archived, editedDateTime } = msg;

    const [mobileActionDrawerOpen, setMobileActionDrawerOpen] =
      React.useState(false);

    // User specific info is only avalable for staff members and when msg
    // is not sent by the current user
    const userInfoAvailable = currentUser.type === "STAFF" && !myMsg;

    const { t } = useTranslation(["chat", "common"]);

    // If prop editModeActive has changed to false and components internal
    // state editMode is still true, toggle edit mode off
    React.useEffect(() => {
      if (!editModeActive) {
        toggleEditMode(false);
      }
    }, [editModeActive, toggleEditMode]);

    const longPressEvent = useLongPress({
      // eslint-disable-next-line jsdoc/require-jsdoc
      onLongPress: (e) => {
        // Fetch user info if it's not already fetched/fetching
        if (
          userInfoAvailable &&
          !context.state.infosByUserId[msg.sourceUserEntityId]
        ) {
          fetchUserInfo(context.dispatch, msg.sourceUserEntityId);
        }

        // Open mobile action drawer if there are any actions
        if (mobileModerationActions.length > 0) {
          setMobileActionDrawerOpen(true);
        }
      },
      obj: {
        shouldPreventDefault: true,
        delay: 500,
      },
      disabled: disableLongPress,
    });

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
    const handleTextareaChange = (
      e: React.ChangeEvent<HTMLTextAreaElement>
    ) => {
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

    const senderClass = myMsg ? "sender-me" : "sender-them";

    const messageDeletedClass = archived ? "chat__message--deleted" : "";

    const showMobileActions = mobileActionDrawerOpen && isMobileWidth;

    // If message nick exists, use it, else use a generated hash that indicates that the
    // user has closed the chat for good
    const nick =
      msg.nick ||
      `${t("labels.gone", {
        ns: "chat",
      })}#${generateHash(`user-${msg.sourceUserEntityId}`)}`;

    const chatMessageContent = editMode ? (
      <React.Fragment key="editable">
        <ChatProfileAvatar
          id={msg.sourceUserEntityId}
          nick={nick}
          hasImage={msg.hasImage}
          userType={msg.userType}
        />
        <div className="chat__message-content-container">
          <div className="chat__message-meta">
            <span className={`chat__message-meta-sender`}>{nick}</span>
            <span className="chat__message-meta-timestamp">
              {localize.formatDaily(msg.sentDateTime, "LT")}
            </span>
          </div>

          <div className="chat__message-body">
            <TextareaAutosize
              className="chat__edit-message"
              value={editedMessage}
              onChange={handleTextareaChange}
              onKeyDown={handleEnterKeyDown}
            />
          </div>

          <div className="chat__message-footer">
            <Button buttonModifiers={["chat"]} onClick={handleCancelEdit}>
              {t("actions.cancel")}
            </Button>
            <span>{t("content.or")}</span>
            <Button buttonModifiers={["chat"]} onClick={handleSave}>
              {t("actions.save")}
            </Button>
          </div>
        </div>
      </React.Fragment>
    ) : (
      <React.Fragment key="nonEditable">
        <ChatProfileAvatar
          id={msg.sourceUserEntityId}
          nick={nick}
          hasImage={msg.hasImage}
          userType={msg.userType}
        />
        <div className="chat__message-content-container">
          <div className="chat__message-meta">
            {userInfoAvailable ? (
              <ChatUserInfoPopover userId={msg.sourceUserEntityId}>
                <span className={`chat__message-meta-sender`}>{nick}</span>
              </ChatUserInfoPopover>
            ) : (
              <span className={`chat__message-meta-sender`}>{nick}</span>
            )}

            <span className="chat__message-meta-timestamp">
              {localize.formatDaily(msg.sentDateTime, "LT")}
            </span>
          </div>
          <div className="chat__message-body">
            {archived ? (
              <i>
                {t("content.msgDeleted", {
                  date: localize.formatDaily(msg.editedDateTime, "LT"),
                  ns: "chat",
                })}
              </i>
            ) : (
              parseLines(msg.message)
            )}
            {!archived && editedDateTime && (
              <div className="chat__message-edited-info">
                {t("content.msgEdited", {
                  date: localize.formatDaily(editedDateTime, "LT"),
                  ns: "chat",
                })}
              </div>
            )}
          </div>
        </div>
      </React.Fragment>
    );

    return (
      <>
        <div
          {...longPressEvent}
          ref={ref}
          className={`chat__message chat__message--${senderClass} ${messageDeletedClass} ${
            editMode ? "chat__message--editing" : ""
          }`}
        >
          {chatMessageContent}

          <DesktopMessageActions
            mainActions={mainModerationActions}
            secondaryActions={secondaryModerationActions}
          />
        </div>

        <ChatMessageDeleteDialog
          open={showDeleteDialog}
          message={msg}
          onDelete={deleteMessage}
          onClose={closeDeleteDialog}
        />

        <MobileMessageActions
          actions={mobileModerationActions}
          open={showMobileActions}
          onClose={() => setMobileActionDrawerOpen(false)}
        >
          {context.state.infosByUserId[msg.sourceUserEntityId] &&
            context.state.infosByUserId[msg.sourceUserEntityId].info && (
              <>
                {context.state.infosByUserId[msg.sourceUserEntityId].info.name}
              </>
            )}
        </MobileMessageActions>
      </>
    );
  }
);

/**
 * DesktopMessageActionsProps
 */
interface DesktopMessageActionsProps {
  mainActions: MessageAction[];
  secondaryActions: MessageAction[];
}

/**
 * DesktopMessageActions
 * @param props props
 * @returns JSX.Element
 */
function DesktopMessageActions(props: DesktopMessageActionsProps) {
  const { mainActions } = props;

  if (mainActions.length === 0) {
    return null;
  }

  return (
    <div className="chat__message-actions">
      {mainActions.map((action, index) => (
        <div key={index} className="chat__button-wrapper">
          <Dropdown
            alignSelfVertically="top"
            openByHover
            content={<p>{action.text}</p>}
          >
            <IconButton
              icon={action.icon}
              buttonModifiers={["chat"]}
              onClick={action.onClick}
            />
          </Dropdown>
        </div>
      ))}
    </div>
  );
}

/**
 * MobileMessageActionsProps
 */
interface MobileMessageActionsProps {
  children?: React.ReactNode;
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
  const { open, actions, onClose, children } = props;

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
    if (point.y >= actionsPanelRef.current.offsetHeight / 2) {
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
            className="chat-mobile__back-drop"
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
              background,
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
            className="chat-mobile__action-panel"
            style={{
              y,
              opacity,
            }}
          >
            <div className="chat__message-user-info">{children}</div>
            <div className="chat__message-actions chat__message-actions--mobile">
              {actions.length > 0 &&
                actions.map((action, index) => (
                  <div key={index} className="chat__message-action">
                    <Button
                      buttonModifiers={action.modifiers}
                      onClick={(e) => {
                        action.onClick(e);
                        onClose && onClose();
                      }}
                    >
                      {action.text}
                    </Button>
                  </div>
                ))}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ChatMessage;
