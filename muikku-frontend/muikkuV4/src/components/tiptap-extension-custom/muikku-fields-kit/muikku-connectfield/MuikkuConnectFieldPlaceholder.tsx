"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import type { MuikkuConnectFieldContent } from "./MuikkuConnectFieldExtension";

const OPEN_EVENT = "muikku:open-muikku-connectfield-modal";

/**
 * Summary of the Muikku connect field content.
 * @param content - The content of the Muikku connect field.
 * @returns The summary of the Muikku connect field content.
 */
function summary(content: MuikkuConnectFieldContent | null): string {
  const count = Array.isArray(content?.fields) ? content.fields.length : 0;
  return count ? `Yhdistelykenttä • ${count} vastinparia` : "Yhdistelykenttä";
}

/**
 * The Muikku connect field placeholder component.
 * @param props - The props for the Muikku connect field placeholder component.
 * @returns The Muikku connect field placeholder component.
 */
export function MuikkuConnectFieldPlaceholder(props: ReactNodeViewProps) {
  const { node, editor, getPos } = props;
  const pos = getPos?.();

  const content = (node.attrs?.content ??
    null) as MuikkuConnectFieldContent | null;

  const open = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return (
    <NodeViewWrapper
      as="span"
      data-muikku-connectfield-placeholder="true"
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

export default MuikkuConnectFieldPlaceholder;
