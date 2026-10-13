import { useState } from "react";
import { useSearchParams } from "react-router";
import { Text } from "@mantine/core";
import {
  resolveCommunicatorActions,
  type CommunicatorActionContext,
  type CommunicatorActionHandlers,
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

  // Handlers for the actions
  const handlers: CommunicatorActionHandlers = {
    newMessage: () => {
      // eslint-disable-next-line no-console
      console.log("newMessage", { tab, selectedIds });
    },
    addTag: () => {
      // eslint-disable-next-line no-console
      console.log("addTag", { tab, selectedIds });
    },
    delete: () => {
      const isTrash = tab === "Trash";
      // eslint-disable-next-line no-console
      console.log("delete", { isTrash, selectedIds });
    },
    toggleRead: () => {
      const shouldMarkRead = tab === "Unread";
      // eslint-disable-next-line no-console
      console.log("toggleRead", { shouldMarkRead, selectedIds });
    },
  };

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
      <CommunicatorActionBar actions={actions} handlers={handlers} />
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
