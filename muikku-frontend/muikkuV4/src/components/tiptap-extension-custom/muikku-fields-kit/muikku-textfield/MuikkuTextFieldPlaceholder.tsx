"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import type { MuikkuTextFieldContent } from "./MuikkuTextFieldExtension";

const OPEN_EVENT = "muikku:open-muikku-textfield-modal";

/**
 * Gets the summary of a Muikku text field.
 * @param content - The content of the Muikku text field.
 * @returns The summary of the Muikku text field.
 */
function getSummary(content: MuikkuTextFieldContent | null): string {
  if (!content) return "Tekstikenttä";
  const hint = (content.hint ?? "").trim();
  const cols = (content.columns ?? "").trim();
  const answers = Array.isArray(content.rightAnswers)
    ? content.rightAnswers.length
    : 0;

  const parts: string[] = ["Tekstikenttä"];
  if (cols) parts.push(`leveys: ${cols}`);
  if (hint) parts.push(`vihje: ${hint}`);
  if (answers) parts.push(`vastauksia: ${answers}`);
  return parts.join(" • ");
}

/**
 * The Muikku text field placeholder component.
 * @param props - The props for the Muikku text field placeholder component.
 * @returns The Muikku text field placeholder component.
 */
export function MuikkuTextFieldPlaceholder(props: ReactNodeViewProps) {
  const { node, getPos, editor } = props;
  const pos = getPos?.();

  const content = (node.attrs?.content ??
    null) as MuikkuTextFieldContent | null;
  const summary = getSummary(content);

  const open = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return (
    <NodeViewWrapper
      as="div"
      data-muikku-textfield-placeholder="true"
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
        alignItems: "center",
        minHeight: 44,
        padding: "8px 12px",
        borderRadius: 6,
        border: "1px solid rgba(0,0,0,0.12)",
        background: "rgba(30, 144, 255, 0.10)",
        color: "inherit",
        cursor: "pointer",
        userSelect: "none",
        maxWidth: "100%",
      }}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {summary}
      </span>
    </NodeViewWrapper>
  );
}

export default MuikkuTextFieldPlaceholder;
