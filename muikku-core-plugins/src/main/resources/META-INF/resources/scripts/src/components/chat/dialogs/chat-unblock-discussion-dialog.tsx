import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatUser } from "~/generated/client";
import { useChatContext } from "../context/chat-context";

/**
 * ChatDeleteRoomDialogProps
 */
interface ChatUnblockDiscussionDialogProps {
  /**
   * target user
   */
  user: ChatUser;
  /**
   * Children
   */
  children?: React.ReactElement;
}

/**
 * ChatDeleteRoomDialog
 * @param props props
 */
const ChatUnblockDiscussionDialog = (
  props: ChatUnblockDiscussionDialogProps
) => {
  const { user, children } = props;

  const { unblockDiscussionWithUser } = useChatContext();

  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles close and block user click
   * @param callback callback
   */
  const handleUnblockClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      try {
        setDisabled(true);
        await unblockDiscussionWithUser(user);
        setDisabled(false);
      } catch (err) {
        console.error(err);
      }
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <h3>Keskustelun eston poisto</h3>
      <p>
        Olet poistamassa estoa käyttäjän: <strong>{user.nick}</strong> kanssa.
        Poiston jälkeen käyttäjä voi näkee statuksesi ja hän voi lähettää
        sinulle viestejä.
      </p>
      <button onClick={handleUnblockClick(closeDialog)} disabled={disabled}>
        Poista keskustelu
      </button>
      <button onClick={closeDialog} disabled={disabled}>
        Peruuta
      </button>
    </div>
  );

  return (
    <Dialog
      localElementId="chat__body"
      disableScroll={true}
      title="Keskustelun eston poisto"
      content={content}
      modifier={["wizard", "local"]}
    >
      {children}
    </Dialog>
  );
};

export default ChatUnblockDiscussionDialog;
