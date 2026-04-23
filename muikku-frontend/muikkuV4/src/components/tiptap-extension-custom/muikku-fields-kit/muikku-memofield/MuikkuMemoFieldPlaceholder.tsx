"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import type { MuikkuMemoFieldContent } from "./MuikkuMemoFieldExtension";

const OPEN_EVENT = "muikku:open-muikku-memofield-modal";

/**
 * Summary of the Muikku memo field content.
 * @param content - The content of the Muikku memo field.
 * @returns The summary of the Muikku memo field content.
 */
function summary(content: MuikkuMemoFieldContent | null): string {
  if (!content) return "Muistiokenttä";

  const rows = (content.rows ?? "").trim();
  const maxWords = (content.maxWords ?? "").trim();
  const maxChars = (content.maxChars ?? "").trim();
  const richedit = !!content.richedit;

  const parts = ["Muistiokenttä"];
  if (rows) parts.push(`rivejä: ${rows}`);
  if (maxWords) parts.push(`sanaraja: ${maxWords}`);
  if (maxChars) parts.push(`merkkiraja: ${maxChars}`);
  if (richedit) parts.push("tekstieditori");
  return parts.join(" • ");
}

/**
 * The Muikku memo field placeholder component.
 * @param props - The props for the Muikku memo field placeholder component.
 * @returns The Muikku memo field placeholder component.
 */
export function MuikkuMemoFieldPlaceholder(props: ReactNodeViewProps) {
  const { node, editor, getPos } = props;
  const pos = getPos?.();

  const content = (node.attrs?.content ??
    null) as MuikkuMemoFieldContent | null;

  const open = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return (
    <NodeViewWrapper
      as="div"
      data-muikku-memofield-placeholder="true"
      tabIndex={0}
      onClick={open}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      style={{
        display: "block",
        width: "100%",
        padding: "12px 14px",
        borderRadius: 6,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "rgba(30, 144, 255, 0.08)",
        cursor: "pointer",
        userSelect: "none",
      }}
    >
      <div style={{ fontWeight: 600, marginBottom: 6 }}>Muistiokenttä</div>
      <div style={{ opacity: 0.85 }}>{summary(content)}</div>
    </NodeViewWrapper>
  );
}

export default MuikkuMemoFieldPlaceholder;
