import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";
import ChatDialog from "./chat-dialog";
import { useTranslation } from "react-i18next";

/**
 * ChatUnblockDiscussionDialog
 */
function ChatUnblockDiscussionDialog() {
  const {
    unblockDiscussionWithUser,
    userToBeUnblocked,
    closeCancelUnblockDialog,
  } = useChatContext();

  const [disabled, setDisabled] = React.useState<boolean>(false);

  const { t } = useTranslation(["chat", "common"]);

  /**
   * Handles close and block user click
   * @param closeDialog closeDialog
   */
  const handleUnblockClick =
    (closeDialog: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);
      await unblockDiscussionWithUser(userToBeUnblocked);
      setDisabled(false);
      closeDialog();
    };

  /**
   * Handles dialog close with delay
   */
  const handleDialogClose = () => {
    setTimeout(() => {
      closeCancelUnblockDialog();
    }, 200);
  };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => {
    if (!userToBeUnblocked) {
      return null;
    }

    return (
      <div>
        <DialogRow>
          <div
            dangerouslySetInnerHTML={{
              __html: t("content.unblockUserMsg", {
                name: userToBeUnblocked.nick,
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
        onClick={handleUnblockClick(closeDialog)}
        disabled={disabled}
      >
        {t("actions.unBlockUser", { ns: "chat" })}
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
        disabled={disabled}
      >
        {t("actions.cancel", { ns: "common" })}
      </Button>
    </div>
  );

  return (
    <ChatDialog
      isOpen={!!userToBeUnblocked}
      onClose={handleDialogClose}
      localElementId="chat__body"
      disableScroll={true}
      title={t("labels.unblockUser", { ns: "chat" })}
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    />
  );
}

export default ChatUnblockDiscussionDialog;
