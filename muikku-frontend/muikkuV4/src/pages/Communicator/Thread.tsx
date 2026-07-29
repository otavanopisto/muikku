import { Text } from "@mantine/core";
import { useParams } from "react-router";
import { useSearchParams } from "react-router";
import {
  resolveCommunicatorActions,
  type ActionName,
  type CommunicatorActionContext,
} from "./actions";
import { CommunicatorActionBar } from "./components/CommunicatorActionBar";

/**
 * Thread view with resolved ActionBar.
 * isThreadRead is hardcoded true for smoke testing.
 */
export function CommunicatorThread() {
  const { threadId } = useParams<{ threadId: string }>();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "Inbox";

  const ctx: CommunicatorActionContext = {
    view: "thread",
    tab,
    selectedCount: 0,
    isThreadRead: true, // mock — will come from query later
  };

  const actions = resolveCommunicatorActions(ctx);

  /**
   * Handles the action for the communicator thread
   * @param actionName - The name of the action
   */
  function handleAction(actionName: ActionName) {
    switch (actionName) {
      case "newMessage": {
        // resolver hides this on thread (unless you later change it)
        return;
      }
      case "addTag": {
        // resolver hides this on thread
        return;
      }
      case "editTags": {
        // edit tags for this threadId
        // eslint-disable-next-line no-console
        console.log("editTags", { threadId });
        return;
      }
      case "delete": {
        // delete this thread
        // eslint-disable-next-line no-console
        console.log("delete thread", { threadId });
        return;
      }
      case "reply": {
        // open reply composer for this threadId
        // eslint-disable-next-line no-console
        console.log("reply", { threadId });
        return;
      }
      case "toggleRead": {
        // In your resolver: thread toggleRead label = "Merkitse lukemattomaksi"
        // and it is enabled when isThreadRead === true
        // so this handler should mark it as UNREAD.
        // eslint-disable-next-line no-console
        console.log("mark unread", { threadId });
        return;
      }
      default:
        return;
    }
  }

  return (
    <>
      <CommunicatorActionBar actions={actions} onAction={handleAction} />
      <Text>Thread: {threadId}</Text>
    </>
  );
}
