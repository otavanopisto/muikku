import React, { useCallback, useMemo } from "react";
import { NodeSelection } from "@tiptap/pm/state";
import {
  NodeViewContent,
  NodeViewWrapper,
  type ReactNodeViewProps,
} from "@tiptap/react";
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
 * The props for the Muikku image figure view component.
 */
interface MuikkuImageFigureViewProps extends ReactNodeViewProps {}

type Align = "left" | "center" | "right" | null;

/**
 * The style for the Muikku image figure view component.
 * @param align - The align of the image figure.
 * @returns The style for the Muikku image figure view component.
 */
function wrapperStyleForAlign(align: Align): React.CSSProperties {
  if (align === "left") {
    return { float: "left", margin: "0.25rem 1rem 0.5rem 0" };
  }
  if (align === "right") {
    return { float: "right", margin: "0.25rem 0 0.5rem 1rem" };
  }
  if (align === "center") {
    return {
      float: "none",
      display: "block",
      marginLeft: "auto",
      marginRight: "auto",
    };
  }
  return {};
}

/**
 * The Muikku image figure view component.
 * @param props - The props for the Muikku image figure view component.
 * @returns The Muikku image figure view component.
 */
export function MuikkuImageFigureView(props: MuikkuImageFigureViewProps) {
  const { editor, node, getPos, selected } = props;
  const attrs = node.attrs ?? {};
  const align = (attrs.align ?? null) as Align;

  const { onPointerDown, onPointerMove, onPointerUp } = useImageResize({
    onSizeChange: ({ width, height }) => {
      props.updateAttributes({ width, height });
    },
    minWidth: 80,
    maxWidth: 1200,
  });

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;

      const target = e.target as HTMLElement | null;

      // Don't hijack caption editing
      if (target?.closest?.("figcaption")) return;

      // Don't hijack resize handles (add this attribute to handles later)
      if (target?.closest?.("[data-image-resize-handle]")) return;

      e.preventDefault();
      e.stopPropagation();

      const pos = getPos();
      const { state, view } = editor;
      view.dispatch(
        state.tr.setSelection(NodeSelection.create(state.doc, pos ?? 0))
      );
      view.focus();
    },
    [editor, getPos]
  );

  const figureStyle = useMemo<React.CSSProperties>(
    () => ({
      position: "relative",
      cursor: "pointer",
      zIndex: align ? 2 : 0, // keeps it clickable over wrapping text when floated
      ...wrapperStyleForAlign(align),
    }),
    [align]
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
      as="figure"
      className={typeof attrs.class === "string" ? attrs.class : "image"}
      data-type="muikku-image-figure"
      data-selected={selected ? "true" : "false"}
      onMouseDown={handleMouseDown}
      style={figureStyle}
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
            ? { display: "block", height: "auto" }
            : { display: "block", width: "100%", height: "auto" }
        }
        // If you want data-* visible in DOM for debugging, you can spread them here,
        // but it's not required for ProseMirror state.
      />

      <span data-image-resize-overlay contentEditable={false}>
        <span
          data-image-resize-handle="left"
          onPointerDown={(e) => {
            const root = e.currentTarget.closest<HTMLElement>(
              'figure[data-type="muikku-image-figure"]'
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
              'figure[data-type="muikku-image-figure"]'
            );
            onPointerDown(e, "right", getRenderedImgSize(root));
          }}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
        />
      </span>

      <figcaption>
        <NodeViewContent />
      </figcaption>

      {/* Later: resize handles overlay, contentEditable={false} */}
    </NodeViewWrapper>
  );
}
