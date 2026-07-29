// Communicator view types
export type CommunicatorView = "list" | "thread" | "tags";

// State of a single action button
export type ActionState = "hidden" | "disabled" | "enabled";

export type ActionName =
  | "newMessage"
  | "addTag"
  | "editTags"
  | "delete"
  | "reply"
  | "toggleRead";

/**
 * Context that the resolver reads — all pure data, no hooks
 */
export interface CommunicatorActionContext {
  view: CommunicatorView;
  tab: string; // "Inbox" | "Unread" | "Sent" | "Trash"
  selectedCount: number; // list selection; 0 on thread/tags
  isThreadRead: boolean; // thread view only; false otherwise
}

/**
 * What the ActionBar receives per button
 */
export interface ResolvedAction {
  id: ActionName;
  label: string;
  state: ActionState;
  variant?: "primary" | "danger";
}

/**
 * Pure resolver — no side effects, easy to unit-test.
 * Returns actions in display order.
 */
export function resolveCommunicatorActions(
  ctx: CommunicatorActionContext
): ResolvedAction[] {
  const { view, tab, selectedCount, isThreadRead } = ctx;

  const canBatchToggle =
    view === "list" && (tab === "Inbox" || tab === "Unread");

  const listToggleLabel =
    tab === "Unread" ? "Merkitse luetuksi" : "Merkitse lukemattomaksi";

  return [
    {
      id: "newMessage",
      label: "Uusi viesti",
      variant: "primary",
      state: view === "tags" ? "hidden" : "enabled",
    },
    {
      id: "addTag",
      label: "Lisää tunniste",
      state:
        view !== "list" ? "hidden" : selectedCount > 0 ? "enabled" : "disabled",
    },
    {
      id: "editTags",
      label: "Liitä tunnisteita",
      state: view !== "thread" ? "hidden" : "enabled",
    },
    {
      id: "delete",
      label: tab === "Trash" ? "Poista pysyvästi" : "Poista",
      variant: "danger",
      state:
        view === "tags"
          ? "hidden"
          : view === "thread"
          ? "enabled"
          : selectedCount > 0
          ? "enabled"
          : "disabled",
    },
    {
      id: "reply",
      label: "Vastaa viestiin",
      state: view !== "thread" ? "hidden" : "enabled",
    },

    // Batch toggle read/unread on list (Inbox/Unread) OR mark unread on thread
    {
      id: "toggleRead",
      label: canBatchToggle ? listToggleLabel : "Merkitse lukemattomaksi",
      state:
        view === "list"
          ? canBatchToggle
            ? selectedCount > 0
              ? "enabled"
              : "disabled"
            : "hidden"
          : view === "thread"
          ? isThreadRead
            ? "enabled"
            : "disabled"
          : "hidden",
    },
  ].filter((a) => a.state !== "hidden") as ResolvedAction[];
}
