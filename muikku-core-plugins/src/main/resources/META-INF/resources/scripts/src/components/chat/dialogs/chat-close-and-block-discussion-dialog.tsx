import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";
import ChatDialog from "./chat-dialog";
import { useTranslation } from "react-i18next";

/**
 * ChatDeleteRoomDialog
 */
function ChatCloseAndBlockDiscussionDialog() {
  const {
    closeAndBlockDiscussionWithUser,
    userToBeBlocked,
    closeBlockUserDialog,
  } = useChatContext();

  const [disabled, setDisabled] = React.useState<boolean>(false);

  const { t } = useTranslation(["chat", "common"]);

  /**
   * Handles block user click
   * @param closeDialog closeDialog
   */
  const handleBlockUserClick =
    (closeDialog: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);
      await closeAndBlockDiscussionWithUser(userToBeBlocked);
      setDisabled(false);
      closeDialog();
    };

  /**
   * Handles dialog close with delay
   */
  const handleDialogClose = () => {
    setTimeout(() => {
      closeBlockUserDialog();
    }, 200);
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => {
    if (!userToBeBlocked) {
      return null;
    }

    return (
      <div>
        <DialogRow>
          <div
            dangerouslySetInnerHTML={{
              __html: t("content.blockUserMsg", {
                name: userToBeBlocked.nick,
                ns: "chat",
              }),
            }}
          />
        </DialogRow>
      </div>
    );
  };

  /**
   * footer
   * @param closeDialog closeDialog
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["standard-ok", "fatal"]}
        onClick={handleBlockUserClick(closeDialog)}
        disabled={disabled}
      >
        {t("actions.blockUser", { ns: "chat" })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
        disabled={disabled}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  return (
    <ChatDialog
      isOpen={!!userToBeBlocked}
      onClose={handleDialogClose}
      localElementId="chat__body"
      disableScroll={true}
      title={t("labels.blockingUser", { ns: "chat" })}
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    />
  );
}

export default ChatCloseAndBlockDiscussionDialog;
