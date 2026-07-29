import { Text } from "@mantine/core";
import { useParams } from "react-router";
import { useSearchParams } from "react-router";
import {
  resolveCommunicatorActions,
  type CommunicatorActionContext,
  type CommunicatorActionHandlers,
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

  // Handlers for the actions
  const handlers: CommunicatorActionHandlers = {
    editTags: () => {
      // eslint-disable-next-line no-console
      console.log("editTags", { threadId });
    },
    delete: () => {
      // eslint-disable-next-line no-console
      console.log("delete thread", { threadId });
    },
    reply: () => {
      // eslint-disable-next-line no-console
      console.log("reply", { threadId });
    },
    toggleRead: () => {
      // eslint-disable-next-line no-console
      console.log("mark unread", { threadId });
    },
  };

  return (
    <>
      <CommunicatorActionBar actions={actions} handlers={handlers} />
      <Text>Thread: {threadId}</Text>
    </>
  );
}
