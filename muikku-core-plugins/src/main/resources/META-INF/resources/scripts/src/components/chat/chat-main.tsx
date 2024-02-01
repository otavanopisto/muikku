/* eslint-disable camelcase */
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import * as React from "react";
import { unstable_batchedUpdates } from "react-dom";
import ChatViews from "./animated-views";
import { useChatContext } from "./context/chat-context";
import { useChatWindowBreakpointsContext } from "./context/chat-window-breakpoints-context";
import { ChatMyDiscussions } from "./chat-my-discussions";
import { ChatRoomsLists } from "./chat-rooms";
import { ChatMyProfileWithSettings } from "./chat-profile";
import { IconButton } from "../general/button";

const PANEL_RIGHT_MIN_WIDTH = 52;
const PANEL_LEFT_MIN_WIDTH = 85;

const PANEL_GUTTER = 2;

const PANEL_LEFT_MAX_WIDTH = 180;
const PANEL_RIGHT_MAX_WIDTH = 180;

/**
 * ChatMainProps
 */
interface ChatMainProps {}

/**
 * ChatMain
 * @param props props
 */
function ChatMain(props: ChatMainProps) {
  const { toggleLeftPanel, toggleRightPanel, panelLeftOpen, panelRightOpen } =
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

    if (panelLeftOpen) {
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
  }, [animationControlsLeftPanel, panelLeftOpen]);

  React.useEffect(() => {
    if (!initialized.current) {
      return;
    }

    if (panelRightOpen) {
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
  }, [animationControlsRightPanel, panelRightOpen]);

  // Set resize observer to panel refs and update mainWrapperRef margin left and right
  React.useEffect(() => {
    if (roomPanelRef.current) {
      const resizeRoomsObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Update mainWrapperRef margin left to roomPanelRef width
          // if peoplePanelRef width is changed and window current width is not mobile
          if (entry.target === roomPanelRef.current && !isMobile) {
            animationControls.set({
              marginLeft: entry.target.clientWidth + PANEL_GUTTER,
            });
          }
        }
      });

      const resizePeopleObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          // Update mainWrapperRef margin right to peoplePanelRef width
          // if peoplePanelRef width is changed and window current width is not mobile
          if (entry.target === peoplePanelRef.current && !isMobile) {
            animationControls.set({
              marginRight: entry.target.clientWidth + PANEL_GUTTER,
            });
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
        marginLeft: PANEL_LEFT_MIN_WIDTH + PANEL_GUTTER,
        marginRight: PANEL_RIGHT_MIN_WIDTH + PANEL_GUTTER,
        transition: {
          duration: 0.1,
          type: "tween",
        },
      });
    } else {
      if (roomPanelRef.current && peoplePanelRef.current) {
        animationControls.start({
          marginLeft: roomPanelRef.current.clientWidth + PANEL_GUTTER,
          marginRight: peoplePanelRef.current.clientWidth + PANEL_GUTTER,
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
    <>
      <motion.div
        ref={roomPanelRef}
        initial={false}
        animate={animationControlsLeftPanel}
        className={`chat__rooms-panel ${
          panelLeftOpen ? "chat__rooms-panel--open" : ""
        }`}
        style={{
          width: PANEL_LEFT_MIN_WIDTH,
        }}
      >
        <div
          onClick={() => toggleLeftPanel()}
          className="chat__button-wrapper chat__button-wrapper--rooms"
        >
          {panelLeftOpen ? (
            <IconButton buttonModifiers={["chat"]} icon="arrow-left" />
          ) : (
            <IconButton buttonModifiers={["chat"]} icon="arrow-right" />
          )}
        </div>
        <div className="chat__rooms-container">
          <OverviewButton />
          <ChatRoomsLists minimized={!panelLeftOpen} />
        </div>
      </motion.div>
      <motion.div
        ref={mainWrapperRef}
        initial={false}
        animate={animationControls}
        className="chat__discussions-panel"
        style={{
          marginLeft: PANEL_LEFT_MIN_WIDTH + PANEL_GUTTER,
          marginRight: PANEL_RIGHT_MIN_WIDTH + PANEL_GUTTER,
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
        className={`chat__users-panel ${
          panelRightOpen ? "chat__users-panel--open" : ""
        }`}
        style={{
          width: PANEL_RIGHT_MIN_WIDTH,
        }}
      >
        <div
          onClick={() => toggleRightPanel()}
          className="chat__button-wrapper chat__button-wrapper--users"
        >
          {panelRightOpen ? (
            <IconButton buttonModifiers={["chat"]} icon="arrow-right" />
          ) : (
            <IconButton buttonModifiers={["chat"]} icon="arrow-left" />
          )}
        </div>

        <ChatMyDiscussions />
        <ChatMyProfileWithSettings />
      </motion.div>
    </>
  );
}

/**
 * OverviewButton
 */
function OverviewButton() {
  const { openOverview } = useChatContext();

  return (
    <motion.div onClick={openOverview} className="chat__options-container">
      <div className="chat__options">
        <motion.div className="chat__option">
          <div className="chat__option-name-container">
            <div className="chat__option-name">Dashboard</div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default ChatMain;
