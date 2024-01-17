import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import { ChatUser } from "~/generated/client";
import { useChatContext } from "../context/chat-context";

/**
 * ChatDeleteRoomDialogProps
 */
interface ChatCloseAndBlockDiscussionDialogProps {
  /**
   * Target user
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
const ChatCloseAndBlockDiscussionDialog = (
  props: ChatCloseAndBlockDiscussionDialogProps
) => {
  const { user, children } = props;

  const { closeAndBlockDiscussionWithUser } = useChatContext();

  const [disabled, setDisabled] = React.useState<boolean>(false);

  /**
   * Handles block user click
   * @param callback callback
   */
  const handleBlockUserClick =
    (callback: () => void) =>
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      try {
        setDisabled(true);
        await closeAndBlockDiscussionWithUser(user);
      } catch (err) {
        setDisabled(false);
        console.error(err);
      }
    };

  /**
   * content
   * @param closeDialog closeDialog
   */
  const content = (closeDialog: () => void) => (
    <div>
      <h3>Käyttäjän esto</h3>
      <p>
        Haluatko varmasti estää käyttäjän: <strong>{user.nick}</strong>. Tämä
        estää käyttäjää lähettämästä sinulle uusia viestejä.
      </p>
      <button onClick={handleBlockUserClick(closeDialog)} disabled={disabled}>
        Estä käyttäjä
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
      title="Käyttäjän estäminen"
      content={content}
      modifier={["wizard", "local"]}
    >
      {children}
    </Dialog>
  );
};

export default ChatCloseAndBlockDiscussionDialog;
