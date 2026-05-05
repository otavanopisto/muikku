import React, { useCallback, useMemo } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { useImageResize } from "./UseImageResize";

/**
 * The function to get the rendered image size.
 * @param root - The root element.
 * @returns The rendered image size.
 */
const getRenderedImgSize = (root: HTMLElement | null) => {
  const img = root?.querySelector("img");
  const rect = img?.getBoundingClientRect();
  return {
    width: rect?.width ? Math.round(rect.width) : 0,
    height: rect?.height ? Math.round(rect.height) : 0,
  };
};

/**
 * The props for the Muikku image view component.
 */
interface MuikkuImageViewProps extends ReactNodeViewProps {}

/**
 * The Muikku image view component.
 * @param props - The props for the Muikku image view component.
 * @returns The Muikku image view component.
 */
export function MuikkuImageView(props: MuikkuImageViewProps) {
  const { editor, node, getPos, selected } = props;
  const attrs = node.attrs ?? {};

  const { onPointerDown, onPointerMove, onPointerUp } = useImageResize({
    onSizeChange: ({ width, height }) => {
      props.updateAttributes({ width, height });
    },
    minWidth: 80,
    maxWidth: 1200,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // left-click only
      if (e.button !== 0) return;

      // prevent ProseMirror from moving text selection first
      e.preventDefault();
      e.stopPropagation();

      const pos = getPos();
      const { state, view } = editor;

      const tr = state.tr.setSelection(
        NodeSelection.create(state.doc, pos ?? 0)
      );
      view.dispatch(tr);

      // keep focus in the editor
      view.focus();
    },
    [editor, getPos]
  );

  const wrapperStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "relative",
      zIndex: attrs.align ? 2 : 0,
      display: "inline-block",
      cursor: "pointer",
      // Float can live here (wrapper), not on the <img>
      ...(attrs.align === "left" ? { float: "left", marginRight: "1rem" } : {}),
      ...(attrs.align === "right"
        ? { float: "right", marginLeft: "1rem" }
        : {}),
    }),
    [attrs.align]
  );

  const widthAttr = Number.isFinite(Number(attrs.width))
    ? Number(attrs.width)
    : undefined;
  const heightAttr = Number.isFinite(Number(attrs.height))
    ? Number(attrs.height)
    : undefined;
  const hasExplicitSize = typeof widthAttr === "number" && widthAttr > 0;

  return (
    <NodeViewWrapper
      as="span"
      data-type="muikku-image"
      data-selected={selected ? "true" : "false"}
      onMouseDown={handleMouseDown}
      // Optional: make wrapper match CKEditor widget behavior
      contentEditable={false}
      style={wrapperStyle}
    >
      <img
        src={typeof attrs.src === "string" ? attrs.src : ""}
        alt={typeof attrs.alt === "string" ? attrs.alt : ""}
        title={typeof attrs.title === "string" ? attrs.title : ""}
        width={hasExplicitSize ? widthAttr : undefined}
        height={hasExplicitSize ? heightAttr : undefined}
        draggable={false}
        style={
          hasExplicitSize
            ? { display: "block", maxWidth: "100%", height: "auto" }
            : { display: "block", width: "100%", height: "auto" }
        }
      />
      <span data-image-resize-overlay contentEditable={false}>
        <span
          data-image-resize-handle="left"
          onPointerDown={(e) => {
            const root = e.currentTarget.closest<HTMLElement>(
              'span[data-type="muikku-image"]'
            );
            onPointerDown(e, "left", getRenderedImgSize(root));
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
        <span
          data-image-resize-handle="right"
          onPointerDown={(e) => {
            const root = e.currentTarget.closest<HTMLElement>(
              'span[data-type="muikku-image"]'
            );
            onPointerDown(e, "right", getRenderedImgSize(root));
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      </span>
    </NodeViewWrapper>
  );
}
