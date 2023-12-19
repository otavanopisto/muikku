import * as React from "react";
import useMessages from "./hooks/useMessages";
import ChatMessage from "./chat-message";
import { useChatContext } from "./context/chat-context";
import { motion } from "framer-motion";
import ChatEditAndInfoRoomDialog from "./dialogs/chat-edit-info-room-dialog";
import { ChatRoom, ChatUser } from "~/generated/client";

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
  /**
   * Modifiers
   */
  modifiers?: string[];
}

/**
 * ChatPrivatePanelProps
 */
interface ChatPrivatePanelProps extends ChatPanelProps {
  /**
   * Target user.
   */
  targetUser: ChatUser;
}

/**
 * ChatPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatPrivatePanel = (props: ChatPrivatePanelProps) => {
  const { closeDiscussion } = useChatContext();

  const {
    chatMsgs,
    newMessage,
    setNewMessage,
    postMessage,
    fetchMoreMessages,
    canLoadMore,
    loadingInitialChatMsgs,
  } = useMessages(props.targetIdentifier, [
    props.targetIdentifier,
    `user-${props.userId}`,
  ]);

  /**
   * handleEnterKeyDown
   * @param e e
   */
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postMessage();
    }
  };

  /**
   * handleTextareaChange
   * @param e e
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

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

          <div
            onClick={closeDiscussion}
            className="chat__button chat__button--room-settings icon-cross"
          ></div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          {!loadingInitialChatMsgs && (
            <MessagesContainer
              targetIdentifier={props.targetIdentifier}
              onScrollTop={canLoadMore && fetchMoreMessages}
              className="chat__messages-container"
              modifiers={["private"]}
            >
              {chatMsgs.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
            </MessagesContainer>
          )}
        </div>
        <div className="chat__panel-footer chat__panel-footer--chatroom">
          <textarea
            className="chat__memofield chat__memofield--muc-message"
            value={newMessage}
            onChange={handleTextareaChange}
            onKeyDown={handleEnterKeyDown}
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
 * ChatRoomPanelProps
 */
interface ChatRoomPanelProps extends ChatPanelProps {
  /**
   * Target room.
   */
  targetRoom: ChatRoom;
}

/**
 * ChatPublicPanel
 * @param props props
 * @returns JSX.Element
 */
const ChatRoomPanel = (props: ChatRoomPanelProps) => {
  const { closeDiscussion } = useChatContext();
  const {
    loadingInitialChatMsgs,
    canLoadMore,
    chatMsgs,
    newMessage,
    setNewMessage,
    postMessage,
    fetchMoreMessages,
  } = useMessages(props.targetIdentifier, [props.targetIdentifier]);

  const isWorkspace = true;

  const modifier = isWorkspace ? "workspace" : "other";

  /**
   * handleEnterKeyDown
   * @param e e
   */
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postMessage();
    }
  };

  /**
   * handleTextareaChange
   * @param e e
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="chat__panel-wrapper">
      <div className={`chat__panel chat__panel--${modifier}`}>
        <div className={`chat__panel-header chat__panel-header--${modifier}`}>
          <ChatEditAndInfoRoomDialog room={props.targetRoom} defaults="info">
            <div className="chat__panel-header-title">{props.title}</div>
          </ChatEditAndInfoRoomDialog>

          <div className="chat__button chat__button--occupants icon-users"></div>

          <div className="chat__button chat__button--room-settings icon-cogs"></div>
          <div
            onClick={closeDiscussion}
            className="chat__button chat__button--room-settings icon-cross"
          ></div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          {!loadingInitialChatMsgs && (
            <MessagesContainer
              targetIdentifier={props.targetIdentifier}
              onScrollTop={canLoadMore ? fetchMoreMessages : undefined}
              className="chat__messages-container chat__messages-container"
              modifiers={[modifier]}
            >
              {chatMsgs.map((msg) => (
                <ChatMessage key={msg.id} msg={msg} />
              ))}
            </MessagesContainer>
          )}
        </div>
        <div className="chat__panel-footer chat__panel-footer--chatroom">
          <textarea
            id="sendGroupChatMessage"
            className="chat__memofield chat__memofield--muc-message"
            onChange={handleTextareaChange}
            onKeyDown={handleEnterKeyDown}
            value={newMessage}
          />
          <button
            className={`chat__submit chat__submit--send-muc-message chat__submit--send-muc-message-${modifier}`}
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
 * MessagesContainerProps
 */
interface MessagesContainerProps {
  targetIdentifier: string;
  className?: string;
  modifiers?: string[];
  onScrollTop?: () => void;
}

/**
 * List of messages with scroll to bottom.
 * @param props props
 */
const MessagesContainer: React.FC<MessagesContainerProps> = (props) => {
  const { className, modifiers, targetIdentifier, children, onScrollTop } =
    props;

  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const msgsContainerRef = React.useRef<HTMLDivElement>(null);
  const scrollPositionRef = React.useRef<number>(null);
  const [scrollDetached, setScrollDetached] = React.useState<boolean>(false);

  const childrenLength = React.useMemo(
    () => React.Children.count(children),
    [children]
  );

  React.useLayoutEffect(() => {
    if (!onScrollTop) {
      scrollPositionRef.current = null;
    }
  }, [onScrollTop]);

  React.useEffect(() => {
    // Scroll to bottom when new message is added
    if (lastMessageRef.current && !scrollDetached) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [childrenLength, scrollDetached]);

  React.useEffect(() => {
    // Keepl scroll position when adding older messages
    if (
      msgsContainerRef.current &&
      scrollPositionRef.current &&
      scrollDetached
    ) {
      msgsContainerRef.current.scrollTo({
        behavior: "auto",
        top: msgsContainerRef.current.scrollHeight - scrollPositionRef.current,
      });

      // Reset scroll position
      scrollPositionRef.current = null;
    }
  }, [childrenLength, scrollDetached]);

  React.useLayoutEffect(() => {
    // Reset scroll position when target changes
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "auto" });
    }

    scrollPositionRef.current = 0;
  }, [targetIdentifier]);

  /**
   * Handles message container scroll.
   * @param e e
   */
  const handleMessageContainerScroll = (
    e: React.UIEvent<HTMLDivElement, UIEvent>
  ) => {
    const target = e.target as HTMLDivElement;

    // Check if target is scrollable
    const isScrollable = target.scrollHeight > target.clientHeight;

    // Check if scroll has reached the top
    const reachedTop = target.scrollTop === 0;

    // Check if scroll has reached the bottom
    const Reacthedbottom =
      Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <=
      1;

    setScrollDetached(!Reacthedbottom);

    if (isScrollable && reachedTop && msgsContainerRef.current) {
      // Save scroll position when scroll is at the top
      scrollPositionRef.current = msgsContainerRef.current.scrollHeight;
      props.onScrollTop && props.onScrollTop();
    }
  };

  const mappedModifiers = modifiers
    ? modifiers.map((modifier) => `${className}--${modifier}`)
    : "";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{
        ease: "easeInOut",
        duration: 0.3,
      }}
      ref={msgsContainerRef}
      onScroll={handleMessageContainerScroll}
      className={`${className} ${mappedModifiers}`}
    >
      {props.children}
      <div ref={lastMessageRef} className="chat__messages-last-message"></div>
    </motion.div>
  );
};

export { ChatPrivatePanel, ChatRoomPanel };
