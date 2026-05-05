import { useCallback, useRef } from "react";

type ResizeSide = "left" | "right";

/**
 * The hook for the image resize.
 * @param props - The props for the image resize.
 * @returns The hook for the image resize.
 */
export function useImageResize(props: {
  onSizeChange: (next: { width: number; height: number }) => void;
  minWidth?: number;
  maxWidth?: number;
}) {
  const { onSizeChange, minWidth = 80, maxWidth = 1200 } = props;

  const dragRef = useRef<{
    startX: number;
    startWidth: number;
    ratio: number; // height / width
    side: ResizeSide;
    active: boolean;
  } | null>(null);

  const onPointerDown = useCallback(
    (
      e: React.PointerEvent,
      side: ResizeSide,
      currentSize: { width: number; height: number }
    ) => {
      if (e.button !== 0) return;

      e.preventDefault();
      e.stopPropagation();

      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

      const w = Math.max(1, Math.round(currentSize.width));
      const h = Math.max(1, Math.round(currentSize.height));

      dragRef.current = {
        startX: e.clientX,
        startWidth: w,
        ratio: h / w,
        side,
        active: true,
      };
    },
    []
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      const drag = dragRef.current;
      if (!drag?.active) return;

      e.preventDefault();
      e.stopPropagation();

      const dx = e.clientX - drag.startX;
      const direction = drag.side === "right" ? 1 : -1;

      const nextWidthRaw = Math.round(drag.startWidth + direction * dx);
      const nextWidth = Math.max(minWidth, Math.min(maxWidth, nextWidthRaw));
      const nextHeight = Math.round(nextWidth * drag.ratio);

      onSizeChange({ width: nextWidth, height: nextHeight });
    },
    [maxWidth, minWidth, onSizeChange]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    const drag = dragRef.current;
    if (!drag?.active) return;

    e.preventDefault();
    e.stopPropagation();

    dragRef.current = null;
  }, []);

  return { onPointerDown, onPointerMove, onPointerUp };
}
