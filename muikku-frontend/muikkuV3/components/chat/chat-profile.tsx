import * as React from "react";
import { useTranslation } from "react-i18next";
import { ChatActivity, ChatUser } from "~/generated/client";
import { IconButton } from "../general/button";
import ChatProfileAvatar from "./chat-profile-avatar";
import ChatUnreadMsgCounter from "./chat-unread-msg-counter";
import { useChatContext } from "./context/chat-context";
import ChatUserSettingsDialog from "./dialogs/chat-user-settings-dialog";
import Dropdown from "~/components/general/dropdown";

/**
 * ChatMeProps
 */
interface ChatProfileProps {
  user: ChatUser;
  primaryInfo: string;
  secondaryInfo?: string;
  chatActivity?: ChatActivity;
}

/**
 * ChatProfile
 * @param props props
 */
function ChatProfile(props: ChatProfileProps) {
  const { user, primaryInfo, secondaryInfo, chatActivity } = props;

  return (
    <div className="chat__profile-container">
      <ChatProfileAvatar
        id={user.id}
        nick={user.nick}
        hasImage={user.hasImage}
        status={user.presence === "ONLINE" ? "online" : "offline"}
        userType={user.type}
      />
      {chatActivity && (
        <ChatUnreadMsgCounter number={chatActivity.unreadMessages} />
      )}
      <div className="chat__profile-info-container">
        <div className="chat__profile-info-primary">{primaryInfo}</div>
        {secondaryInfo && (
          <div className="chat__profile-info-secondary">{secondaryInfo}</div>
        )}
      </div>
    </div>
  );
}

/**
 * ChatProfileWithSettingsProps
 */
interface ChatProfileWithSettingsProps {}

/**
 * ChatMyProfileWithSettings
 * @param props props
 */
function ChatMyProfileWithSettings(props: ChatProfileWithSettingsProps) {
  const { currentUser } = useChatContext();

  const { t } = useTranslation(["chat", "common"]);

  if (!currentUser) {
    return null;
  }

  return (
    <div className="chat__profile-container chat__profile-container--my-profile">
      <ChatProfileAvatar
        id={currentUser.id}
        nick={currentUser.nick}
        hasImage={currentUser.hasImage}
        status="online"
      />
      <div className="chat__profile-info-container">
        <div className="chat__profile-info-primary">{currentUser.nick}</div>
        <div className="chat__profile-info-secondary">
          {t("status.online", { ns: "chat" })}
        </div>
      </div>
      <div className="chat__button-wrapper">
        <ChatUserSettingsDialog>
          <Dropdown
            alignSelfVertically="top"
            openByHover
            content={<p>{t("actions.chatSettings", { ns: "chat" })}</p>}
          >
            <IconButton buttonModifiers={["chat"]} icon="cog" />
          </Dropdown>
        </ChatUserSettingsDialog>
      </div>
    </div>
  );
}

export { ChatProfile, ChatMyProfileWithSettings };
