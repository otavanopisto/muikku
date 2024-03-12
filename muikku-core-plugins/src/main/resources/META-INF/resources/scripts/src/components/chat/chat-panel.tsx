import * as React from "react";
import ChatMessage from "./chat-message";
import { motion } from "framer-motion";
import ChatRoomEditAndInfoDialog from "./dialogs/chat-room-edit-info-dialog";
import { ChatRoom, ChatUser } from "~/generated/client";
import { ChatDiscussionInstance } from "./utility/chat-discussion-instance";
import useDiscussionInstance from "./hooks/useDiscussionInstance";
import { IconButton } from "../general/button";
import { useChatContext } from "./context/chat-context";
import TextareaAutosize from "react-textarea-autosize";
import { useWindowContext } from "~/context/window-context";
import { useIntersectionObserver } from "usehooks-ts";

/**
 * ChatPanelProps
 */
interface ChatPanelProps {
  /**
   * Discussion instance.
   */
  discussionInstance: ChatDiscussionInstance;
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
 * Chat Private Panel
 * @param props props
 * @returns JSX.Element
 */
function ChatPrivatePanel(props: ChatPrivatePanelProps) {
  const { targetUser } = props;

  const {
    isMobileWidth,
    currentUser,
    markMsgsAsRead,
    dashboardBlockedUsers,
    openBlockUserDialog,
  } = useChatContext();

  // Discussion instance to handle instance changes
  const { infoState, instance } = useDiscussionInstance({
    instance: props.discussionInstance,
  });

  // Deconstructing infoState
  const { messages, newMessage, canLoadMore, loadMoreMessages, postMessage } =
    infoState;

  // Refs for content and footer
  const contentRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

  // Imperative ref to expose scrollToBottom
  const messagesContainerRef = React.useRef<MessagesContainerRef>(null);

  // State to track whether user is scrolling or not and timeout ref
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  const timeOut = React.useRef<NodeJS.Timeout>(null);

  const [msgToEdited, setMsgToEdited] = React.useState<ChatMessage | null>(
    null
  );

  // Resize observer to track footer height and adjust content bottom
  React.useEffect(() => {
    const contentCurrent = contentRef.current;
    const footerCurrent = footerRef.current;

    if (!footerCurrent && !contentCurrent) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      contentCurrent.style.bottom = `${footerCurrent.clientHeight}px`;
    });
    resizeObserver.observe(footerCurrent);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  const isBlocked = React.useMemo(() => {
    if (!dashboardBlockedUsers) {
      return false;
    }

    return (
      dashboardBlockedUsers.find(
        (blockedUser) => blockedUser.identifier === targetUser.identifier
      ) !== undefined
    );
  }, [dashboardBlockedUsers, targetUser.identifier]);

  /**
   * Method to debounce scrolling.
   */
  const debounce = () => {
    setIsScrolling(true);
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(function () {
      setIsScrolling(false);
    }, 1000);
  };

  /**
   * Handles enter key down.
   * @param e e
   */
  const handleEnterKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await postMessage();

      // When current user send a message, scroll to bottom
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollToBottom();
      }
    }
  };

  /**
   * Handles editor change.
   * @param e e
   */
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    instance.newMessage = e.target.value;
  };

  /**
   * Handles open block user dialog.
   */
  const handleOpenBlockUserDialog = () => {
    openBlockUserDialog(props.targetUser);
  };

  /**
   * Handles scroll to track scroll top and
   * whether scroll is active or not state track with debounce.
   * @param e e
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;

    const reacthedbottom =
      Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <=
      1;

    if (reacthedbottom) {
      instance.scrollTop = null;
    } else {
      instance.scrollTop = target.scrollTop;
    }

    debounce();
  };

  /**
   * Handles scroll top.
   */
  const handleScrollTop = () => {
    if (canLoadMore) {
      loadMoreMessages();
    }
  };

  /**
   * Handles scroll bottom.
   */
  const handleScrollBottom = () => {
    markMsgsAsRead(targetUser.identifier);
  };

  let title = targetUser.nick;

  if (currentUser.type === "STAFF") {
    title += ` - ${targetUser.name}`;
  }

  /**
   * Handles edit click.
   * @param msg msg
   */
  const handleEditClick = (msg: ChatMessage) => {
    setMsgToEdited(msg);
  };

  return (
    <div className={`chat__discussion-panel chat__discussion-panel--private`}>
      <div className="chat__discussion-panel-header">
        <div className="chat__discussion-panel-header-title">{title}</div>
        <div className="chat__discussion-panel-header-actions">
          {!isBlocked && props.targetUser.type === "STUDENT" && (
            <IconButton
              icon="blocked"
              buttonModifiers={[
                `${isMobileWidth ? "chat-invert" : "chat-block"}`,
              ]}
              onClick={handleOpenBlockUserDialog}
            />
          )}
        </div>
      </div>

      <div className="chat__discussion-panel-body" ref={contentRef}>
        <MessagesContainer
          ref={messagesContainerRef}
          targetIdentifier={targetUser.identifier}
          existingScrollTopValue={instance.scrollTop}
          onScroll={handleScroll}
          onScrollTop={handleScrollTop}
          onScrollBottom={handleScrollBottom}
          className="chat__messages-container"
        >
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              editModeActive={msgToEdited?.id === msg.id}
              disableLongPress={isScrolling}
              onEditClick={handleEditClick}
            />
          ))}
        </MessagesContainer>
      </div>

      <div className="chat__discussion-panel-footer" ref={footerRef}>
        <div className="chat__discussion-editor-container">
          <TextareaAutosize
            className="chat__new-message"
            value={newMessage}
            onChange={handleEditorChange}
            onKeyDown={handleEnterKeyDown}
            maxRows={5}
            disabled={isBlocked || targetUser.presence === "DISABLED"}
          />
        </div>
        <button
          className="chat__submit"
          type="submit"
          onClick={postMessage}
          disabled={isBlocked || targetUser.presence === "DISABLED"}
        >
          <span className="icon-arrow-right"></span>
        </button>
      </div>
    </div>
  );
}

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
 * Chat Room Panel
 * @param props props
 * @returns JSX.Element
 */
function ChatRoomPanel(props: ChatRoomPanelProps) {
  const { targetRoom } = props;

  const { markMsgsAsRead } = useChatContext();

  // Discussion instance to handle instance changes
  const { infoState, instance } = useDiscussionInstance({
    instance: props.discussionInstance,
  });

  // Deconstructing infoState
  const { messages, newMessage, canLoadMore, loadMoreMessages, postMessage } =
    infoState;

  // Refs for content and footer
  const contentRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

  // Imperative ref to expose scrollToBottom
  const messagesContainerRef = React.useRef<MessagesContainerRef>(null);

  // State to track whether user is scrolling or not and timeout ref
  const [isScrolling, setIsScrolling] = React.useState<boolean>(false);
  const timeOut = React.useRef<NodeJS.Timeout>(null);

  const [msgToEdited, setMsgToEdited] = React.useState<ChatMessage | null>(
    null
  );

  // Resize observer to track footer height and adjust content bottom
  React.useEffect(() => {
    const contentCurrent = contentRef.current;
    const footerCurrent = footerRef.current;

    if (!footerCurrent && !contentCurrent) {
      return;
    }
    const resizeObserver = new ResizeObserver(() => {
      contentCurrent.style.bottom = `${footerCurrent.clientHeight}px`;
    });
    resizeObserver.observe(footerCurrent);
    return () => resizeObserver.disconnect(); // clean up
  }, []);

  /**
   * Method to debounce scrolling.
   */
  const debounce = () => {
    setIsScrolling(true);
    clearTimeout(timeOut.current);
    timeOut.current = setTimeout(function () {
      setIsScrolling(false);
    }, 1000);
  };

  /**
   * Handles enter key down.
   * @param e e
   */
  const handleEnterKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await postMessage();

      // When current user send a message, scroll to bottom
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollToBottom();
      }
    }
  };

  /**
   * Handles editor change.
   * @param e e
   */
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    instance.newMessage = e.target.value;
  };

  /**
   * Handles scroll to track scroll top and
   * whether scroll is active or not state track with debounce.
   * @param e e
   */
  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.currentTarget;

    const reacthedbottom =
      Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) <=
      1;

    if (reacthedbottom) {
      instance.scrollTop = null;
    } else {
      instance.scrollTop = target.scrollTop;
    }

    debounce();
  };

  /**
   * Handles scroll top.
   */
  const handleScrollTop = () => {
    if (canLoadMore) {
      loadMoreMessages();
    }
  };

  /**
   * Handles scroll bottom.
   */
  const handleScrollBottom = () => {
    markMsgsAsRead(targetRoom.identifier);
  };

  /**
   * Handles edit click.
   * @param msg msg
   */
  const handleEditClick = (msg: ChatMessage) => {
    setMsgToEdited(msg);
  };

  return (
    <div className="chat__discussion-panel">
      <div className="chat__discussion-panel-header">
        <ChatRoomEditAndInfoDialog room={props.targetRoom} defaults="info">
          <div className="chat__discussion-panel-header-title">
            {targetRoom.name}
          </div>
        </ChatRoomEditAndInfoDialog>
        <div className="chat__discussion-panel-header-description">
          {targetRoom.description}
        </div>
      </div>

      <div className="chat__discussion-panel-body" ref={contentRef}>
        <MessagesContainer
          ref={messagesContainerRef}
          targetIdentifier={targetRoom.identifier}
          existingScrollTopValue={instance.scrollTop}
          onScroll={handleScroll}
          onScrollTop={handleScrollTop}
          onScrollBottom={handleScrollBottom}
          className="chat__messages-container"
        >
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              msg={msg}
              editModeActive={msgToEdited?.id === msg.id}
              disableLongPress={isScrolling}
              onEditClick={handleEditClick}
            />
          ))}
        </MessagesContainer>
      </div>
      <form onSubmit={postMessage}>
        <div className="chat__discussion-panel-footer" ref={footerRef}>
          <div className="chat__discussion-editor-container">
            <TextareaAutosize
              className="chat__new-message"
              value={newMessage}
              onChange={handleEditorChange}
              onKeyDown={handleEnterKeyDown}
              maxRows={5}
            />
          </div>

          <button className="chat__submit" type="submit">
            <span className="icon-arrow-right"></span>
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * MessagesContainerProps
 */
interface MessagesContainerProps {
  children: React.ReactNode;
  targetIdentifier: string;
  className?: string;
  modifiers?: string[];
  existingScrollTopValue?: number | null;
  /**
   * onScroll
   * @param target target
   */
  onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
  /**
   * When scroll reaches top
   */
  onScrollTop?: () => void;
  /**
   * When scroll reaches bottom
   */
  onScrollBottom?: () => void;
}

export type MessagesContainerRef = {
  scrollToBottom: () => void;
};

/**
 * List of messages with scroll to bottom.
 * @param props props
 */
const MessagesContainer = React.forwardRef<
  MessagesContainerRef,
  MessagesContainerProps
>(function MessagesContainer(props, ref) {
  const {
    className,
    modifiers,
    targetIdentifier,
    children,
    existingScrollTopValue,
    onScroll,
    onScrollTop,
    onScrollBottom,
  } = props;

  const [scrollAttached, setScrollAttached] = React.useState<boolean>(false);

  const browserFocusIsActive = useWindowContext();
  const browserIsActiveRef = React.useRef<boolean>(null);

  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const msgsContainerRef = React.useRef<HTMLDivElement>(null);
  const currentScrollHeightRef = React.useRef<number>(null);
  const componentMounted = React.useRef<boolean>(false);
  const childrenCount = React.useRef<number>(React.Children.count(children));

  const childrenLength = React.useMemo(
    () => React.Children.count(children),
    [children]
  );

  // Intersection observer to detect if the user has scrolled to the top
  const firstMsgsIntersectionObserver = useIntersectionObserver({
    /**
     * Intersection observer callback
     * @param isIntersecting isIntersecting
     */
    onChange(isIntersecting) {
      const msgsContainerCurrent = msgsContainerRef.current;

      if (isIntersecting && onScrollTop && msgsContainerCurrent) {
        const scrollable =
          msgsContainerCurrent.scrollHeight > msgsContainerCurrent.clientHeight;

        if (!scrollable) {
          return;
        }
        // Save scroll position when scroll is at the top
        currentScrollHeightRef.current = msgsContainerCurrent.scrollHeight;
        onScrollTop();
      }
    },
  });

  // Intersection observer to detect if the user has scrolled to the bottom
  const lastMsgIntersectionObserver = useIntersectionObserver({
    /**
     * Intersection observer callback
     * @param isIntersecting isIntersecting
     */
    onChange(isIntersecting) {
      if (isIntersecting) {
        // If already attached to bottom, skip
        if (scrollAttached) return;

        setScrollAttached(true);
      } else {
        // If not attached to bottom, skip
        if (!scrollAttached) return;
        setScrollAttached(false);
      }
    },
  });

  // When browser focus changes while attached to bottom, fire onScrollBottom
  // Only if active and not already fired
  React.useEffect(() => {
    if (browserFocusIsActive && scrollAttached) {
      onScrollBottom && onScrollBottom();
      browserIsActiveRef.current = browserFocusIsActive;
    }
  }, [browserFocusIsActive, onScrollBottom, scrollAttached]);

  // If scroll to top is disabled, reset scroll position
  React.useLayoutEffect(() => {
    if (!onScrollTop) {
      currentScrollHeightRef.current = null;
    }
  }, [onScrollTop]);

  React.useEffect(() => {
    const contentCurrent = msgsContainerRef.current;

    if (!contentCurrent) return;
    const resizeObserver = new ResizeObserver(() => {
      if (scrollAttached) {
        contentCurrent.scrollTo({
          top: contentCurrent.scrollHeight,
          behavior: "auto",
        });
      }
    });
    resizeObserver.observe(contentCurrent);
    return () => resizeObserver.disconnect(); // clean up
  }, [scrollAttached]);

  // Scroll to existing position when target identifier changes and value exists
  // otherwise just scroll to bottom
  React.useEffect(() => {
    if (!componentMounted.current) {
      if (msgsContainerRef.current) {
        if (existingScrollTopValue !== null) {
          msgsContainerRef.current.scrollTop = existingScrollTopValue;
        } else {
          msgsContainerRef.current.scrollTo({
            top: msgsContainerRef.current.scrollHeight,
            behavior: "auto",
          });
        }
      }

      currentScrollHeightRef.current = 0;
    }
  }, [existingScrollTopValue, targetIdentifier]);

  // When new message is added...
  React.useEffect(() => {
    if (componentMounted.current) {
      if (msgsContainerRef.current && childrenLength > childrenCount.current) {
        // Attached to bottom, scroll to bottom and update children count
        if (scrollAttached && lastMessageRef.current) {
          childrenCount.current = childrenLength;

          lastMessageRef.current.scrollIntoView({
            behavior: "auto",
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
  }, [childrenLength, onScrollBottom, scrollAttached]);

  React.useEffect(() => {
    componentMounted.current = true;

    return () => {
      componentMounted.current = false;
    };
  }, []);

  // Way to expose scrollToBottom to parent component
  React.useImperativeHandle(ref, () => ({
    /**
     * Handles scroll to bottom.
     */
    scrollToBottom: () => {
      if (lastMessageRef.current) {
        lastMessageRef.current.scrollIntoView({
          behavior: "auto",
        });
      }
    },
  }));

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
      onScroll={onScroll}
      className={`${className} ${mappedModifiers}`}
    >
      <div
        ref={firstMsgsIntersectionObserver.ref}
        className="chat__messages-first-message"
      ></div>
      {props.children}
      <div
        ref={(ref) => {
          lastMsgIntersectionObserver.ref(ref);
          lastMessageRef.current = ref;
        }}
        className="chat__messages-last-message"
      ></div>
    </motion.div>
  );
});

export { ChatPrivatePanel, ChatRoomPanel };
