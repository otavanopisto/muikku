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

  const { isMobileWidth } = useChatContext();

  const { infoState, instance } = useDiscussionInstance({
    instance: props.discussionInstance,
  });
  const { dashboardBlockedUsers, openBlockUserDialog } = useChatContext();

  const contentRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

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

  return (
    <div className={`chat__panel chat__panel--private`}>
      <div className="chat__discussion-panel-header">
        <div className="chat__discussion-panel-header-title">
          {targetUser.nick}
        </div>
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
          onScrollTop={canLoadMore ? loadMoreMessages : undefined}
          onScrollTopChange={(scrollTop) => {
            instance.scrollTop = scrollTop;
          }}
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

  const { messages, newMessage, canLoadMore, loadMoreMessages, postMessage } =
    infoState;

  const contentRef = React.useRef<HTMLDivElement>(null);
  const footerRef = React.useRef<HTMLDivElement>(null);

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
    }
  };

  /**
   * Handles editor change.
   * @param e e
   */
  const handleEditorChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    instance.newMessage = e.target.value;
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
          targetIdentifier={targetRoom.identifier}
          existingScrollTopValue={instance.scrollTop}
          onScrollTop={canLoadMore ? loadMoreMessages : undefined}
          onScrollTopChange={(scrollTop) => {
            instance.scrollTop = scrollTop;
          }}
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

  //
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
  }, [childrenLength, scrollAttached]);

  React.useEffect(() => {
    componentMounted.current = true;

    return () => {
      componentMounted.current = false;
    };
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
