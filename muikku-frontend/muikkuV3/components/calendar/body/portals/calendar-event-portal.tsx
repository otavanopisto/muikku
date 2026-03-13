import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactElement;
  container?: Element;
  className?: string;
  anchorPosition?: {
    top: number;
    left: number;
  };
};

/**
 * NewEventPortal
 * - renders children into a portal
 * - closes when clicking/tapping outside or pressing Escape
 * @param props props
 */
export default function CalendarNewEventPortal(props: Props) {
  const { isOpen, onClose, children, container, className, anchorPosition } =
    props;
  const hostRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // Create host element once
  if (!hostRef.current) hostRef.current = document.createElement("div");

  useEffect(() => {
    const host = hostRef.current!;
    const mountRoot = container ?? document.body;
    mountRoot.appendChild(host);
    return () => {
      if (host.parentElement) host.parentElement.removeChild(host);
    };
  }, [container]);

  // Click-outside & Escape handling
  useEffect(() => {
    if (!isOpen) return;

    /**
     * Close portal when clicking/tapping outside dialog content
     * @param e pointer event
     */
    function onPointerDown(e: MouseEvent | TouchEvent) {
      if (!contentRef.current) return;
      if (!contentRef.current.contains(e.target as Node)) onClose();
    }

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);

    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const overlayStyle: React.CSSProperties = {
    position: "fixed",
    inset: 0,
    zIndex: 1000,
    display: anchorPosition ? "block" : "flex",
    alignItems: anchorPosition ? undefined : "center",
    justifyContent: anchorPosition ? undefined : "center",
    background: anchorPosition ? "transparent" : "rgba(0,0,0,0.25)",
  };

  const dialogStyle: React.CSSProperties = {
    position: "fixed",
    top: anchorPosition?.top,
    left: anchorPosition?.left,
    background: "white",
    borderRadius: 8,
    padding: 16,
    minWidth: 280,
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
  };

  return ReactDOM.createPortal(
    <div style={overlayStyle} className={className}>
      <div ref={contentRef} role="dialog" aria-modal="true" style={dialogStyle}>
        {children}
      </div>
    </div>,
    hostRef.current
  );
}
