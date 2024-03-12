import { DialogRow } from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { useChatContext } from "../context/chat-context";
import Button from "~/components/general/button";
import ChatDialog from "./chat-dialog";

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

  /**
   * Handles close and block user click
   * @param callback callback
   */
  const handleUnblockClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      setDisabled(true);
      await unblockDiscussionWithUser(userToBeUnblocked);
      setDisabled(false);
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
          Olet poistamassa estoa käyttäjän{" "}
          <strong>{userToBeUnblocked.nick}</strong> kanssa. Poiston jälkeen
          käyttäjä näkee statuksesi ja hän voi lähettää sinulle viestejä.
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
        Poista esto
      </Button>
      <Button
        buttonModifiers={["standard-cancel", "cancel"]}
        onClick={closeDialog}
        disabled={disabled}
      >
        Peruuta
      </Button>
    </div>
  );

  return (
    <ChatDialog
      isOpen={!!userToBeUnblocked}
      onClose={closeCancelUnblockDialog}
      localElementId="chat__body"
      disableScroll={true}
      title="Käyttäjän eston poistaminen"
      content={content}
      footer={footer}
      modifier={["chat", "local"]}
    />
  );
}

export default ChatUnblockDiscussionDialog;
