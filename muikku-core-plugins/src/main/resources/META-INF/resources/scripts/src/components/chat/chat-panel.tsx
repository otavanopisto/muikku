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
const ChatPrivatePanel = (props: ChatPrivatePanelProps) => {
  const { targetUser } = props;

  const { isMobileWidth, currentUser, markMsgsAsRead } = useChatContext();

  const { infoState, instance } = useDiscussionInstance({
    instance: props.discussionInstance,
  });
  const { dashboardBlockedUsers, openBlockUserDialog } = useChatContext();

  const contentRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

  const messagesContainerRef = React.useRef<MessagesContainerHandle>(null);

  const { messages, newMessage, canLoadMore, loadMoreMessages, postMessage } =
    infoState;

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
   * Handles enter key down.
   * @param e e
   */
  const handleEnterKeyDown = async (
    e: React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await postMessage();

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

  /**
   * Handles scroll top change.
   * @param scrollTop scrollTop
   */
  const handleScrollTopChange = (scrollTop: number) => {
    instance.scrollTop = scrollTop;
  };

  let title = targetUser.nick;

  if (currentUser.type === "STAFF") {
    title += ` - ${targetUser.name}`;
  }

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
          targetIdentifier={targetUser.identifier}
          existingScrollTopValue={instance.scrollTop}
          onScrollTop={handleScrollTop}
          onScrollTopChange={handleScrollTopChange}
          onScrollBottom={handleScrollBottom}
          className="chat__messages-container"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
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
            autoFocus
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
 * Chat Room Panel
 * @param props props
 * @returns JSX.Element
 */
const ChatRoomPanel = (props: ChatRoomPanelProps) => {
  const { targetRoom } = props;

  const { infoState, instance } = useDiscussionInstance({
    instance: props.discussionInstance,
  });

  const { markMsgsAsRead } = useChatContext();

  const { messages, newMessage, canLoadMore, loadMoreMessages, postMessage } =
    infoState;

  const contentRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

  const messagesContainerRef = React.useRef<MessagesContainerHandle>(null);

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
   * Handles scroll top change.
   * @param scrollTop scrollTop
   */
  const handleScrollTopChange = (scrollTop: number) => {
    instance.scrollTop = scrollTop;
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
          onScrollTop={handleScrollTop}
          onScrollTopChange={handleScrollTopChange}
          onScrollBottom={handleScrollBottom}
          className="chat__messages-container"
        >
          {messages.map((msg) => (
            <ChatMessage key={msg.id} msg={msg} />
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
            autoFocus
          />
        </div>

        <button className="chat__submit" type="submit" onClick={postMessage}>
          <span className="icon-arrow-right"></span>
        </button>
      </div>
    </div>
  );
};

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
   * When scroll reaches top
   */
  onScrollTop?: () => void;
  /**
   * When scroll top changes
   * @param scrollTop scrollTop
   */
  onScrollTopChange?: (scrollTop: number) => void;
  /**
   * When scroll reaches bottom
   */
  onScrollBottom?: () => void;
}

export type MessagesContainerHandle = {
  scrollToBottom: () => void;
};

/**
 * List of messages with scroll to bottom.
 * @param props props
 */
const MessagesContainer = React.forwardRef<
  MessagesContainerHandle,
  MessagesContainerProps
>((props, ref) => {
  const {
    className,
    modifiers,
    targetIdentifier,
    children,
    existingScrollTopValue,
    onScrollTop,
    onScrollTopChange,
    onScrollBottom,
  } = props;

  const [scrollAttached, setScrollAttached] = React.useState<boolean>(false);

  const browserFocusIsActive = useWindowContext();
  const browserIsActiveRef = React.useRef<boolean>(null);

  const firstMessageRef = React.useRef<HTMLDivElement>(null);
  const lastMessageRef = React.useRef<HTMLDivElement>(null);
  const msgsContainerRef = React.useRef<HTMLDivElement>(null);
  const currentScrollHeightRef = React.useRef<number>(null);
  const componentMounted = React.useRef<boolean>(false);
  const childrenCount = React.useRef<number>(React.Children.count(children));

  const childrenLength = React.useMemo(
    () => React.Children.count(children),
    [children]
  );

  // When browser focus changes while attached to bottom, fire onScrollBottom
  // Only if active and not already fired
  React.useEffect(() => {
    if (browserFocusIsActive && scrollAttached) {
      onScrollBottom && onScrollBottom();
      browserIsActiveRef.current = browserFocusIsActive;
    }
  }, [browserFocusIsActive, onScrollBottom, scrollAttached]);

  // Intersection observer to detect if the user has scrolled to the top
  React.useEffect(() => {
    if (!firstMessageRef.current || !msgsContainerRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && onScrollTop) {
        const target = msgsContainerRef.current;

        const scrollable = target.scrollHeight > target.clientHeight;

        // If not scrollable, skip
        if (!scrollable) {
          return;
        }

        // Save scroll position when scroll is at the top
        currentScrollHeightRef.current = target.scrollHeight;

        onScrollTop();
      }
    });

    observer.observe(firstMessageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [onScrollTop]);

  // Intersection observer to detect if the user has scrolled to the bottom
  React.useEffect(() => {
    if (!lastMessageRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        // If already attached to bottom, skip
        if (scrollAttached) return;

        setScrollAttached(true);
      } else {
        // If not attached to bottom, skip
        if (!scrollAttached) return;

        setScrollAttached(false);
      }
    });

    observer.observe(lastMessageRef.current);

    return () => {
      observer.disconnect();
    };
  }, [scrollAttached]);

  // Scroll listener to trace the scroll position
  React.useEffect(() => {
    if (!msgsContainerRef.current) return;

    /**
     * handleScroll
     * @param e e
     */
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLDivElement;

      const reacthedbottom =
        Math.abs(
          target.scrollHeight - target.clientHeight - target.scrollTop
        ) <= 1;

      if (onScrollTopChange) {
        if (reacthedbottom) {
          onScrollTopChange(null);
        } else {
          onScrollTopChange(target.scrollTop);
        }
      }
    };

    const ref = msgsContainerRef.current;

    ref.addEventListener("scroll", handleScroll);

    return () => {
      ref.removeEventListener("scroll", handleScroll);
    };
  }, [onScrollTopChange]);

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

  /**
   * Handles scroll to bottom.
   */
  const handleScrollToBottom = () => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: "auto",
      });
    }
  };

  // Way to expose scrollToBottom to parent component
  React.useImperativeHandle(ref, () => ({
    scrollToBottom: handleScrollToBottom,
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
      className={`${className} ${mappedModifiers}`}
    >
      <div ref={firstMessageRef} className="chat__messages-first-message"></div>
      {props.children}
      <div ref={lastMessageRef} className="chat__messages-last-message"></div>
    </motion.div>
  );
});

MessagesContainer.displayName = "MessagesContainer";

export { ChatPrivatePanel, ChatRoomPanel };
