"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import type { MuikkuSorterFieldContent } from "./MuikkuSorterFieldExtension";

const OPEN_EVENT = "muikku:open-muikku-sorterfield-modal";

/**
 * Summary of the Muikku sorter field content.
 * @param content - The content of the Muikku sorter field.
 * @returns The summary of the Muikku sorter field content.
 */
function summary(content: MuikkuSorterFieldContent | null): string {
  const count = Array.isArray(content?.items) ? content.items.length : 0;
  const orient = content?.orientation === "horizontal" ? "vaaka" : "pysty";
  const cap = content?.capitalize ? "• eka isolla" : "";
  return count
    ? `Järjestelykenttä • ${orient} • ${count} termiä ${cap}`.trim()
    : "Järjestelykenttä";
}

/**
 * The Muikku sorter field placeholder component.
 * @param props - The props for the Muikku sorter field placeholder component.
 * @returns The Muikku sorter field placeholder component.
 */
export function MuikkuSorterFieldPlaceholder(props: ReactNodeViewProps) {
  const { node, editor, getPos } = props;
  const pos = getPos?.();

  const content = (node.attrs?.content ??
    null) as MuikkuSorterFieldContent | null;

  const open = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return (
    <NodeViewWrapper
      as="span"
      data-muikku-sorterfield-placeholder="true"
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

export default MuikkuSorterFieldPlaceholder;
