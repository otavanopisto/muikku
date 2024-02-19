/* eslint-disable camelcase */
import { AnimatePresence } from "framer-motion";
import * as React from "react";
import ChatViews from "./animated-views";
import { useChatContext } from "./context/chat-context";
import { useChatWindowBreakpointsContext } from "./context/chat-window-breakpoints-context";
import { ChatMyProfileWithSettings } from "./chat-profile";
import { IconButton } from "../general/button";
import { useLocalStorage } from "usehooks-ts";
import { PrivateRoomList, PublicRoomsList } from "./chat-rooms";
import {
  ChatMyActiveDiscussions,
  ChatMyCounselorsDiscussions,
} from "./chat-my-discussions";

/**
 * ChatMainProps
 */
interface ChatMainProps {}

/**
 * ChatMain
 * @param props props
 */
function ChatMain(props: ChatMainProps) {
  const { isMobile } = useChatWindowBreakpointsContext();

  const [panelRightOpen, setPanelRightOpen] = useLocalStorage(
    "chat-panel-right",
    true
  );
  const [panelLeftOpen, setPanelLeftOpen] = useLocalStorage(
    "chat-panel-left",
    true
  );

  const isInitialized = React.useRef(false);

  React.useEffect(() => {
    if (!isInitialized.current) return;

    if (isMobile) {
      setPanelRightOpen(false);
      setPanelLeftOpen(false);
    }
  }, [isMobile, setPanelLeftOpen, setPanelRightOpen]);

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
        <div className="chat__button-wrapper chat__button-wrapper--rooms">
          <IconButton
            buttonModifiers={["chat"]}
            icon={panelLeftArrow}
            onClick={() => setPanelLeftOpen(!panelLeftOpen)}
          />
        </div>
        <div className="chat__rooms-container">
          <OverviewButton />
          <div className="chat__rooms chat__rooms--public" role="menu">
            <div className="chat__rooms-category-title">Julkiset huoneet</div>
            <PublicRoomsList />
          </div>

          <div className="chat__rooms chat__rooms--private" role="menu">
            <div className="chat__rooms-category-title">Kurssien huoneet</div>
            <PrivateRoomList />
          </div>
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
        <div className="chat__button-wrapper chat__button-wrapper--users">
          <IconButton
            buttonModifiers={["chat"]}
            icon={panelRightArrow}
            onClick={() => setPanelRightOpen(!panelRightOpen)}
          />
        </div>

        <div className="chat__users-container">
          <ChatMyCounselorsDiscussions />
          <div className="chat__users chat__users--others" role="menu">
            <div className="chat__users-category-title">Keskustelut</div>
            <ChatMyActiveDiscussions />
          </div>
        </div>
        <ChatMyProfileWithSettings />
      </div>
    </>
  );
}

/**
 * OwerviewButtonProps
 */
interface OwerviewButtonProps {
  onClick?: () => void;
}

/**
 * OverviewButton
 * @param props props
 */
export function OverviewButton(props: OwerviewButtonProps) {
  const { onClick } = props;
  const { openOverview, chatViews } = useChatContext();

  /**
   * handleButtonClick
   */
  const handleButtonClick = () => {
    openOverview();
    onClick && onClick();
  };

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
            <div className="chat__option-name" onClick={handleButtonClick}>
              Dashboard
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatMain;
