import {
  motion,
  useDragControls,
  useAnimationControls,
  AnimatePresence,
} from "framer-motion";
import * as React from "react";
import { useChatContext } from "./context/chat-context";
import { ChatWindowContextProvider } from "./context/chat-window-context";
import { AddIcon, CloseIcon, ResizerHandle } from "./helpers";

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
  const {
    fullScreen,
    detached,
    toggleFullscreen,
    toggleControlBox,
    toggleDetached,
    isMobileWidth,
  } = useChatContext();

  const [, setResizing] = React.useState<boolean>(false);
  const [, setInitialized] = React.useState<boolean>(false);

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

  // Ref to store and track window position
  const windowPositonRef = React.useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>({ width: 0, height: 0, x: 0, y: 0 });

  const componentInitialized = React.useRef(false);

  // Effect to control fullscreen on/off animation
  React.useEffect(() => {
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
  }, [fullScreen, animationControls]);

  // Effect to set windowRef to be next to controllerRef initially
  React.useLayoutEffect(() => {
    if (!windowRef.current || componentInitialized.current) {
      return;
    }

    const windowEle = windowRef.current;
    const windowRect = windowEle.getBoundingClientRect();

    // Set initial position of windowRef to be next to bottom left of screen
    windowEle.style.transform = `translateX(${
      window.innerWidth - windowRect.width - 20
    }px) translateY(${
      window.innerHeight - windowRect.height
    }px) translateZ(0px)`;
  }, []);

  // Effect to initial animationControls to set transform coordinates respectively
  // next to controllerRef. This is done separately from the useLayoutEffect above
  // because animationcontroller set function cannot be called in useLayoutEffect
  React.useEffect(() => {
    if (
      animationControls === null ||
      !windowRef.current ||
      componentInitialized.current ||
      isMobileWidth
    ) {
      return;
    }

    const windowEle = windowRef.current;
    const windowRect = windowEle.getBoundingClientRect();

    animationControls.set({
      x: window.innerWidth - windowRect.width - 20,
      y: window.innerHeight - windowRect.height,
    });

    windowPositonRef.current = {
      height: windowRef.current.offsetHeight,
      width: windowRef.current.offsetWidth,
      x: windowRef.current.getBoundingClientRect().left,
      y: windowRef.current.getBoundingClientRect().top,
    };

    setInitialized(true);
  }, [animationControls, isMobileWidth]);

  // Effect to set windowRef to be next to bottom left of screen
  React.useEffect(() => {
    /**
     * handleResize
     */
    const handleResize = () => {
      if (!windowRef.current || detached || isMobileWidth) {
        return;
      }

      const windowEle = windowRef.current;
      const windowRect = windowEle.getBoundingClientRect();

      animationControls.set({
        x: window.innerWidth - windowRect.width - 20,
        y: window.innerHeight - windowRect.height,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [animationControls, detached, isMobileWidth]);

  // If not detached later on and windowRef and controllerRef exists
  // then set window position next to controller
  React.useEffect(() => {
    if (!windowRef.current || !componentInitialized.current || isMobileWidth) {
      componentInitialized.current = true;
      return;
    }

    const windowEle = windowRef.current;
    const windowRect = windowEle.getBoundingClientRect();

    // If detached, set window 10px from left side of screen to indicate detached state
    // Else eset animation controls next to controller
    if (detached) {
      animationControls.start({
        x: window.innerWidth - windowRect.width - 30,
        y: window.innerHeight - windowRect.height - 20,
        transition: { duration: 0.3 },
      });
    } else {
      // Set x value so that window is next to controller
      // Set y value so that window bottom is aligned with controller bottom
      animationControls.start({
        x: window.innerWidth - windowRect.width - 20,
        y: window.innerHeight - windowRect.height,
        transition: { duration: 0.3 },
      });
    }
  }, [animationControls, dragControls, detached, isMobileWidth]);

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
    const onMouseDownRightResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
    };

    /**
     * Handles mouse move event when resizing right
     *
     * @param e MouseEvent
     */
    const onMouseMoveRightResize = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - windowPositonRef.current.x;
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.width = windowPositonRef.current.width + dx;

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
    const onMouseUpRightResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveRightResize);
    };

    /**
     * Handles mouse down event when starting top resize
     *
     * @param e MouseEvent
     */
    const onMouseDownTopResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveTopResize);
      document.addEventListener("mouseup", onMouseUpTopResize);
    };

    /**
     * Handles mouse move event when resizing top
     *
     * @param e MouseEvent
     */
    const onMouseMoveTopResize = (e: MouseEvent) => {
      e.preventDefault();
      const dy = e.clientY - windowPositonRef.current.y;
      windowPositonRef.current.height = windowPositonRef.current.height - dy;
      windowPositonRef.current.y = e.clientY;

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
    const onMouseUpTopResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveTopResize);
    };

    /**
     * Handles mouse down event when starting bottom resize
     *
     * @param e MouseEvent
     */
    const onMouseDownBottomResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveBottomResize);
      document.addEventListener("mouseup", onMouseUpBottomResize);
    };

    /**
     * Handles mouse move event when resizing bottom
     *
     * @param e MouseEvent
     */
    const onMouseMoveBottomResize = (e: MouseEvent) => {
      e.preventDefault();
      const dy = e.clientY - windowPositonRef.current.y;
      windowPositonRef.current.height = windowPositonRef.current.height + dy;
      windowPositonRef.current.y = e.clientY;

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
    const onMouseUpBottomResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveBottomResize);
    };

    /**
     * Handles mouse down event when starting left resize
     *
     * @param e MouseEvent
     */
    const onMouseDownLeftResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
    };

    /**
     * Handles mouse move event when resizing left
     *
     * @param e MouseEvent
     */
    const onMouseMoveLeftResize = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - windowPositonRef.current.x;
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.width = windowPositonRef.current.width - dx;

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
    const onMouseUpLeftResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
    };

    /**
     * Handles mouse down event when starting top left resize
     *
     * @param e MouseEvent
     */
    const onMouseDownTopLeftResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveTopLeftResize);
      document.addEventListener("mouseup", onMouseUpTopLeftResize);
    };

    /**
     * Handles mouse move event when resizing top left
     *
     * @param e MouseEvent
     */
    const onMouseMoveTopLeftResize = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;
      windowPositonRef.current.width = windowPositonRef.current.width - dx;
      windowPositonRef.current.height = windowPositonRef.current.height - dy;

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
    const onMouseUpTopLeftResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveTopLeftResize);
    };

    /**
     * Handles mouse down event when starting top right resize
     *
     * @param e MouseEvent
     */
    const onMouseDownTopRightResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveTopRightResize);
      document.addEventListener("mouseup", onMouseUpTopRightResize);
    };

    /**
     * Handles mouse move event when resizing top right
     *
     * @param e MouseEvent
     */
    const onMouseMoveTopRightResize = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;
      windowPositonRef.current.width = windowPositonRef.current.width + dx;
      windowPositonRef.current.height = windowPositonRef.current.height - dy;

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
    const onMouseUpTopRightResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveTopRightResize);
    };

    /**
     * Handles mouse down event when starting bottom left resize
     *
     * @param e MouseEvent
     */
    const onMouseDownBottomLeftResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveBottomLeftResize);
      document.addEventListener("mouseup", onMouseUpBottomLeftResize);
    };

    /**
     * Handles mouse move event when resizing bottom left
     *
     * @param e MouseEvent
     */
    const onMouseMoveBottomLeftResize = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;
      windowPositonRef.current.width = windowPositonRef.current.width - dx;
      windowPositonRef.current.height = windowPositonRef.current.height + dy;

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
    const onMouseUpBottomLeftResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveBottomLeftResize);
    };

    /**
     * Handles mouse down event when starting bottom right resize
     *
     * @param e MouseEvent
     */
    const onMouseDownBottomRightResize = (e: MouseEvent) => {
      e.preventDefault();
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;

      setResizing(true);
      document.addEventListener("mousemove", onMouseMoveBottomRightResize);
      document.addEventListener("mouseup", onMouseUpBottomRightResize);
    };

    /**
     * Handles mouse move event when resizing bottom right
     *
     * @param e MouseEvent
     */
    const onMouseMoveBottomRightResize = (e: MouseEvent) => {
      e.preventDefault();
      const dx = e.clientX - windowPositonRef.current.x;
      const dy = e.clientY - windowPositonRef.current.y;
      windowPositonRef.current.x = e.clientX;
      windowPositonRef.current.y = e.clientY;
      windowPositonRef.current.width = windowPositonRef.current.width + dx;
      windowPositonRef.current.height = windowPositonRef.current.height + dy;

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
    const onMouseUpBottomRightResize = (e: MouseEvent) => {
      e.preventDefault();

      setResizing(false);
      document.removeEventListener("mousemove", onMouseMoveBottomRightResize);
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
      resizerRight.addEventListener("mousedown", onMouseDownRightResize);
    resizerTop &&
      resizerTop.addEventListener("mousedown", onMouseDownTopResize);
    resizerBottom &&
      resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
    resizerLeft &&
      resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

    // Mouse event listeners for resizing from corners
    resizerTopLeft &&
      resizerTopLeft.addEventListener("mousedown", onMouseDownTopLeftResize);
    resizerTopRight &&
      resizerTopRight.addEventListener("mousedown", onMouseDownTopRightResize);
    resizerBotLeft &&
      resizerBotLeft.addEventListener("mousedown", onMouseDownBottomLeftResize);
    resizerBotRight &&
      resizerBotRight.addEventListener(
        "mousedown",
        onMouseDownBottomRightResize
      );

    return () => {
      // Remove mouse event listeners for resizing from sides
      resizerRight &&
        resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerTop &&
        resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
      resizerBottom &&
        resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
      resizerLeft &&
        resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);

      // Remove mouse event listeners for resizing from corners
      resizerTopLeft &&
        resizerTopLeft.removeEventListener(
          "mousedown",
          onMouseDownTopLeftResize
        );
      resizerTopRight &&
        resizerTopRight.removeEventListener(
          "mousedown",
          onMouseDownTopRightResize
        );
      resizerBotLeft &&
        resizerBotLeft.removeEventListener(
          "mousedown",
          onMouseDownBottomLeftResize
        );
      resizerBotRight &&
        resizerBotRight.removeEventListener(
          "mousedown",
          onMouseDownBottomRightResize
        );
    };
  }, [animationControls, fullScreen, detached]);

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

  return (
    <ChatWindowContextProvider windowRef={windowRef}>
      <div
        id="chat-window-constrains"
        ref={windowConstrainsRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      />
      <motion.div
        ref={windowRef}
        drag={!fullScreen && detached}
        animate={animationControls}
        dragMomentum={false}
        dragListener={false}
        dragConstraints={windowConstrainsRef}
        className="chat-window"
        dragControls={dragControls}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <header
          onPointerDown={(event) => {
            event.preventDefault();
            dragControls.start(event);
          }}
          style={{
            height: "50px",
            width: "100%",
            backgroundColor: "beige",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <AnimatePresence initial={false}>
            {!fullScreen && (
              <motion.button
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="chat-window__add-item"
                onClick={toggleDetached}
              >
                <AddIcon />
              </motion.button>
            )}
          </AnimatePresence>

          <motion.button
            className="chat-window__add-item"
            onClick={toggleFullscreen}
          >
            <AddIcon />
          </motion.button>

          <motion.button
            className="chat-window__add-item"
            onClick={toggleControlBox}
          >
            <CloseIcon />
          </motion.button>
        </header>
        <main className="chat-window__main">{props.children}</main>

        <ResizerHandle visible={!fullScreen} ref={refLeft} direction="l" />
        <ResizerHandle visible={!fullScreen} ref={refTop} direction="t" />
        <ResizerHandle visible={!fullScreen} ref={refTopL} direction="tl" />

        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refRight}
          direction="r"
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refBottom}
          direction="b"
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refTopR}
          direction="tr"
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refBottomL}
          direction="bl"
        />
        <ResizerHandle
          visible={!fullScreen && detached}
          ref={refBottomR}
          direction="br"
        />
      </motion.div>
    </ChatWindowContextProvider>
  );
}

export default ChatWindow;
