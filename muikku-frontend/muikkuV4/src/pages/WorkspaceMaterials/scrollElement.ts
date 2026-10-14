/**
 * Nearest ancestor that actually scrolls (the layout main pane).
 */
function getScrollParent(el: HTMLElement): HTMLElement {
  let parent = el.parentElement;
  while (parent) {
    const { overflowY } = getComputedStyle(parent);
    if (overflowY === "auto" || overflowY === "scroll") {
      return parent;
    }
    parent = parent.parentElement;
  }
  return document.documentElement;
}

/**
 * scrollTop that puts `el` at the top of `container`, honoring scroll-margin.
 */
function targetScrollTop(el: HTMLElement, container: HTMLElement): number {
  const elRect = el.getBoundingClientRect();
  const cRect = container.getBoundingClientRect();
  const margin = Number.parseFloat(getComputedStyle(el).scrollMarginTop) || 0;
  return container.scrollTop + (elRect.top - cRect.top) - margin;
}

/**
 * Native scrollTo on the main pane.
 * @param el - Page (or section title) to land on
 */
export function scrollToElement(el: HTMLElement): void {
  const container = getScrollParent(el);
  container.scrollTo({
    top: targetScrollTop(el, container),
    behavior: "smooth",
  });
}
