"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

/**
 * The Muikku math exercise field placeholder component.
 * @param props - The props for the Muikku math exercise field placeholder component.
 * @returns The Muikku math exercise field placeholder component.
 */
export function MuikkuMathFieldPlaceholder(props: ReactNodeViewProps) {
  const { editor, getPos } = props;
  const pos = getPos?.();

  const select = () => {
    if (typeof pos === "number") editor.commands.setNodeSelection(pos);
  };

  return (
    <NodeViewWrapper
      as="span"
      data-muikku-mathexercisefield-placeholder="true"
      tabIndex={0}
      onClick={select}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          select();
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
      title="Matematiikkatehtäväkenttä"
    >
      <span style={{ whiteSpace: "nowrap" }}>Matematiikkatehtäväkenttä</span>
    </NodeViewWrapper>
  );
}

export default MuikkuMathFieldPlaceholder;
