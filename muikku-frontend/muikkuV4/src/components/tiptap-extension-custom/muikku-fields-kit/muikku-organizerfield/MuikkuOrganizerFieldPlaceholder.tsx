"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import type { MuikkuOrganizerFieldContent } from "./MuikkuOrganizerFieldExtension";

const OPEN_EVENT = "muikku:open-muikku-organizerfield-modal";

/**
 * Summary of the Muikku organizer field content.
 * @param content - The content of the Muikku organizer field.
 * @returns The summary of the Muikku organizer field content.
 */
function summary(content: MuikkuOrganizerFieldContent | null): string {
  const termCount = Array.isArray(content?.terms) ? content.terms.length : 0;
  const catCount = Array.isArray(content?.categories)
    ? content.categories.length
    : 0;

  if (!termCount && !catCount) return "Ryhmittelykenttä";
  return `Ryhmittelykenttä • termit: ${termCount} • ryhmät: ${catCount}`;
}

/**
 * The Muikku organizer field placeholder component.
 * @param props - The props for the Muikku organizer field placeholder component.
 * @returns The Muikku organizer field placeholder component.
 */
export function MuikkuOrganizerFieldPlaceholder(props: ReactNodeViewProps) {
  const { node, editor, getPos } = props;
  const pos = getPos?.();

  const content = (node.attrs?.content ??
    null) as MuikkuOrganizerFieldContent | null;

  const open = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return (
    <NodeViewWrapper
      as="span"
      data-muikku-organizerfield-placeholder="true"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      style={{
        display: "inline-flex",
        verticalAlign: "middle",
        alignItems: "center",
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "rgba(30, 144, 255, 0.08)",
        cursor: "pointer",
        userSelect: "none",
        maxWidth: "100%",
      }}
      title={summary(content)}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {summary(content)}
      </span>
    </NodeViewWrapper>
  );
}

export default MuikkuOrganizerFieldPlaceholder;
