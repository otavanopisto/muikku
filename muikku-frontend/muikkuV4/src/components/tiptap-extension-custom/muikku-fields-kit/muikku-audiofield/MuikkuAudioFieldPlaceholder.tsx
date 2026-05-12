"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

/**
 * The Muikku audio field placeholder component.
 * @param props - The props for the Muikku audio field placeholder component.
 * @returns The Muikku audio field placeholder component.
 */
export function MuikkuAudioFieldPlaceholder(props: ReactNodeViewProps) {
  const { editor, getPos } = props;
  const pos = getPos?.();

  /**
   * The select function.
   */
  const select = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
  };

  /**
   * The handleSelectClick function.
   */
  const handleSelectClick = () => {
    select();
  };

  /**
   * The handleSelectKeyDown function.
   * @param e - The keyboard event.
   */
  const handleSelectKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      select();
    }
  };

  return (
    <NodeViewWrapper
      as="span"
      data-muikku-audiofield-placeholder="true"
      tabIndex={0}
      onClick={handleSelectClick}
      onKeyDown={handleSelectKeyDown}
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
      title="Äänikenttä"
    >
      <span style={{ whiteSpace: "nowrap" }}>Äänikenttä</span>
    </NodeViewWrapper>
  );
}
