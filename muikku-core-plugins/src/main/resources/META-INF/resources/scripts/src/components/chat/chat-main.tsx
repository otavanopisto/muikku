/* eslint-disable camelcase */
import { AnimatePresence } from "framer-motion";
import * as React from "react";
import ChatViews from "./animated-views";
import { useChatContext } from "./context/chat-context";
import { useChatWindowBreakpointsContext } from "./context/chat-window-breakpoints-context";
import { ChatMyDiscussions } from "./chat-my-discussions";
import { ChatRoomsLists } from "./chat-rooms";
import { ChatMyProfileWithSettings } from "./chat-profile";
import { IconButton } from "../general/button";

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

  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    if (!isInitialized.current) return;

    if (isMobile) {
      toggleLeftPanel(false);
      toggleRightPanel(false);
    }
  }, [isMobile, toggleLeftPanel, toggleRightPanel]);

  React.useEffect(() => {
    isInitialized.current = true;
  }, []);

  let mainPanelClassModifiers = [];

  panelLeftOpen && mainPanelClassModifiers.push("left-panel-open");
  panelRightOpen && mainPanelClassModifiers.push("right-panel-open");

  let roomPanelClassModifiers = panelLeftOpen ? ["open"] : [];
  let userPanelClassModifiers = panelRightOpen ? ["open"] : [];

  roomPanelClassModifiers =
    isMobile && panelLeftOpen
      ? ["open-as-floating"]
      : [...roomPanelClassModifiers];
  userPanelClassModifiers =
    isMobile && panelRightOpen
      ? ["open-as-floating"]
      : [...userPanelClassModifiers];

  const panelLeftArrow = panelLeftOpen ? "arrow-left" : "arrow-right";
  const panelRightArrow = panelRightOpen ? "arrow-right" : "arrow-left";

  if (isMobile) {
    mainPanelClassModifiers = [];
  }

  return (
    <>
      <div
        className={`chat__rooms-panel ${(roomPanelClassModifiers || [])
          .map((m) => `chat__rooms-panel--${m}`)
          .join(" ")}`}
      >
        <div
          onClick={() => toggleLeftPanel()}
          className="chat__button-wrapper chat__button-wrapper--rooms"
        >
          <IconButton buttonModifiers={["chat"]} icon={panelLeftArrow} />
        </div>
        <div className="chat__rooms-container">
          <OverviewButton />
          <ChatRoomsLists />
        </div>
      </div>
      <div
        className={`chat__main-panel ${(mainPanelClassModifiers || [])
          .map((m) => `chat__main-panel--${m}`)
          .join(" ")}`}
      >
        <ChatViews
          wrapper={<AnimatePresence initial={false} exitBeforeEnter />}
        />
      </div>
      <div
        className={`chat__users-panel ${(userPanelClassModifiers || [])
          .map((m) => `chat__users-panel--${m}`)
          .join(" ")}`}
      >
        <div
          onClick={() => toggleRightPanel()}
          className="chat__button-wrapper chat__button-wrapper--users"
        >
          <IconButton buttonModifiers={["chat"]} icon={panelRightArrow} />
        </div>

        <ChatMyDiscussions />
        <ChatMyProfileWithSettings />
      </div>
    </>
  );
}

/**
 * OverviewButton
 */
export function OverviewButton() {
  const { openOverview, chatViews } = useChatContext();

  const isActive =
    chatViews.views[chatViews.currentViewIndex].identifier === "overview";

  let className = "chat__option";

  if (isActive) {
    className += ` chat__active-item`;
  }

  return (
    <div className="chat__options-container">
      <div className="chat__options">
        <div className={className}>
          <div className="chat__option-name-container">
            <div className="chat__option-name" onClick={openOverview}>
              Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMain;
