"use client";

import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";

const OPEN_EVENT = "muikku:open-iframe-modal";

/**
 * Convert a value to pixels.
 * @param v - The value to convert.
 * @returns The value in pixels.
 */
function toPx(v: unknown): string | undefined {
  if (typeof v === "number") return `${v}px`;
  if (typeof v === "string") {
    const t = v.trim();
    if (!t) return undefined;
    // allow "500", "500px", "50%"
    return /^\d+$/.test(t) ? `${t}px` : t;
  }
  return undefined;
}

/**
 * The IframePlaceholder component.
 * @param props - The props for the IframePlaceholder component.
 * @returns The IframePlaceholder component.
 */
export function IframePlaceholder(props: ReactNodeViewProps) {
  const { node, getPos, editor } = props;

  const pos = getPos?.();

  const width = toPx(node.attrs?.width) ?? "80px";
  const height = toPx(node.attrs?.height) ?? "80px";

  /**
   * Open the iframe modal.
   */
  const open = () => {
    if (typeof pos === "number") {
      editor.commands.setNodeSelection(pos);
    }
    window.dispatchEvent(new CustomEvent(OPEN_EVENT));
  };

  return (
    <NodeViewWrapper
      as="img"
      data-iframe-placeholder="true"
      onClick={open}
      onKeyDown={(e: React.KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          open();
        }
      }}
      tabIndex={0}
      className="iframe-placeholder"
      style={{ width, height, display: "inline-block" }}
    />
  );
}

export default IframePlaceholder;
