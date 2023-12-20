/* eslint-disable camelcase */
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import ChatViews from "./animated-views";
import { useChatContext } from "./context/chat-context";
import { useChatWindowBreakpointsContext } from "./context/chat-window-breakpoints-context";
import { AddIcon } from "./chat-helpers";
import { ChatUsersList } from "./chat-users";
import { ChatRoomNew, ChatRoomsLists } from "./chat-rooms";
import ChatProfile from "./chat-profile";

const PANEL_RIGHT_MIN_WIDTH = 66;
const PANEL_LEFT_MIN_WIDTH = 85;

const PANEL_LEFT_MAX_WIDTH = 250;
const PANEL_RIGHT_MAX_WIDTH = 200;

/**
 * ChatMainProps
 */
interface ChatMainProps {}

/**
 * ChatMain
 * @param props props
 */
function ChatMain(props: ChatMainProps) {
  const { toggleLeftPanel, toggleRightPanel, leftPanelOpen, rightPanelOpen } =
    useChatContext();

  const { isMobile } = useChatWindowBreakpointsContext();

  const animationControls = useAnimationControls();
  const animationControlsLeftPanel = useAnimationControls();
  const animationControlsRightPanel = useAnimationControls();

  const roomPanelRef = React.useRef<HTMLDivElement>(null);
  const peoplePanelRef = React.useRef<HTMLDivElement>(null);
  const mainWrapperRef = React.useRef<HTMLDivElement>(null);

  const initialized = React.useRef(false);

  React.useEffect(() => {
    if (!initialized.current) {
      return;
    }

    if (leftPanelOpen) {
      animationControlsLeftPanel.start({
        width: PANEL_LEFT_MAX_WIDTH,
        transition: {
          duration: 0.3,
          type: "tween",
        },
      });
    } else {
      animationControlsLeftPanel.start({
        width: PANEL_LEFT_MIN_WIDTH,
        transition: {
          duration: 0.3,
          type: "tween",
        },
      });
    }
  }, [animationControlsLeftPanel, leftPanelOpen]);

  React.useEffect(() => {
    if (!initialized.current) {
      return;
    }

    if (rightPanelOpen) {
      animationControlsRightPanel.start({
        width: PANEL_RIGHT_MAX_WIDTH,
        transition: {
          duration: 0.3,
          type: "tween",
        },
      });
    } else {
      animationControlsRightPanel.start({
        width: PANEL_RIGHT_MIN_WIDTH,
        transition: {
          duration: 0.3,
          type: "tween",
        },
      });
    }
  }, [animationControlsRightPanel, rightPanelOpen]);

  // Set resize observer to panel refs and update mainWrapperRef margin left and right
  React.useEffect(() => {
    if (roomPanelRef.current && initialized.current) {
      const resizeRoomsObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Update mainWrapperRef margin left to roomPanelRef width
          // if peoplePanelRef width is changed and window current width is not mobile
          if (entry.target === roomPanelRef.current && !isMobile) {
            animationControls.set({ marginLeft: entry.target.clientWidth });
          }
        }
      });

      const resizePeopleObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Update mainWrapperRef margin right to peoplePanelRef width
          // if peoplePanelRef width is changed and window current width is not mobile
          if (entry.target === peoplePanelRef.current && !isMobile) {
            animationControls.set({ marginRight: entry.target.clientWidth });
          }
        }
      });

      resizeRoomsObserver.observe(roomPanelRef.current);
      resizePeopleObserver.observe(peoplePanelRef.current);

      return () => {
        resizeRoomsObserver.disconnect();
        resizePeopleObserver.disconnect();
      };
    }
  }, [roomPanelRef, mainWrapperRef, isMobile, animationControls]);

  React.useEffect(() => {
    if (isMobile) {
      unstable_batchedUpdates(() => {
        toggleRightPanel(false);
        toggleLeftPanel(false);
      });

      animationControls.start({
        marginLeft: PANEL_LEFT_MIN_WIDTH,
        marginRight: PANEL_RIGHT_MIN_WIDTH,
        transition: {
          duration: 0.1,
          type: "tween",
        },
      });
    } else {
      if (roomPanelRef.current && peoplePanelRef.current) {
        animationControls.start({
          marginLeft: roomPanelRef.current?.clientWidth,
          marginRight: peoplePanelRef.current?.clientWidth,
          transition: {
            duration: 0.1,
            type: "tween",
          },
        });
      }
    }
  }, [
    animationControls,
    isMobile,
    roomPanelRef,
    peoplePanelRef,
    toggleRightPanel,
    toggleLeftPanel,
  ]);

  React.useEffect(() => {
    initialized.current = true;
  }, []);

  return (
    <div
      id="chat-main"
      style={{
        width: "100%",
        height: "100%",
      }}
    >
      <motion.div
        ref={roomPanelRef}
        initial={false}
        animate={animationControlsLeftPanel}
        className="chat-window__rooms-panel"
        style={{
          width: PANEL_LEFT_MIN_WIDTH,
        }}
      >
        <div
          onClick={() => toggleLeftPanel()}
          className="chat-window__expand-toggle chat-window__expand-toggle--rooms"
        >
          <AddIcon />
        </div>

        <ChatRoomNew />
        <ChatRoomsLists minimized={!leftPanelOpen} />
      </motion.div>
      <motion.div
        ref={mainWrapperRef}
        initial={false}
        animate={animationControls}
        className="chat-window__conversations-panel"
        style={{
          marginLeft: PANEL_LEFT_MIN_WIDTH,
          marginRight: PANEL_RIGHT_MIN_WIDTH,
        }}
      >
        <ChatViews
          wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
        />
      </motion.div>
      <motion.div
        ref={peoplePanelRef}
        initial={false}
        animate={animationControlsRightPanel}
        className="chat-window__users-panel"
        style={{
          width: PANEL_RIGHT_MIN_WIDTH,
        }}
      >
        <div
          onClick={() => toggleRightPanel()}
          className="chat-window__expand-toggle chat-window__expand-toggle--users"
        >
          <AddIcon />
        </div>

        <ChatUsersList minimized={!rightPanelOpen} />
        <ChatProfile className="chat-window__profile" />
      </motion.div>
    </div>
  );
}

export default ChatMain;
