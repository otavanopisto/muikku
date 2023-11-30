import * as React from "react";
import useMessages from "../hooks/useMessages";
import ChatMessage from "../chat-message";
import {
  useMotionValue,
  Reorder,
  motion,
  AnimatePresence,
} from "framer-motion";
import { useRaisedShadow } from "../hooks/use-raised-shadows";

/**
 * ChatPanel
 */
export interface ChatPanel {
  index: number;
  identifier: string;
  name: string;
  component: React.ReactNode;
}

/**
 * ChatPanelProps
 */
interface ChatPanelProps {
  title: string;
  /**
   * Current user id.
   */
  userId: number;
  /**
   * Target identifier is used to load messages.
   */
  targetIdentifier: string;
  modifiers?: string[];
}

/**
 * ChatPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatPrivatePanel = (props: ChatPanelProps) => {
  const { chatMsgs, newMessage, setNewMessage, postMessage } = useMessages(
    props.targetIdentifier,
    [props.targetIdentifier, `user-${props.userId}`]
  );

  return (
    <div className="chat__panel-wrapper">
      <div className={`chat__panel chat__panel--private`}>
        <div className="chat__panel-header chat__panel-header--private">
          <div className="chat__panel-header-title">
            <span
              className={"chat__online-indicator chat__online-indicator--"}
            ></span>
            <span className="chat__target-nickname">{props.title}</span>
          </div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          <div className="chat__messages-container chat__messages-container--private">
            {chatMsgs.map((msg) => (
              <ChatMessage
                key={msg.id}
                msg={msg}
                senderIsMe={props.userId === msg.sourceUserEntityId}
              />
            ))}
            <div className="chat__messages-last-message"></div>
          </div>
        </div>
        <div className="chat__panel-footer chat__panel-footer--chatroom">
          <textarea
            className="chat__memofield chat__memofield--muc-message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            className="chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-private"
            type="submit"
            onClick={postMessage}
          >
            <span className="icon-arrow-right"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * ChatPublicPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatRoomPanel = (props: ChatPanelProps) => {
  const [showOccupantsList, setShowOccupantsList] =
    React.useState<boolean>(false);
  const [openChatSettings, setOpenChatSettings] =
    React.useState<boolean>(false);

  const { chatMsgs, newMessage, setNewMessage, postMessage } = useMessages(
    props.targetIdentifier,
    [props.targetIdentifier]
  );

  const toggleOccupantsList = React.useCallback(() => {
    setShowOccupantsList(!showOccupantsList);
  }, [showOccupantsList]);

  const toggleChatRoomSettings = React.useCallback(() => {
    setOpenChatSettings(!openChatSettings);
  }, [openChatSettings]);

  const isWorkspace = true;

  const chatRoomTypeClassName = isWorkspace ? "workspace" : "other";

  return (
    <div className="chat__panel-wrapper">
      <div className={`chat__panel chat__panel--${chatRoomTypeClassName}`}>
        <div
          className={`chat__panel-header chat__panel-header--${chatRoomTypeClassName}`}
        >
          <div className="chat__panel-header-title">{props.title}</div>

          <div
            onClick={toggleOccupantsList}
            className="chat__button chat__button--occupants icon-users"
          ></div>

          <div
            onClick={toggleChatRoomSettings}
            className="chat__button chat__button--room-settings icon-cogs"
          ></div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          <div
            className={`chat__messages-container chat__messages-container--${chatRoomTypeClassName}`}
          >
            {chatMsgs.map((msg) => (
              <ChatMessage
                key={msg.id}
                msg={msg}
                senderIsMe={msg.sourceUserEntityId === props.userId}
              />
            ))}
            <div className="chat__messages-last-message"></div>
          </div>

          <AnimatePresence initial={false}>
            {showOccupantsList && (
              <motion.div
                className="chat__occupants-container"
                initial={{
                  opacity: 0,
                  flexBasis: "0%",
                }}
                animate={{
                  opacity: 1,
                  flexBasis: "35%",
                  transition: {
                    flexBasis: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                      delay: 0.15,
                    },
                  },
                }}
                exit={{
                  opacity: 0,
                  flexBasis: "0%",
                  transition: {
                    flexBasis: {
                      duration: 0.4,
                    },
                    opacity: {
                      duration: 0.25,
                    },
                  },
                }}
              >
                <div className="chat__occupants-staff"></div>
                <div className="chat__occupants-student"></div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        <div className="chat__panel-footer chat__panel-footer--chatroom">
          <input
            name="chatRecipient"
            className="chat__muc-recipient"
            readOnly
          />
          <label htmlFor={`sendGroupChatMessage`} className="visually-hidden">
            Lähetä
          </label>
          <textarea
            id={`sendGroupChatMessage-`}
            className="chat__memofield chat__memofield--muc-message"
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <button
            className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${chatRoomTypeClassName}`}
            type="submit"
            onClick={postMessage}
          >
            <span className="icon-arrow-right"></span>
          </button>
        </div>
      </div>
    </div>
  );
};

/**
 * Props
 */
interface Props {
  item: string;
  onClick?: () => void;
  children: React.ReactNode;
}

/**
 * Item
 * @param props props
 */
export const Item = (props: Props) => {
  const { item, children } = props;
  const y = useMotionValue(0);
  const boxShadow = useRaisedShadow(y);

  return (
    <Reorder.Item value={item} id={item} style={{ boxShadow, y }}>
      {children}
    </Reorder.Item>
  );
};

export { ChatPrivatePanel, ChatRoomPanel };
