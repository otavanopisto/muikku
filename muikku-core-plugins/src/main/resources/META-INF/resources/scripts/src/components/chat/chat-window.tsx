import {
  motion,
  useDragControls,
  useAnimationControls,
  AnimatePresence,
} from "framer-motion";
import * as React from "react";
import { IconButton } from "../general/button";
import { useChatContext } from "./context/chat-context";
import { ChatWindowBreakpointsContextProvider } from "./context/chat-window-breakpoints-context";
import { useChatWindowContext } from "./context/chat-window-context";
import { ResizerHandle } from "./chat-helpers";
import Dropdown from "~/components/general/dropdown";
import { useTranslation } from "react-i18next";

const WINDOW_MIN_WIDTH = 500;
const WINDOW_MIN_HEIGHT = 500;

/**
 * ChatWindowProps
 */
interface ChatWindowProps {
  children: React.ReactNode;
}

/**
 * ChatWindow
 * @param props props
 */
function ChatWindow(props: ChatWindowProps) {
  const { toggleControlBox } = useChatContext();

  const {
    toggleFullscreen,
    toggleDetached,
    windowPositonRef,
    detached,
    fullScreen,
    isPadWith,
  } = useChatWindowContext();

  // Setters to control rerendering and updating drag constraints
  const [resising, setResizing] = React.useState<boolean>(false);
  const [, setAnimating] = React.useState<boolean>(false);
  const [, setInitialized] = React.useState<boolean>(false);
  const [dragging, setDragging] = React.useState<boolean>(false);

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  // Windows constrains ref
  const windowConstrainsRef = React.useRef<HTMLDivElement>(null);

  // Window ref
  const windowRef = React.useRef<HTMLDivElement>(null);

  // Refs for resizing from sides
  const refLeft = React.useRef<HTMLDivElement>(null);
  const refTop = React.useRef<HTMLDivElement>(null);
  const refRight = React.useRef<HTMLDivElement>(null);
  const refBottom = React.useRef<HTMLDivElement>(null);

  // Refs for resizing from corners
  const refTopL = React.useRef<HTMLDivElement>(null);
  const refTopR = React.useRef<HTMLDivElement>(null);
  const refBottomL = React.useRef<HTMLDivElement>(null);
  const refBottomR = React.useRef<HTMLDivElement>(null);

  const { t } = useTranslation(["chat"]);

  const componentInitialized = React.useRef(false);

  // When dragging or resizing is true, set body overflow to hidden
  // so overflow won't interfere with dragging or resizing
  React.useEffect(() => {
    if ((dragging || resising) && detached) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [detached, dragging, resising]);

  // Resize observer for checking if browser window is resized
  // and window is overflowing
  React.useEffect(() => {
    if (windowRef.current && windowConstrainsRef.current) {
      const resizeObserver = new ResizeObserver((entries) => {
        const windowEle = windowRef.current;
        const windowRect = windowEle.getBoundingClientRect();

        for (const entry of entries) {
          if (entry.target === windowConstrainsRef.current && !fullScreen) {
            const dW = entry.contentRect.width - windowRect.width;
            const dH = entry.contentRect.height - windowRect.height;

            // If negative then window is overflowing
            if (dW <= 0) {
              windowPositonRef.current.x = 0;
              windowPositonRef.current.width = WINDOW_MIN_WIDTH;

              // If window constraints width is bigger than minimum width of window, set width to be window width instead
              if (entry.contentRect.width > WINDOW_MIN_WIDTH) {
                windowPositonRef.current.width = entry.contentRect.width;
              }

              animationControls.set({
                x: windowPositonRef.current.x,
                width: windowPositonRef.current.width,
              });
            }

            // If negative then window is overflowing
            if (dH <= 0) {
              // Set to be bottom right of screen
              windowPositonRef.current.y =
                window.innerHeight - windowRect.height;
              windowPositonRef.current.height = WINDOW_MIN_HEIGHT;

              // If window constraints height is bigger than minimum height of window, set height to be window height instead
              if (entry.contentRect.height > WINDOW_MIN_HEIGHT) {
                windowPositonRef.current.height = entry.contentRect.height;
              }

              animationControls.set({
                y: windowPositonRef.current.y,
                height: windowPositonRef.current.height,
              });
            }
          }
        }
      });

      resizeObserver.observe(windowConstrainsRef.current);

      return () => {
        resizeObserver.disconnect();
      };
    }
  }, [animationControls, fullScreen, windowPositonRef]);

  // Effect to control fullscreen on/off animation
  React.useEffect(() => {
    /**
     * updatePositionRef
     */
    const updatePositionRef = () => {
      if (!windowRef.current) {
        return;
      }

      const windowEle = windowRef.current;

      const coords = windowEle.style.transform.match(
        /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
      );

      windowPositonRef.current = {
        ...windowPositonRef.current,
        x: parseInt(coords[1]),
        y: parseInt(coords[2]),
      };
    };

    /**
     * Animate window to full screen
     */
    const animateToFullScreen = async () => {
      updatePositionRef();

      await animationControls.start({
        x: 0,
        y: 0,
        width: `100%`,
        height: "100%",
      });

      setResizing(true);
    };

    /**
     * Animate window to normal size
     */
    const animateToNormal = async () => {
      await animationControls.start({
        width: `${windowPositonRef.current.width}px`,
        height: `${windowPositonRef.current.height}px`,
        x: windowPositonRef.current.x,
        y: windowPositonRef.current.y,
      });

      setResizing(false);
    };

    // Only when component is initialized
    if (componentInitialized.current) {
      if (fullScreen) {
        animateToFullScreen();
      } else {
        animateToNormal();
      }
    }
  }, [fullScreen, animationControls, windowPositonRef]);

  // Effect to set windowRef to be next to bottom left corner or position ref values initially
  React.useLayoutEffect(() => {
    if (!windowRef.current || componentInitialized.current) {
      return;
    }

    const windowEle = windowRef.current;
    const windowRect = windowEle.getBoundingClientRect();

    if (detached && windowPositonRef.current) {
      // Set initial position of windowRef to values in windowPositionRef if detached and latest values exist
      // Else set initial position of windowRef to be next to bottom left of screen
      windowEle.style.transform = `translateX(${windowPositonRef.current.x}px) translateY(${windowPositonRef.current.y}px) translateZ(0px)`;
      windowEle.style.width = `${windowPositonRef.current.width}px`;
      windowEle.style.height = `${windowPositonRef.current.height}px`;
    } else {
      windowEle.style.transform = `translateX(${
        window.innerWidth - windowRect.width - 10
      }px) translateY(${
        window.innerHeight - windowRect.height - 10
      }px) translateZ(0px)`;

      if (windowPositonRef.current) {
        windowEle.style.width = `${windowPositonRef.current.width}px`;
        windowEle.style.height = `${windowPositonRef.current.height}px`;
      }
    }
  }, [detached, windowPositonRef]);

  // Effect to initial animationControls to set transform coordinates respectively
  // next to bottom left corner or coordinates to position ref values.
  // This is done separately from the useLayoutEffect above
  // because animationcontroller set function cannot be called in useLayoutEffect
  React.useEffect(() => {
    if (
      animationControls === null ||
      !windowRef.current ||
      componentInitialized.current
    ) {
      return;
    }

    const windowEle = windowRef.current;
    const windowRect = windowEle.getBoundingClientRect();

    // If detached and windowPositonRef exists, set animation controls to windowPositonRef values
    // Else set animation controls to be next to bottom left of screen
    if (detached && windowPositonRef.current) {
      animationControls.set({
        x: windowPositonRef.current.x,
        y: windowPositonRef.current.y,
        width: `${windowPositonRef.current.width}px`,
        height: `${windowPositonRef.current.height}px`,
      });
    } else {
      animationControls.set({
        x: window.innerWidth - windowRect.width - 10,
        y: window.innerHeight - windowRect.height - 10,
      });

      if (windowPositonRef.current) {
        animationControls.set({
          width: `${windowPositonRef.current.width}px`,
          height: `${windowPositonRef.current.height}px`,
        });
      }

      windowPositonRef.current = {
        height: windowRef.current.offsetHeight,
        width: windowRef.current.offsetWidth,
        x: windowRef.current.getBoundingClientRect().left,
        y: windowRef.current.getBoundingClientRect().top,
      };
    }

    // This is here to cause a rerender so drag constraits are set/updated correctly
    setInitialized(true);
  }, [animationControls, detached, windowPositonRef]);

  // Effect to set windowRef to be next to bottom left of screen
  React.useEffect(() => {
    /**
     * handleResize
     */
    const handleResize = () => {
      if (!windowRef.current || detached) {
        return;
      }

      const windowEle = windowRef.current;
      const windowRect = windowEle.getBoundingClientRect();

      if (fullScreen) {
        // If full screen and browser is resized, update width and height and coordinates
        // respectively to be keep window full screen
        animationControls.set({
          x: 0,
          y: 0,
          width: `100%`,
          height: "100%",
        });

        // When window is full screen and browser is resized, position ref x value need to be updated
        // so when returning from full screen window is in correct position
        windowPositonRef.current.x =
          window.innerWidth - windowPositonRef.current.width - 10;
      } else {
        animationControls.set({
          x: window.innerWidth - windowRect.width - 10,
          y: window.innerHeight - windowRect.height - 10,
        });
      }
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [animationControls, detached, fullScreen, windowPositonRef]);

  // If not detached later on and windowRef and controllerRef exists
  // then set window position next to controller
  React.useEffect(() => {
    if (!windowRef.current || !componentInitialized.current) {
      componentInitialized.current = true;
      return;
    }

    const windowEle = windowRef.current;
    const windowRect = windowEle.getBoundingClientRect();

    /**
     * Animate window to be 30px from left side of screen and 20px from bottom of screen
     * to indicate detached state
     */
    const animateDetach = async () => {
      setAnimating(true);

      await animationControls.start({
        x: window.innerWidth - windowRect.width - 20,
        y: window.innerHeight - windowRect.height - 20,
        transition: { duration: 0.3 },
      });

      setAnimating(false);
    };

    /**
     * Animate window to be next to bottom left of screen
     */
    const animateAttach = async () => {
      setAnimating(true);

      animationControls.start({
        x: window.innerWidth - windowRect.width - 10,
        y: window.innerHeight - windowRect.height - 10,
        transition: { duration: 0.3 },
      });

      setAnimating(false);
    };

    if (detached) {
      animateDetach();
    } else {
      animateAttach();
    }
  }, [animationControls, dragControls, detached, windowPositonRef]);

  // Effect to handle resizing from handles
  React.useEffect(() => {
    if (fullScreen) {
      return;
    }

    const resizeableEle = windowRef.current;
    const styles = window.getComputedStyle(resizeableEle);

    /**
     * Handles mouse down event when starting right resize
     *
     * @param e MouseEvent
     */
    const onMouseDownRightResize = (e: PointerEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveRightResize);
      document.addEventListener("pointerup", onMouseUpRightResize);
    };

    /**
     * Handles mouse move event when resizing right
     *
     * @param e MouseEvent
     */
    const onMouseMoveRightResize = (e: PointerEvent) => {
      e.preventDefault();

      if (!windowConstrainsRef.current) {
        return;
      }

      // If window is reached minimum width or height
      const minWidthReached =
        windowPositonRef.current.width <= WINDOW_MIN_WIDTH;
      // If mouse is outside of window, do not resize
      const windowRightSideReached =
        e.clientX >= windowConstrainsRef.current.offsetWidth;

      // difference in x coordinates
      const dx = e.clientX - windowPositonRef.current.x;

      const newWidth = windowPositonRef.current.width + dx;
      const resizingBigger = newWidth > windowPositonRef.current.width;

      if (
        (resizingBigger && !windowRightSideReached) ||
        (!resizingBigger && !minWidthReached)
      ) {
        windowPositonRef.current.x = e.clientX;
        windowPositonRef.current.width = newWidth;
      }

      // Use animate controls set method to set x value to correspond width change
      animationControls.set({
        height: styles.height,
        width: `${windowPositonRef.current.width}px`,
      });
    };

    /**
     * Handles mouse up event when releasing right resize
     * @param e MouseEvent
     */
    const onMouseUpRightResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveRightResize);
    };

    /**
     * Handles mouse down event when starting top resize
     *
     * @param e MouseEvent
     */
    const onMouseDownTopResize = (e: PointerEvent) => {
      e.preventDefault();
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveTopResize);
      document.addEventListener("pointerup", onMouseUpTopResize);
    };

    /**
     * Handles mouse move event when resizing top
     *
     * @param e MouseEvent
     */
    const onMouseMoveTopResize = (e: PointerEvent) => {
      e.preventDefault();

      // If window is reached minimum width or height
      const minHeightReached =
        windowPositonRef.current.height <= WINDOW_MIN_HEIGHT;
      // If mouse is outside of window, do not resize
      const windowTopReached = e.clientY <= 0;

      // difference in y coordinates
      const dy = e.clientY - windowPositonRef.current.y;

      // new height
      const newHeight = windowPositonRef.current.height - dy;

      // Whether resizing bigger or smaller
      const resizingBigger = newHeight > windowPositonRef.current.height;

      if (
        (resizingBigger && !windowTopReached) ||
        (!resizingBigger && !minHeightReached)
      ) {
        windowPositonRef.current.y = e.clientY;
        windowPositonRef.current.height = newHeight;
      }

      // Use animate controls set method to set y value to correspond width change
      animationControls.set({
        y: windowPositonRef.current.y,
        width: styles.width,
        height: `${windowPositonRef.current.height}px`,
      });
    };

    /**
     * Handles mouse up event when releasing top resize
     *
     * @param e MouseEvent
     */
    const onMouseUpTopResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveTopResize);
    };

    /**
     * Handles mouse down event when starting bottom resize
     *
     * @param e MouseEvent
     */
    const onMouseDownBottomResize = (e: PointerEvent) => {
      e.preventDefault();
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveBottomResize);
      document.addEventListener("pointerup", onMouseUpBottomResize);
    };

    /**
     * Handles mouse move event when resizing bottom
     *
     * @param e MouseEvent
     */
    const onMouseMoveBottomResize = (e: PointerEvent) => {
      e.preventDefault();
      if (!windowConstrainsRef.current) {
        return;
      }

      // If window is reached minimum width or height
      const minHeightReached =
        windowPositonRef.current.height <= WINDOW_MIN_HEIGHT;

      // If mouse is outside of window, do not resize
      const windowBottomReached =
        e.clientY >= windowConstrainsRef.current.offsetHeight;

      // difference in y coordinates
      const dy = e.clientY - windowPositonRef.current.y;

      // new height
      const newHeight = windowPositonRef.current.height + dy;

      // Whether resizing bigger or smaller
      const resizingBigger = newHeight > windowPositonRef.current.height;

      if (
        (resizingBigger && !windowBottomReached) ||
        (!resizingBigger && !minHeightReached)
      ) {
        windowPositonRef.current.y = e.clientY;
        windowPositonRef.current.height = windowPositonRef.current.height + dy;
      }

      // Use animate controls set method to set y value to correspond width change
      animationControls.set({
        height: `${windowPositonRef.current.height}px`,
        width: styles.width,
      });
    };

    /**
     * Handles mouse up event when releasing bottom resize
     *
     * @param e MouseEvent
     */
    const onMouseUpBottomResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveBottomResize);
    };

    /**
     * Handles mouse down event when starting left resize
     *
     * @param e MouseEvent
     */
    const onMouseDownLeftResize = (e: PointerEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveLeftResize);
      document.addEventListener("pointerup", onMouseUpLeftResize);
    };

    /**
     * Handles mouse move event when resizing left
     *
     * @param e MouseEvent
     */
    const onMouseMoveLeftResize = (e: PointerEvent) => {
      e.preventDefault();

      // If window is reached minimum width or height
      const minWidthReached =
        windowPositonRef.current.width <= WINDOW_MIN_WIDTH;

      // If mouse is outside of window, do not resize
      const windowLeftSideReached = e.clientX <= 0;

      const dx = e.clientX - windowPositonRef.current.x;
      const newWidth = windowPositonRef.current.width - dx;
      const resizingBigger = newWidth > windowPositonRef.current.width;

      if (
        (resizingBigger && !windowLeftSideReached) ||
        (!resizingBigger && !minWidthReached)
      ) {
        windowPositonRef.current.x = e.clientX;
        windowPositonRef.current.width = newWidth;
      }

      // Use animate controls set method to set x value to correspond width change
      animationControls.set({
        // Calculated translateX value when resizing left
        x: windowPositonRef.current.x,
        height: styles.height,
        width: `${windowPositonRef.current.width}px`,
      });
    };

    /**
     * Handles mouse up event when releasing left resize
     *
     * @param e MouseEvent
     */
    const onMouseUpLeftResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveLeftResize);
    };

    /**
     * Handles mouse down event when starting top left resize
     *
     * @param e MouseEvent
     */
    const onMouseDownTopLeftResize = (e: PointerEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveTopLeftResize);
      document.addEventListener("pointerup", onMouseUpTopLeftResize);
    };

    /**
     * Handles mouse move event when resizing top left
     *
     * @param e MouseEvent
     */
    const onMouseMoveTopLeftResize = (e: PointerEvent) => {
      e.preventDefault();

      // If window is reached minimum width or height
      const minWidthReached =
        windowPositonRef.current.width <= WINDOW_MIN_WIDTH;
      const minHeightReached =
        windowPositonRef.current.height <= WINDOW_MIN_HEIGHT;

      // If mouse is outside of window, do not resize
      const windowLeftSideReached = e.clientX <= 0;
      const windowTopReached = e.clientY <= 0;

      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;

      const newWidth = windowPositonRef.current.width - dx;
      const newHeight = windowPositonRef.current.height - dy;

      const resizingWidthBigger = newWidth > windowPositonRef.current.width;
      const resizingHeightBigger = newHeight > windowPositonRef.current.height;

      if (
        (resizingWidthBigger && !windowLeftSideReached) ||
        (!resizingWidthBigger && !minWidthReached)
      ) {
        windowPositonRef.current.x = e.clientX;
        windowPositonRef.current.width = newWidth;
      }

      if (
        (resizingHeightBigger && !windowTopReached) ||
        (!resizingHeightBigger && !minHeightReached)
      ) {
        windowPositonRef.current.y = e.clientY;
        windowPositonRef.current.height = newHeight;
      }

      // Use animate controls set method to set x value to correspond width change
      animationControls.set({
        x: windowPositonRef.current.x,
        y: windowPositonRef.current.y,
        height: `${windowPositonRef.current.height}px`,
        width: `${windowPositonRef.current.width}px`,
      });
    };

    /**
     * Handles mouse up event when releasing top left resize
     *
     * @param e MouseEvent
     */
    const onMouseUpTopLeftResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveTopLeftResize);
    };

    /**
     * Handles mouse down event when starting top right resize
     *
     * @param e MouseEvent
     */
    const onMouseDownTopRightResize = (e: PointerEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveTopRightResize);
      document.addEventListener("pointerup", onMouseUpTopRightResize);
    };

    /**
     * Handles mouse move event when resizing top right
     *
     * @param e MouseEvent
     */
    const onMouseMoveTopRightResize = (e: PointerEvent) => {
      e.preventDefault();

      if (!windowConstrainsRef.current) {
        return;
      }

      // If window is reached minimum width or height
      const minWidthReached =
        windowPositonRef.current.width <= WINDOW_MIN_WIDTH;
      const minHeightReached =
        windowPositonRef.current.height <= WINDOW_MIN_HEIGHT;

      // If mouse is outside of window, do not resize
      const windowRightSideReached =
        e.clientX >= windowConstrainsRef.current.offsetWidth;
      const windowTopReached = e.clientY <= 0;

      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;

      const newWidth = windowPositonRef.current.width + dx;
      const newHeight = windowPositonRef.current.height - dy;

      const resizingWidthBigger = newWidth > windowPositonRef.current.width;
      const resizingHeightBigger = newHeight > windowPositonRef.current.height;

      if (
        (resizingWidthBigger && !windowRightSideReached) ||
        (!resizingWidthBigger && !minWidthReached)
      ) {
        windowPositonRef.current.x = e.clientX;
        windowPositonRef.current.width = newWidth;
      }

      if (
        (resizingHeightBigger && !windowTopReached) ||
        (!resizingHeightBigger && !minHeightReached)
      ) {
        windowPositonRef.current.y = e.clientY;
        windowPositonRef.current.height = newHeight;
      }

      // Use animate controls set method to set x value to correspond width change
      animationControls.set({
        y: windowPositonRef.current.y,
        height: `${windowPositonRef.current.height}px`,
        width: `${windowPositonRef.current.width}px`,
      });
    };

    /**
     * Handles mouse up event when releasing top right resize
     *
     * @param e MouseEvent
     */
    const onMouseUpTopRightResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveTopRightResize);
    };

    /**
     * Handles mouse down event when starting bottom left resize
     *
     * @param e MouseEvent
     */
    const onMouseDownBottomLeftResize = (e: PointerEvent) => {
      e.preventDefault();

      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveBottomLeftResize);
      document.addEventListener("pointerup", onMouseUpBottomLeftResize);
    };

    /**
     * Handles mouse move event when resizing bottom left
     *
     * @param e MouseEvent
     */
    const onMouseMoveBottomLeftResize = (e: PointerEvent) => {
      e.preventDefault();

      if (!windowConstrainsRef.current) {
        return;
      }

      // If window is reached minimum width or height
      const minWidthReached =
        windowPositonRef.current.width <= WINDOW_MIN_WIDTH;
      const minHeightReached =
        windowPositonRef.current.height <= WINDOW_MIN_HEIGHT;

      // If mouse is outside of window, do not resize
      const windowLeftSideReached = e.clientX <= 0;
      const windowBottomReached =
        e.clientY >= windowConstrainsRef.current.offsetHeight;

      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;

      const newWidth = windowPositonRef.current.width - dx;
      const newHeight = windowPositonRef.current.height + dy;

      const resizingWidthBigger = newWidth > windowPositonRef.current.width;
      const resizingHeightBigger = newHeight > windowPositonRef.current.height;

      if (
        (resizingWidthBigger && !windowLeftSideReached) ||
        (!resizingWidthBigger && !minWidthReached)
      ) {
        windowPositonRef.current.x = e.clientX;
        windowPositonRef.current.width = newWidth;
      }

      if (
        (resizingHeightBigger && !windowBottomReached) ||
        (!resizingHeightBigger && !minHeightReached)
      ) {
        windowPositonRef.current.height = newHeight;
        windowPositonRef.current.y = e.clientY;
      }

      // Use animate controls set method to set x value to correspond width change
      animationControls.set({
        x: windowPositonRef.current.x,
        height: `${windowPositonRef.current.height}px`,
        width: `${windowPositonRef.current.width}px`,
      });
    };

    /**
     * Handles mouse up event when releasing bottom left resize
     *
     * @param e MouseEvent
     */
    const onMouseUpBottomLeftResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveBottomLeftResize);
    };

    /**
     * Handles mouse down event when starting bottom right resize
     *
     * @param e MouseEvent
     */
    const onMouseDownBottomRightResize = (e: PointerEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("pointermove", onMouseMoveBottomRightResize);
      document.addEventListener("pointerup", onMouseUpBottomRightResize);
    };

    /**
     * Handles mouse move event when resizing bottom right
     *
     * @param e MouseEvent
     */
    const onMouseMoveBottomRightResize = (e: PointerEvent) => {
      e.preventDefault();

      if (!windowConstrainsRef.current) {
        return;
      }

      // If window is reached minimum width or height
      const minWidthReached =
        windowPositonRef.current.width <= WINDOW_MIN_WIDTH;
      const minHeightReached =
        windowPositonRef.current.height <= WINDOW_MIN_HEIGHT;

      const windowRightSideReached =
        e.clientX >= windowConstrainsRef.current.offsetWidth;
      const windowBottomReached =
        e.clientY >= windowConstrainsRef.current.offsetHeight;

      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;

      const newWidth = windowPositonRef.current.width + dx;
      const newHeight = windowPositonRef.current.height + dy;

      const resizingWidthBigger = newWidth > windowPositonRef.current.width;
      const resizingHeightBigger = newHeight > windowPositonRef.current.height;

      if (
        (resizingWidthBigger && !windowRightSideReached) ||
        (!resizingWidthBigger && !minWidthReached)
      ) {
        windowPositonRef.current.x = e.clientX;
        windowPositonRef.current.width = windowPositonRef.current.width + dx;
      }

      if (
        (resizingHeightBigger && !windowBottomReached) ||
        (!resizingHeightBigger && !minHeightReached)
      ) {
        windowPositonRef.current.height = windowPositonRef.current.height + dy;
        windowPositonRef.current.y = e.clientY;
      }

      // Use animate controls set method to set x value to correspond width change
      animationControls.set({
        height: `${windowPositonRef.current.height}px`,
        width: `${windowPositonRef.current.width}px`,
      });
    };

    /**
     * Handles mouse up event when releasing bottom right resize
     *
     * @param e MouseEvent
     */
    const onMouseUpBottomRightResize = (e: PointerEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("pointermove", onMouseMoveBottomRightResize);
    };

    // Mouse event listeners for resizing from sides
    const resizerRight = refRight.current;
    const resizerTop = refTop.current;
    const resizerBottom = refBottom.current;
    const resizerLeft = refLeft.current;

    const resizerTopLeft = refTopL.current;
    const resizerTopRight = refTopR.current;
    const resizerBotLeft = refBottomL.current;
    const resizerBotRight = refBottomR.current;

    // Mouse event listeners for resizing from sides
    resizerRight &&
      resizerRight.addEventListener("pointerdown", onMouseDownRightResize);
    resizerTop &&
      resizerTop.addEventListener("pointerdown", onMouseDownTopResize);
    resizerBottom &&
      resizerBottom.addEventListener("pointerdown", onMouseDownBottomResize);
    resizerLeft &&
      resizerLeft.addEventListener("pointerdown", onMouseDownLeftResize);

    // Mouse event listeners for resizing from corners
    resizerTopLeft &&
      resizerTopLeft.addEventListener("pointerdown", onMouseDownTopLeftResize);
    resizerTopRight &&
      resizerTopRight.addEventListener(
        "pointerdown",
        onMouseDownTopRightResize
      );
    resizerBotLeft &&
      resizerBotLeft.addEventListener(
        "pointerdown",
        onMouseDownBottomLeftResize
      );
    resizerBotRight &&
      resizerBotRight.addEventListener(
        "pointerdown",
        onMouseDownBottomRightResize
      );

    return () => {
      // Remove mouse event listeners for resizing from sides
      resizerRight &&
        resizerRight.removeEventListener("pointerdown", onMouseDownRightResize);
      resizerTop &&
        resizerTop.removeEventListener("pointerdown", onMouseDownTopResize);
      resizerBottom &&
        resizerBottom.removeEventListener(
          "pointerdown",
          onMouseDownBottomResize
        );
      resizerLeft &&
        resizerLeft.removeEventListener("pointerdown", onMouseDownLeftResize);

      // Remove mouse event listeners for resizing from corners
      resizerTopLeft &&
        resizerTopLeft.removeEventListener(
          "pointerdown",
          onMouseDownTopLeftResize
        );
      resizerTopRight &&
        resizerTopRight.removeEventListener(
          "pointerdown",
          onMouseDownTopRightResize
        );
      resizerBotLeft &&
        resizerBotLeft.removeEventListener(
          "pointerdown",
          onMouseDownBottomLeftResize
        );
      resizerBotRight &&
        resizerBotRight.removeEventListener(
          "pointerdown",
          onMouseDownBottomRightResize
        );
    };
  }, [animationControls, fullScreen, detached, windowPositonRef]);

  const handleCloseWindow = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();

      // If detached, update window position ref values before closing
      if (detached) {
        windowPositonRef.current = {
          height: windowRef.current.offsetHeight,
          width: windowRef.current.offsetWidth,
          x: windowRef.current.getBoundingClientRect().left,
          y: windowRef.current.getBoundingClientRect().top,
        };
      }

      toggleControlBox();
    },
    [detached, toggleControlBox, windowPositonRef]
  );

  const handleFullScreenClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.stopPropagation();
      toggleFullscreen();
    },
    [toggleFullscreen]
  );

  const windowModifiers: string[] = [];

  if (detached) {
    windowModifiers.push("detached");
  }

  if (fullScreen) {
    windowModifiers.push("fullscreen");
  }

  const windowClassName = `chat ${windowModifiers.map(
    (modifier) => `chat--${modifier}`
  )}`;

  return (
    <ChatWindowBreakpointsContextProvider windowRef={windowRef}>
      <div
        id="chatConstrains"
        ref={windowConstrainsRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      />
      <motion.div
        ref={windowRef}
        drag={!fullScreen && detached}
        animate={animationControls}
        dragMomentum={false}
        dragListener={false}
        dragConstraints={windowConstrainsRef}
        className={windowClassName}
        dragControls={dragControls}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <header
          onPointerDown={(e) => {
            e.preventDefault();
            setDragging(true);
            dragControls.start(e);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            setDragging(false);
          }}
          className="chat__header"
        >
          <AnimatePresence initial={false}>
            {!fullScreen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="chat__button-wrapper chat__button-wrapper--header"
              >
                {detached ? (
                  <Dropdown
                    alignSelfVertically="top"
                    openByHover
                    content={<p>{t("actions.attachWindow", { ns: "chat" })}</p>}
                  >
                    <IconButton
                      buttonModifiers={["chat"]}
                      icon="arrow-down-right"
                      onClick={toggleDetached}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                ) : (
                  <Dropdown
                    alignSelfVertically="top"
                    openByHover
                    content={<p>{t("actions.detachWindow", { ns: "chat" })}</p>}
                  >
                    <IconButton
                      buttonModifiers={["chat"]}
                      icon="arrow-up-left"
                      onClick={toggleDetached}
                      onPointerDownCapture={(e) => e.stopPropagation()}
                    />
                  </Dropdown>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="chat__button-wrapper chat__button-wrapper--header">
            {fullScreen ? (
              <Dropdown
                alignSelfVertically="top"
                openByHover
                content={
                  <p>{t("actions.exitFullscreenMode", { ns: "chat" })}</p>
                }
              >
                <IconButton
                  buttonModifiers={["chat"]}
                  icon="fullscreen-exit"
                  onClick={handleFullScreenClick}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                />
              </Dropdown>
            ) : (
              <Dropdown
                alignSelfVertically="top"
                openByHover
                content={<p>{t("actions.fullscreenMode", { ns: "chat" })}</p>}
              >
                <IconButton
                  buttonModifiers={["chat"]}
                  icon="fullscreen"
                  onClick={handleFullScreenClick}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                />
              </Dropdown>
            )}
          </div>

          <div className="chat__button-wrapper chat__button-wrapper--header">
            <Dropdown
              alignSelfVertically="top"
              openByHover
              content={<p>{t("actions.close")}</p>}
            >
              <IconButton
                buttonModifiers={["chat"]}
                icon="cross"
                onClick={handleCloseWindow}
                onPointerDownCapture={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </div>
        </header>
        <main id="chat__body" className="chat__body">
          {props.children}
        </main>

        <ResizerHandle
          visible={!fullScreen}
          ref={refLeft}
          direction="l"
          isPad={isPadWith}
        />
        <ResizerHandle
          visible={!fullScreen}
          ref={refTop}
          direction="t"
          isPad={isPadWith}
        />
        <ResizerHandle
          visible={!fullScreen}
          ref={refTopL}
          direction="tl"
          isPad={isPadWith}
        />

        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refRight}
          direction="r"
          isPad={isPadWith}
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refBottom}
          direction="b"
          isPad={isPadWith}
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refTopR}
          direction="tr"
          isPad={isPadWith}
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refBottomL}
          direction="bl"
          isPad={isPadWith}
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refBottomR}
          direction="br"
          isPad={isPadWith}
        />
      </motion.div>
    </ChatWindowBreakpointsContextProvider>
  );
}

export default ChatWindow;
