import { useState } from "react";
import { useSearchParams } from "react-router";
import { Text } from "@mantine/core";
import {
  resolveCommunicatorActions,
  type ActionName,
  type CommunicatorActionContext,
} from "./actions";
import { CommunicatorActionBar } from "./components/CommunicatorActionBar";

// Mock thread ids for smoke testing
const MOCK_THREAD_IDS = ["thread-1", "thread-2", "thread-3"];

/**
 * List view with selection and resolved ActionBar.
 */
export function CommunicatorThreadList() {
  const [searchParams] = useSearchParams();
  const tab = searchParams.get("tab") ?? "Inbox";
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const ctx: CommunicatorActionContext = {
    view: "list",
    tab,
    selectedCount: selectedIds.length,
    isThreadRead: false,
  };

  const actions = resolveCommunicatorActions(ctx);

  /**
   * Handles the action for the communicator thread list
   * @param actionName - The name of the action
   */
  function handleAction(actionName: ActionName) {
    switch (actionName) {
      case "newMessage": {
        // open compose UI
        // eslint-disable-next-line no-console
        console.log("newMessage", { tab, selectedIds });
        return;
      }
      case "addTag": {
        // bulk add tags for selectedIds
        // eslint-disable-next-line no-console
        console.log("addTag", { tab, selectedIds });
        return;
      }
      case "editTags": {
        // resolver hides this on list, so usually unreachable
        return;
      }
      case "delete": {
        // if tab === "Trash" => permanent delete, else soft delete/move to Trash
        const isTrash = tab === "Trash";
        // eslint-disable-next-line no-console
        console.log("delete", { isTrash, selectedIds });
        return;
      }
      case "reply": {
        // resolver hides this on list
        return;
      }
      case "toggleRead": {
        // On list: only Inbox/Unread is enabled by resolver
        // If tab === "Unread" => mark as read, else mark as unread
        const shouldMarkRead = tab === "Unread";
        // eslint-disable-next-line no-console
        console.log("toggleRead", { shouldMarkRead, selectedIds });
        return;
      }
      default:
        return;
    }
  }

  /**
   * Toggles the selection of a thread
   * @param threadId - The id of the thread
   */
  function toggleSelect(threadId: string) {
    setSelectedIds((prev) =>
      prev.includes(threadId)
        ? prev.filter((id) => id !== threadId)
        : [...prev, threadId]
    );
  }

  return (
    <>
      <CommunicatorActionBar actions={actions} onAction={handleAction} />
      <Text size="sm" c="dimmed" mb="sm">
        Tab: {tab} — selected: {selectedIds.length}
      </Text>
      {MOCK_THREAD_IDS.map((id) => (
        <Text
          key={id}
          style={{
            cursor: "pointer",
            fontWeight: selectedIds.includes(id) ? "bold" : "normal",
          }}
          onClick={() => toggleSelect(id)}
        >
          {selectedIds.includes(id) ? "☑" : "☐"} {id}
        </Text>
      ))}
    </>
  );
}
