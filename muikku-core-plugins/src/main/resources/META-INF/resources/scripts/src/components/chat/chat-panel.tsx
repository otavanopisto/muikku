import * as React from "react";
import ChatMessage from "./chat-message";
import { useChatContext } from "./context/chat-context";
import { motion } from "framer-motion";
import ChatRoomEditAndInfoDialog from "./dialogs/chat-room-edit-info-dialog";
import { ChatRoom, ChatUser } from "~/generated/client";
import { ChatDiscussionInstance } from "./utility/chat-discussion-instance";
import useDiscussionInstance from "./hooks/useDiscussionInstance";

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
   * Discussion instance.
   */
  discussionInstance: ChatDiscussionInstance;
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

  const { infoState, instance } = useDiscussionInstance({
    instance: props.discussionInstance,
  });

  const { messages, newMessage, canLoadMore, loadMoreMessages, postMessage } =
    infoState;

  /**
   * Handles textarea enter key down.
   * @param e e
   */
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postMessage();
    }
  };

  /**
   * Handles textarea change.
   * @param e e
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    instance.newMessage = e.target.value;
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
          <MessagesContainer
            targetIdentifier={props.targetIdentifier}
            existingScrollTopValue={instance.scrollTop}
            onScrollTopChange={(scrollTop) => {
              instance.scrollTop = scrollTop;
            }}
            onScrollTop={canLoadMore ? loadMoreMessages : undefined}
            className="chat__messages-container"
            modifiers={["private"]}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
          </MessagesContainer>
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

  const { infoState, instance } = useDiscussionInstance({
    instance: props.discussionInstance,
  });

  const { messages, newMessage, canLoadMore, loadMoreMessages, postMessage } =
    infoState;

  const isWorkspace = true;

  const modifier = isWorkspace ? "workspace" : "other";

  /**
   * Handles enter key down.
   * @param e e
   */
  const handleEnterKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      postMessage();
    }
  };

  /**
   * Handles textarea change.
   * @param e e
   */
  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    instance.newMessage = e.target.value;
  };

  return (
    <div
      className="chat__panel-wrapper"
      style={{
        height: "100%",
      }}
    >
      <div className={`chat__panel chat__panel--${modifier}`}>
        <div className={`chat__panel-header chat__panel-header--${modifier}`}>
          <ChatRoomEditAndInfoDialog room={props.targetRoom} defaults="info">
            <div className="chat__panel-header-title">{props.title}</div>
          </ChatRoomEditAndInfoDialog>

          <div className="chat__button chat__button--occupants icon-users"></div>

          <div className="chat__button chat__button--room-settings icon-cogs"></div>
          <div
            onClick={closeDiscussion}
            className="chat__button chat__button--room-settings icon-cross"
          ></div>
        </div>

        <div className="chat__panel-body chat__panel-body--chatroom">
          <MessagesContainer
            targetIdentifier={props.targetIdentifier}
            existingScrollTopValue={instance.scrollTop}
            onScrollTop={canLoadMore ? loadMoreMessages : undefined}
            onScrollTopChange={(scrollTop) => {
              instance.scrollTop = scrollTop;
            }}
            className="chat__messages-container chat__messages-container"
            modifiers={[modifier]}
          >
            {messages.map((msg) => (
              <ChatMessage key={msg.id} msg={msg} />
            ))}
          </MessagesContainer>
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
  existingScrollTopValue?: number | null;
  onScrollTop?: () => void;
  onScrollTopChange?: (scrollTop: number) => void;
}

/**
 * List of messages with scroll to bottom.
 * @param props props
 */
const MessagesContainer: React.FC<MessagesContainerProps> = (props) => {
  const {
    className,
    modifiers,
    targetIdentifier,
    children,
    existingScrollTopValue,
    onScrollTop,
    onScrollTopChange,
  } = props;

  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const msgsContainerRef = React.useRef<HTMLDivElement>(null);
  const currentScrollHeightRef = React.useRef<number>(null);
  const [scrollAttached, setScrollAttached] = React.useState<boolean>(false);

  const componentMounted = React.useRef<boolean>(false);
  const childrenCount = React.useRef<number>(React.Children.count(children));

  const childrenLength = React.useMemo(
    () => React.Children.count(children),
    [children]
  );

  // If scroll to top is disabled, reset scroll position
  React.useLayoutEffect(() => {
    if (!onScrollTop) {
      currentScrollHeightRef.current = null;
    }
  }, [onScrollTop]);

  // Scroll to existing position when target identifier changes and value exists
  // otherwise just scroll to bottom
  React.useEffect(() => {
    if (!componentMounted.current) {
      if (msgsContainerRef.current) {
        if (existingScrollTopValue) {
          msgsContainerRef.current.scrollTop = existingScrollTopValue;
        } else {
          setTimeout(() => {
            msgsContainerRef.current.scrollTo({
              top: msgsContainerRef.current.scrollHeight,
              behavior: "auto",
            });
          }, 50);
        }
      }

      currentScrollHeightRef.current = 0;
    }
  }, [existingScrollTopValue, targetIdentifier]);

  // When new message is added...
  React.useEffect(() => {
    if (componentMounted.current) {
      // Scroll to bottom when new message is added
      if (msgsContainerRef.current && childrenLength > childrenCount.current) {
        // Attached to bottom, scroll to bottom and update children count
        if (scrollAttached && lastMessageRef.current) {
          childrenCount.current = childrenLength;
          lastMessageRef.current.scrollIntoView({
            behavior: "smooth",
          });
        }
        // Not attached to bottom, keep scroll position and update children count
        else if (!scrollAttached && currentScrollHeightRef.current) {
          childrenCount.current = childrenLength;
          msgsContainerRef.current.scrollTop =
            msgsContainerRef.current.scrollHeight -
            currentScrollHeightRef.current;

          // Reset scroll position
          currentScrollHeightRef.current = null;
        }
      }
    }
  }, [childrenLength, scrollAttached]);

  React.useEffect(() => {
    componentMounted.current = true;
  }, []);

  React.useEffect(() => {
    /**
     * handleScroll
     * @param e e
     */
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;

      // Check if target is scrollable
      const isScrollable = target.scrollHeight > target.clientHeight;

      // Check if scroll has reached the top
      const reachedTop = target.scrollTop === 0;

      // Check if scroll has reached the bottom
      const Reacthedbottom =
        Math.abs(
          target.scrollHeight - target.clientHeight - target.scrollTop
        ) <= 1;

      onScrollTopChange &&
        onScrollTopChange(Reacthedbottom ? null : target.scrollTop);

      setScrollAttached(Reacthedbottom);

      if (isScrollable && reachedTop && msgsContainerRef.current) {
        // Save scroll position when scroll is at the top
        currentScrollHeightRef.current = msgsContainerRef.current.scrollHeight;
        onScrollTop && onScrollTop();
      }
    };

    const ref = msgsContainerRef.current;

    ref && ref.addEventListener("scroll", handleScroll);

    return () => {
      ref && ref.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollTop, onScrollTopChange]);

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
      className={`${className} ${mappedModifiers}`}
    >
      {props.children}
      <div ref={lastMessageRef} className="chat__messages-last-message"></div>
    </motion.div>
  );
};

export { ChatPrivatePanel, ChatRoomPanel };
