import { SelectionContext } from "./types";

const SKIP_SELECTOR = ".rs_skip_always, .rs_skip";
const READ_AREA_SELECTOR = '[id^="p-"], [id^="s-"]';
const CONTENT_CONTAINER_SELECTOR = ".content-panel__main-container";

export type SelectionEligibilityOptions = {
  loggedIn: boolean;
  editMode: boolean;
  rspkrLoaded: boolean;
};

type SelectionPosition = {
  x: number;
  y: number;
};

/**
 * Returns the nearest element from a selection anchor.
 * @param selection selection
 */
function getElementFromSelection(selection: Selection): Element | null {
  const node = selection.anchorNode;
  if (!node) {
    return null;
  }

  return node.nodeType === Node.TEXT_NODE
    ? node.parentElement
    : (node as Element);
}

/**
 * Returns read area id (p-* or s-*) for an element, if any.
 * @param el el
 */
export function getReadAreaId(el: Element | null): string | null {
  if (!el) {
    return null;
  }

  const readArea = el.closest(READ_AREA_SELECTOR);
  return readArea?.id ?? null;
}

/**
 * Whether selection is inside skippable ReadSpeaker content.
 * @param el el
 */
export function isInsideSkippedContent(el: Element | null): boolean {
  return !!el?.closest(SKIP_SELECTOR);
}

/**
 * Whether selection is inside material/help content panel.
 * @param el el
 */
export function isInsideContentPanel(el: Element | null): boolean {
  return !!el?.closest(CONTENT_CONTAINER_SELECTOR);
}

/**
 * Builds selection context used by the popover.
 * @param selection selection
 * @param range range
 * @param mousePosition mouse position at mouseup (viewport coordinates)
 * @param boundary boundary element
 * @param options options
 */
export function buildSelectionContext(
  selection: Selection,
  range: Range,
  mousePosition: SelectionPosition,
  boundary: Element,
  options: SelectionEligibilityOptions
): SelectionContext | null {
  const text = selection.toString().trim();
  if (!text || selection.isCollapsed) {
    return null;
  }

  if (!isRangeFullyInsideBoundary(range, boundary)) {
    return null;
  }

  const el = getElementFromSelection(selection);
  if (!el || !isInsideContentPanel(el)) {
    return null;
  }

  const readAreaId = getReadAreaId(el);
  const skipped = isInsideSkippedContent(el);

  const canUseReadSpeaker =
    options.loggedIn &&
    !options.editMode &&
    options.rspkrLoaded &&
    !!readAreaId &&
    !skipped;

  const isInActionableContent = !!readAreaId && !skipped;

  if (!canUseReadSpeaker && !isInActionableContent) {
    return null;
  }

  const position = resolvePopoverPosition(range, mousePosition, boundary);
  if (!position) {
    return null;
  }
  return {
    text,
    position,
    readAreaId,
    canUseReadSpeaker,
    isInActionableContent,
  };
}

/**
 * Closes native ReadSpeaker selection popup if present.
 */
export function closeNativeReadspeakerPopup(): void {
  const rs = (
    window as Window & { ReadSpeaker?: { Popup?: { closePopup?: () => void } } }
  ).ReadSpeaker;

  rs?.Popup?.closePopup?.();
}

/**
 * Resolves popover anchor: mouse when valid, otherwise selection end.
 * @param range selection range
 * @param mousePosition mouseup coordinates
 * @param boundary boundary element
 */
export function resolvePopoverPosition(
  range: Range,
  mousePosition: SelectionPosition,
  boundary: Element
): SelectionPosition | null {
  if (
    isMousePositionInsideBoundary(mousePosition.x, mousePosition.y, boundary)
  ) {
    return mousePosition;
  }

  const rects = range.getClientRects();
  const rect =
    rects.length > 0 ? rects[rects.length - 1] : range.getBoundingClientRect();

  if (rect.width === 0 && rect.height === 0) {
    return null;
  }

  // Top-left anchor at selection end; popover grows down-right
  return {
    x: rect.right,
    y: rect.bottom,
  };
}

/**
 * Resolves boundary element from selector.
 * @param boundarySelector CSS selector
 */
export function resolveBoundaryElement(
  boundarySelector: string
): Element | null {
  return document.querySelector(boundarySelector);
}

/**
 * Whether entire selection stays inside boundary.
 * @param range range
 * @param boundary boundary element
 */
export function isRangeFullyInsideBoundary(
  range: Range,
  boundary: Element
): boolean {
  /**
   * nodeToElement
   * @param node node
   * @returns element or null
   */
  const nodeToElement = (node: Node): Element | null =>
    node.nodeType === Node.TEXT_NODE ? node.parentElement : (node as Element);

  const startEl = nodeToElement(range.startContainer);
  const endEl = nodeToElement(range.endContainer);

  if (!startEl || !endEl) {
    return false;
  }

  return boundary.contains(startEl) && boundary.contains(endEl);
}

/**
 * Whether coordinates are inside boundary (excluding popover).
 * @param x clientX
 * @param y clientY
 * @param boundary boundary element
 */
export function isMousePositionInsideBoundary(
  x: number,
  y: number,
  boundary: Element
): boolean {
  const el = document.elementFromPoint(x, y);
  return (
    !!el && boundary.contains(el) && !el.closest(".selection-context-popover")
  );
}

/**
 * Finds play button by explicit id, fallback to boundary search.
 * @param readspeakerButtonId button container id
 * @param boundary boundary element
 */
export function findReadspeakerPlayButtonInBoundary(
  readspeakerButtonId: string | undefined,
  boundary: Element
): HTMLElement | null {
  if (readspeakerButtonId) {
    const byId = document.querySelector<HTMLElement>(
      `#${readspeakerButtonId} .rsbtn_play`
    );
    if (byId) {
      return byId;
    }
  }

  return boundary.querySelector<HTMLElement>(".rsbtn_play");
}
