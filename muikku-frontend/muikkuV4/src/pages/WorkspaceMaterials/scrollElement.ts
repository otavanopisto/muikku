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

/**
 * Smooth-scroll to `el`, then pin it to the top while the column grows.
 * Stops on user input in the pane, or when `timeoutMs` elapses.
 */
export function scrollToElementWhenSettled(
  getEl: () => HTMLElement | null,
  options?: { timeoutMs?: number }
): () => void {
  const timeoutMs = options?.timeoutMs ?? 8000;
  let cancelled = false;
  let pinning = false;
  let frame = 0;
  let timeoutTimer: number | undefined;
  let scrollEndTimer: number | undefined;
  let observer: ResizeObserver | undefined;
  let container: HTMLElement | undefined;

  /**
   * Pin the element to the top of the container.
   * @param behavior - Scroll behavior
   */
  const pin = (behavior: ScrollBehavior) => {
    const el = getEl();
    if (!el) return;
    const pane = getScrollParent(el);
    pane.scrollTo({
      top: targetScrollTop(el, pane),
      behavior,
    });
  };

  /**
   * Stop the scroll.
   */
  const stop = () => {
    cancelled = true;
    pinning = false;
    cancelAnimationFrame(frame);
    window.clearTimeout(timeoutTimer);
    window.clearTimeout(scrollEndTimer);
    observer?.disconnect();
    container?.removeEventListener("wheel", stop);
    container?.removeEventListener("touchstart", stop);
    container?.removeEventListener("pointerdown", stop);
    container?.removeEventListener("scrollend", beginPinning);
  };

  /**
   * Begin pinning the element to the top of the container.
   */
  const beginPinning = () => {
    if (cancelled) return;
    pinning = true;
  };

  /**
   * Start the scroll.
   */
  const start = () => {
    if (cancelled) return;
    const el = getEl();
    if (!el) {
      frame = requestAnimationFrame(start);
      return;
    }
    container = getScrollParent(el);
    const content = container.firstElementChild;
    observer = new ResizeObserver(() => {
      if (!pinning || cancelled) return;
      pin("auto");
    });
    observer.observe(el);
    if (content instanceof HTMLElement) {
      observer.observe(content);
    }
    const from = container.scrollTop;
    const to = targetScrollTop(el, container);
    if (Math.abs(from - to) < 1) {
      beginPinning();
    } else {
      pin("smooth");
      // Don't auto-pin during the animation (that would cancel it).
      container.addEventListener("scrollend", beginPinning, { once: true });
      scrollEndTimer = window.setTimeout(beginPinning, 500);
    }
    const inputOpts: AddEventListenerOptions = {
      capture: true,
      passive: true,
    };
    container.addEventListener("wheel", stop, inputOpts);
    container.addEventListener("touchstart", stop, inputOpts);
    container.addEventListener("pointerdown", stop, inputOpts);
    timeoutTimer = window.setTimeout(stop, timeoutMs);
  };
  start();
  return stop;
}
