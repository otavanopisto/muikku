"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

/**
 * The Muikku journal field placeholder component.
 * @param props - The props for the Muikku journal field placeholder component.
 * @returns The Muikku journal field placeholder component.
 */
export function MuikkuJournalFieldPlaceholder(props: ReactNodeViewProps) {
  const { editor, getPos } = props;
  const pos = getPos?.();

  /**
   * The select function.
   */
  const select = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
  };

  /**
   * The handleOpenClick function.
   */
  const handleSelectClick = () => {
    select();
  };

  /**
   * The handleKeyDown function.
   * @param e - The keyboard event.
   */
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select();
    }
  };

  return (
    <NodeViewWrapper
      as="span"
      data-muikku-journalfield-placeholder="true"
      tabIndex={0}
      onClick={handleSelectClick}
      onKeyDown={handleKeyDown}
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
      title="Oppimispäiväkirjakenttä"
    >
      <span style={{ whiteSpace: "nowrap" }}>Oppimispäiväkirjakenttä</span>
    </NodeViewWrapper>
  );
}
