import {
  AnimatePresence,
  Reorder,
  motion,
  useDragControls,
  useAnimationControls,
} from "framer-motion";
import * as React from "react";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { ChatPrivatePanel, ChatRoomPanel } from "./chat-panel";
import { useChatContext } from "./context/chat-context";
import { AddIcon, CloseIcon, isChatRoom, ResizerHandle } from "./helpers";
/**
 * ChatWindowProps
 */
interface ChatWindowProps {
  controllerRef: React.MutableRefObject<HTMLDivElement>;
}

/**
 * ChatWindow
 * @param props props
 * @returns JSX.Element
 */
const ChatWindow: React.FC<ChatWindowProps> = (props) => {
  const {
    userId,
    openRooms,
    roomsSelected,
    setRoomsSelected,
    fullScreen,
    detached,
    toggleFullscreen,
    toggleDetached,
  } = useChatContext();

  const dragControls = useDragControls();
  const animationControls = useAnimationControls();

  const [, setResizing] = React.useState<boolean>(false);
  const [selectedTab, setSelectedTab] = React.useState<string>(
    openRooms[0]?.identifier || null
  );

  const windowConstrainsRef = React.useRef<HTMLDivElement>(null);
  const windowPositonRef = React.useRef<{
    width: number;
    height: number;
    x: number;
    y: number;
  }>({ width: 0, height: 0, x: 0, y: 0 });

  const windowNavRef = React.useRef<HTMLDivElement>(null);
  const refLeft = React.useRef<HTMLDivElement>(null);
  const refTop = React.useRef<HTMLDivElement>(null);
  const refRight = React.useRef<HTMLDivElement>(null);
  const refBottom = React.useRef<HTMLDivElement>(null);

  const refTopL = React.useRef<HTMLDivElement>(null);
  const refTopR = React.useRef<HTMLDivElement>(null);
  const refBottomL = React.useRef<HTMLDivElement>(null);
  const refBottomR = React.useRef<HTMLDivElement>(null);

  const componentInitialized = React.useRef(false);

  // Resize observer to detect when controllerRef is resized
  React.useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      const boundingRect = entries[0].contentRect;

      if (!boundingRect || !windowNavRef.current || !props.controllerRef) {
        return;
      }

      const controllerEle = props.controllerRef.current;
      const windowEle = windowNavRef.current;

      const controllerRect = controllerEle.getBoundingClientRect();
      const windowRect = windowEle.getBoundingClientRect();

      // Follow controllerRef resize only if not detached
      !detached &&
        animationControls.set({
          x: controllerRect.left - windowRect.width - 10,
        });
    });

    resizeObserver.observe(props.controllerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, [props.controllerRef, detached, animationControls]);

  // Effect to control fullscreen on/off animation
  React.useEffect(() => {
    /**
     * Animate window to full screen
     */
    const animateToFullScreen = async () => {
      updatePositionRef();

      // New width is screen width minus controller width
      const controller = props.controllerRef.current;

      const width =
        ((window.innerWidth - controller.offsetWidth - 20) /
          window.innerWidth) *
        100;

      await animationControls.start({
        x: 0,
        y: 0,
        width: `${width}%`,
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
  }, [fullScreen, animationControls, props.controllerRef]);

  // Effect to handle resizing from handles
  React.useEffect(() => {
    if (fullScreen) {
      return;
    }

    const resizeableEle = windowNavRef.current;
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
    resizerTop.addEventListener("mousedown", onMouseDownTopResize);
    resizerBottom &&
      resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

    // Mouse event listeners for resizing from corners
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
      resizerRight &&
        resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
      resizerBottom &&
        resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
      resizerTopLeft.removeEventListener("mousedown", onMouseDownTopLeftResize);
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
  }, [animationControls, openRooms, detached, fullScreen]);

  // Effect to set windowNavRef to be next to controllerRef initially
  React.useLayoutEffect(() => {
    if (
      !windowNavRef.current ||
      !props.controllerRef.current ||
      componentInitialized.current
    ) {
      return;
    }

    const controllerEle = props.controllerRef.current;
    const windowEle = windowNavRef.current;

    const controllerRect = controllerEle.getBoundingClientRect();
    const windowRect = windowEle.getBoundingClientRect();

    windowEle.style.transform = `translateX(${
      controllerRect.left - windowRect.width - 10
    }px) translateY(${
      controllerRect.top + controllerRect.height - windowRect.height - 10
    }px) translateZ(0px)`;

    windowEle.style.marginRight = "15px";
  }, [props.controllerRef]);

  // Effect to initial animationControls to set transform coordinates respectively
  // next to controllerRef. This is done separately from the useLayoutEffect above
  // because animationcontroller set function cannot be called in useLayoutEffect
  React.useEffect(() => {
    if (
      animationControls === null ||
      !props.controllerRef ||
      !windowNavRef.current ||
      componentInitialized.current
    ) {
      return;
    }

    const controllerEle = props.controllerRef.current;
    const windowEle = windowNavRef.current;

    const controllerRect = controllerEle.getBoundingClientRect();
    const windowRect = windowEle.getBoundingClientRect();

    animationControls.set({
      x: controllerRect.left - windowRect.width - 10,
      y: controllerRect.top + controllerRect.height - windowRect.height - 10,
      marginRight: "15px",
    });

    windowPositonRef.current = {
      height: windowNavRef.current.offsetHeight,
      width: windowNavRef.current.offsetWidth,
      x: windowNavRef.current.getBoundingClientRect().left,
      y: windowNavRef.current.getBoundingClientRect().top,
    };
  }, [animationControls, props.controllerRef]);

  // If not detached later on and windowNavRef and controllerRef exists
  // then set window position next to controller
  React.useEffect(() => {
    if (
      !windowNavRef.current ||
      !props.controllerRef.current ||
      !componentInitialized.current
    ) {
      componentInitialized.current = true;
      return;
    }

    const controllerEle = props.controllerRef.current;
    const windowEle = windowNavRef.current;

    const controllerRect = controllerEle.getBoundingClientRect();
    const windowRect = windowEle.getBoundingClientRect();

    // If detached, set window 10px from left side of screen to indicate detached state
    // Else eset animation controls next to controller
    if (detached) {
      animationControls.start({
        x: controllerRect.left - windowRect.width - 30,
        y: controllerRect.top + controllerRect.height - windowRect.height - 20,
        marginRight: 0,
        transition: { duration: 0.3 },
      });
    } else {
      // Set x value so that window is next to controller
      // Set y value so that window bottom is aligned with controller bottom
      animationControls.start({
        x: controllerRect.left - windowRect.width - 10,
        y: controllerRect.top + controllerRect.height - windowRect.height - 10,
        marginRight: "15px",
        transition: { duration: 0.3 },
      });
    }
  }, [animationControls, dragControls, detached, props.controllerRef]);

  // Effect to set windowNavRef to be next to controllerRef when window is resized
  React.useEffect(() => {
    /**
     * handleResize
     */
    const handleResize = () => {
      if (!windowNavRef.current || !props.controllerRef.current || detached) {
        return;
      }

      const controllerEle = props.controllerRef.current;
      const windowEle = windowNavRef.current;

      const controllerRect = controllerEle.getBoundingClientRect();
      const windowRect = windowEle.getBoundingClientRect();

      animationControls.set({
        x: controllerRect.left - windowRect.width - 10,
        y: controllerRect.top + controllerRect.height - windowRect.height - 10,
      });
    };
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [animationControls, detached, props.controllerRef]);

  /**
   * updatePositionRef
   */
  const updatePositionRef = () => {
    if (!windowNavRef.current) {
      return;
    }

    const windowEle = windowNavRef.current;

    const coords = windowEle.style.transform.match(
      /^translateX\((.+)px\) translateY\((.+)px\) translateZ/
    );

    windowPositonRef.current = {
      ...windowPositonRef.current,
      x: parseInt(coords[1]),
      y: parseInt(coords[2]),
    };
  };

  const activeTabInfo = openRooms.find(
    (room) => room.identifier === selectedTab
  );

  const activePanel = activeTabInfo ? (
    isChatRoom(activeTabInfo) ? (
      <ChatRoomPanel
        title={activeTabInfo.name}
        userId={userId}
        targetIdentifier={activeTabInfo.identifier}
      />
    ) : (
      <ChatPrivatePanel
        title={activeTabInfo.nick}
        userId={userId}
        targetIdentifier={activeTabInfo.identifier}
      />
    )
  ) : null;

  const normalScreen = (
    <>
      <nav
        className="chat-window__nav"
        onPointerDown={(event) => {
          event.preventDefault();
          dragControls.start(event);
        }}
      >
        <Reorder.Group
          axis="x"
          onReorder={setRoomsSelected}
          values={roomsSelected}
          className="chat-window__tabs"
        >
          {openRooms.map((room) => {
            const isRoom = isChatRoom(room);
            const isSelected = room.identifier === selectedTab;
            if (isRoom) {
              return (
                <ChatWindowTab
                  key={room.identifier}
                  identifier={room.identifier}
                  title={room.name}
                  isSelected={isSelected}
                  onClick={() => setSelectedTab(room.identifier)}
                  onRemove={() => {
                    unstable_batchedUpdates(() => {
                      setRoomsSelected((rooms) =>
                        rooms.filter((r) => r !== room.identifier)
                      );
                      setSelectedTab(openRooms[0].identifier || null);
                    });
                  }}
                />
              );
            }

            return (
              <ChatWindowTab
                key={room.identifier}
                identifier={room.identifier}
                title={room.nick}
                isSelected={isSelected}
                onClick={() => setSelectedTab(room.identifier)}
                onRemove={() => {
                  unstable_batchedUpdates(() => {
                    setRoomsSelected((rooms) =>
                      rooms.filter((r) => r !== room.identifier)
                    );
                    setSelectedTab(openRooms[0].identifier || null);
                  });
                }}
              />
            );
          })}
        </Reorder.Group>
        <motion.button
          className="chat-window__add-item"
          onClick={toggleDetached}
          whileTap={{ scale: 0.9 }}
          style={{
            right: "30px",
          }}
        >
          <AddIcon />
        </motion.button>

        <motion.button
          className="chat-window__add-item"
          onClick={toggleFullscreen}
          whileTap={{ scale: 0.9 }}
        >
          <AddIcon />
        </motion.button>
      </nav>
      <main className="chat-window__main">
        <AnimatePresence exitBeforeEnter>
          {activePanel && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15 }}
              style={{ width: "100%" }}
            >
              {activePanel}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );

  const fullscreen = (
    <>
      <header style={{ width: "100%" }}>
        <motion.button
          className="chat-window__add-item"
          onClick={toggleDetached}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "relative",
          }}
        >
          <AddIcon />
        </motion.button>

        <motion.button
          className="chat-window__add-item"
          onClick={toggleFullscreen}
          whileTap={{ scale: 0.9 }}
          style={{
            position: "relative",
          }}
        >
          <AddIcon />
        </motion.button>
      </header>
      <nav
        className="chat-window__nav"
        onPointerDown={(event) => {
          event.preventDefault();
          dragControls.start(event);
        }}
        style={{
          background: "grey",
          height: "100%",
        }}
      >
        <Reorder.Group
          axis="y"
          onReorder={setRoomsSelected}
          values={roomsSelected}
          className="chat-window__tabs"
          style={{
            display: "flex",
            flexDirection: "column",
            width: "auto",
          }}
        >
          {openRooms.map((room) => {
            const isRoom = isChatRoom(room);
            const isSelected = room.identifier === selectedTab;
            if (isRoom) {
              return (
                <ChatWindowTab
                  key={room.identifier}
                  identifier={room.identifier}
                  title={room.name}
                  isSelected={isSelected}
                  onClick={() => setSelectedTab(room.identifier)}
                  onRemove={() => {
                    unstable_batchedUpdates(() => {
                      setRoomsSelected((rooms) =>
                        rooms.filter((r) => r !== room.identifier)
                      );
                      setSelectedTab(openRooms[0].identifier || null);
                    });
                  }}
                />
              );
            }

            return (
              <ChatWindowTab
                key={room.identifier}
                identifier={room.identifier}
                title={room.nick}
                isSelected={isSelected}
                onClick={() => setSelectedTab(room.identifier)}
                onRemove={() => {
                  unstable_batchedUpdates(() => {
                    setRoomsSelected((rooms) =>
                      rooms.filter((r) => r !== room.identifier)
                    );
                    setSelectedTab(openRooms[0].identifier || null);
                  });
                }}
              />
            );
          })}
        </Reorder.Group>
      </nav>
      <main className="chat-window__main">
        <AnimatePresence exitBeforeEnter>
          {activePanel && (
            <motion.div
              animate={{ opacity: 1, y: 0 }}
              initial={{ opacity: 0, y: 20 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.15 }}
              style={{ width: "100%" }}
            >
              {activePanel}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );

  return (
    <>
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
        ref={windowNavRef}
        drag={detached}
        animate={animationControls}
        dragMomentum={false}
        dragListener={false}
        dragConstraints={windowConstrainsRef}
        className="chat-window"
        dragControls={dragControls}
        transition={{ type: "tween", duration: 0.3 }}
      >
        <AnimatePresence initial={false} exitBeforeEnter>
          {!fullScreen && (
            <motion.div
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: "100%", height: "100%", opacity: 1 }}
              exit={{ width: 0, height: 0, opacity: 0 }}
              style={{ position: "relative" }}
              transition={{ duration: 0.3 }}
            >
              {normalScreen}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence initial={false} exitBeforeEnter>
          {fullScreen && (
            <motion.div
              initial={{ width: 0, height: 0, opacity: 0 }}
              animate={{ width: "100%", height: "100%", opacity: 1 }}
              exit={{ width: 0, height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              style={{
                position: "relative",
                display: "flex",
                flexFlow: "wrap",
              }}
            >
              {fullscreen}
            </motion.div>
          )}
        </AnimatePresence>

        {
          // Handlers
        }
        <ResizerHandle visible={!fullScreen} ref={refLeft} direction="l" />
        <ResizerHandle visible={!fullScreen} ref={refTop} direction="t" />
        <ResizerHandle visible={!fullScreen} ref={refTopL} direction="tl" />

        <ResizerHandle
          visible={detached && !fullScreen}
          ref={refRight}
          direction="r"
        />
        <ResizerHandle
          visible={detached && !fullScreen}
          ref={refBottom}
          direction="b"
        />
        <ResizerHandle
          visible={detached && !fullScreen}
          ref={refTopR}
          direction="tr"
        />
        <ResizerHandle
          visible={detached && !fullScreen}
          ref={refBottomL}
          direction="bl"
        />
        <ResizerHandle
          visible={detached && !fullScreen}
          ref={refBottomR}
          direction="br"
        />
      </motion.div>
    </>
  );
};

/**
 * ChatWindowTabProps
 */
interface ChatWindowTabProps {
  identifier: string;
  title: string;
  isSelected: boolean;
  onClick?: () => void;
  onRemove?: () => void;
}

/**
 * Tab
 * @param props props
 * @returns JSX.Element
 */
export const ChatWindowTab = (props: ChatWindowTabProps) => {
  const { identifier, title, isSelected, onClick, onRemove } = props;

  return (
    <Reorder.Item
      value={identifier}
      id={identifier}
      initial={{ opacity: 0, y: 30 }}
      animate={{
        opacity: 1,
        backgroundColor: isSelected ? "#f3f3f3" : "#fff",
        y: 0,
        transition: { duration: 0.15 },
      }}
      exit={{ opacity: 0, y: 20, transition: { duration: 0.3 } }}
      whileDrag={{ backgroundColor: "#e3e3e3" }}
      className={isSelected ? "selected" : ""}
      onPointerDown={onClick && onClick}
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <motion.span layout="position">{title}</motion.span>
      <motion.div layout className="close">
        <motion.button
          onPointerDown={(event) => {
            event.stopPropagation();
            onRemove && onRemove();
          }}
          initial={false}
          animate={{ backgroundColor: isSelected ? "#e3e3e3" : "#fff" }}
        >
          <CloseIcon />
        </motion.button>
      </motion.div>
    </Reorder.Item>
  );
};

export default ChatWindow;
