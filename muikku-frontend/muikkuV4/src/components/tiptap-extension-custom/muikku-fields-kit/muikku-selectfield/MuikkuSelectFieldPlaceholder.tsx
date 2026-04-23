"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import type { MuikkuSelectionFieldContent } from "./MuikkuSelectFieldExtension";

const OPEN_EVENT = "muikku:open-muikku-selectionfield-modal";

/**
 * Gets the label from the list type.
 * @param t - The list type.
 * @returns The label.
 */
function labelFromListType(t: string | undefined) {
  switch (t) {
    case "dropdown":
      return "Valintakenttä • alaspudotus";
    case "list":
      return "Valintakenttä • lista";
    case "radio-horizontal":
      return "Valintakenttä • radio (vaaka)";
    case "radio-vertical":
      return "Valintakenttä • radio (pysty)";
    case "checkbox-horizontal":
      return "Valintakenttä • checkbox (vaaka)";
    case "checkbox-vertical":
      return "Valintakenttä • checkbox (pysty)";
    default:
      return "Valintakenttä";
  }
}

/**
 * The Muikku selection field placeholder component.
 * @param props - The props for the Muikku selection field placeholder component.
 * @returns The Muikku selection field placeholder component.
 */
export function MuikkuSelectFieldPlaceholder(props: ReactNodeViewProps) {
  const { node, editor, getPos } = props;
  const pos = getPos?.();

  const content = (node.attrs?.content ??
    null) as MuikkuSelectionFieldContent | null;
  const text = labelFromListType(content?.listType);

  const open = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return (
    <NodeViewWrapper
      as="span"
      tabIndex={0}
      data-muikku-selectionfield-placeholder="true"
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
      title={text}
    >
      <span
        style={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {text}
      </span>
    </NodeViewWrapper>
  );
}

export default MuikkuSelectFieldPlaceholder;
