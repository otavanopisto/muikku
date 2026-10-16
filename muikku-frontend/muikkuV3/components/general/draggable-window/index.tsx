import { motion, useDragControls } from "framer-motion";
import * as React from "react";
//import { createPortal } from "react-dom";
import Portal from "../portal";

/**
 * DraggableWindowProps
 */
interface DraggableWindowProps {
  children: React.ReactNode;
  className?: string;
  initialPosition?: { x: number; y: number };
  dragHandleClassName?: string;
}

/**
 * DraggableWindow - A simple draggable window component
 * @param props props
 */
function DraggableWindow(props: DraggableWindowProps) {
  const {
    className = "draggable-window",
    initialPosition,
    dragHandleClassName,
  } = props;

  const [dragging, setDragging] = React.useState<boolean>(false);
  const dragControls = useDragControls();
  const windowRef = React.useRef<HTMLDivElement>(null);
  const constraintsRef = React.useRef<HTMLDivElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);

  // When dragging, set body overflow to hidden to prevent scrolling interference
  // Also disable pointer events on iframes to prevent lag during drag
  React.useEffect(() => {
    if (dragging) {
      document.body.style.overflow = "hidden";

      // Disable pointer events on all iframes within the content during drag
      // This prevents the iframe from repainting during transform, which causes lag
      if (contentRef.current) {
        const iframes = contentRef.current.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
          (iframe as HTMLElement).style.pointerEvents = "none";
        });
      }
    } else {
      document.body.style.overflow = "auto";

      // Re-enable pointer events on iframes after drag ends
      if (contentRef.current) {
        const iframes = contentRef.current.querySelectorAll("iframe");
        iframes.forEach((iframe) => {
          (iframe as HTMLElement).style.pointerEvents = "auto";
        });
      }
    }
  }, [dragging]);

  // Set initial position if provided
  React.useLayoutEffect(() => {
    if (!windowRef.current || !initialPosition) {
      return;
    }

    const windowEle = windowRef.current;
    windowEle.style.transform = `translateX(${initialPosition.x}px) translateY(${initialPosition.y}px) translateZ(0px)`;
  }, [initialPosition]);

  const windowContent = (
    <>
      {/* Constraints container - defines the draggable area */}
      <div
        ref={constraintsRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          pointerEvents: "none",
        }}
      />
      <motion.div
        ref={windowRef}
        drag
        dragMomentum={false}
        dragListener={false}
        dragConstraints={constraintsRef}
        dragControls={dragControls}
        className={className}
        transition={{ type: "tween", duration: 0.3 }}
        style={{
          position: "fixed",
          left: "10px",
          top: "10px",
          zIndex: 10000,
          width: "220px",
          height: "350px",
          willChange: "transform",
          transform: "translateZ(0)",
        }}
      >
        {/* Drag handle - the area that triggers dragging */}
        <div
          className={dragHandleClassName || "draggable-window__header"}
          onPointerDown={(e) => {
            e.preventDefault();
            setDragging(true);
            dragControls.start(e);
          }}
          onPointerUp={() => {
            setDragging(false);
          }}
          onPointerCancel={() => {
            setDragging(false);
          }}
        >
          {/* Optional: Add visual indicator that this is draggable */}
        </div>
        {/* Content */}
        <div
          ref={contentRef}
          className="draggable-window__content"
          style={{
            pointerEvents: dragging ? "none" : "auto",
          }}
        >
          {props.children}
        </div>
      </motion.div>
    </>
  );

  return <Portal isOpen>{windowContent}</Portal>;
}

export default DraggableWindow;
