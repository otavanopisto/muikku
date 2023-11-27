/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";

/**
 * ResizableBoxProps
 */
interface ResizableBoxProps {
  children: React.ReactNode;
}

/**
 * ResizableBox
 * @param props ResizableBoxProps
 * @returns JSX.Element
 */
const ResizableBox = (props: ResizableBoxProps) => {
  const { children } = props;

  const ref = React.useRef<HTMLDivElement>(null);
  const refLeft = React.useRef<HTMLDivElement>(null);
  const refTop = React.useRef<HTMLDivElement>(null);
  const refRight = React.useRef<HTMLDivElement>(null);
  const refBottom = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const resizeableEle = ref.current;
    const styles = window.getComputedStyle(resizeableEle);
    let width = parseInt(styles.width, 10);
    let height = parseInt(styles.height, 10);
    let x = 0;
    let y = 0;

    resizeableEle.style.top = "50px";
    resizeableEle.style.left = "50px";

    // Right resize
    const onMouseMoveRightResize = (e: MouseEvent) => {
      const dx = e.clientX - x;
      x = e.clientX;
      width = width + dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpRightResize = (e: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveRightResize);
    };

    const onMouseDownRightResize = (e: MouseEvent) => {
      x = e.clientX;
      resizeableEle.style.left = styles.left;
      resizeableEle.style.right = null;
      document.addEventListener("mousemove", onMouseMoveRightResize);
      document.addEventListener("mouseup", onMouseUpRightResize);
    };

    // Top resize
    const onMouseMoveTopResize = (e: MouseEvent) => {
      const dy = e.clientY - y;
      height = height - dy;
      y = e.clientY;
      resizeableEle.style.height = `${height}px`;
    };

    const onMouseUpTopResize = (e: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveTopResize);
    };

    const onMouseDownTopResize = (e: MouseEvent) => {
      y = e.clientY;
      const styles = window.getComputedStyle(resizeableEle);
      resizeableEle.style.bottom = styles.bottom;
      resizeableEle.style.top = null;
      document.addEventListener("mousemove", onMouseMoveTopResize);
      document.addEventListener("mouseup", onMouseUpTopResize);
    };

    // Bottom resize
    const onMouseMoveBottomResize = (e: MouseEvent) => {
      const dy = e.clientY - y;
      height = height + dy;
      y = e.clientY;
      resizeableEle.style.height = `${height}px`;
    };

    const onMouseUpBottomResize = (e: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveBottomResize);
    };

    const onMouseDownBottomResize = (e: MouseEvent) => {
      y = e.clientY;
      const styles = window.getComputedStyle(resizeableEle);
      resizeableEle.style.top = styles.top;
      resizeableEle.style.bottom = null;
      document.addEventListener("mousemove", onMouseMoveBottomResize);
      document.addEventListener("mouseup", onMouseUpBottomResize);
    };

    // Left resize
    const onMouseMoveLeftResize = (e: MouseEvent) => {
      const dx = e.clientX - x;
      x = e.clientX;
      width = width - dx;
      resizeableEle.style.width = `${width}px`;
    };

    const onMouseUpLeftResize = (e: MouseEvent) => {
      document.removeEventListener("mousemove", onMouseMoveLeftResize);
    };

    const onMouseDownLeftResize = (e: MouseEvent) => {
      x = e.clientX;
      resizeableEle.style.right = styles.right;
      resizeableEle.style.left = null;
      document.addEventListener("mousemove", onMouseMoveLeftResize);
      document.addEventListener("mouseup", onMouseUpLeftResize);
    };

    // Add mouse down e listener
    const resizerRight = refRight.current;
    resizerRight.addEventListener("mousedown", onMouseDownRightResize);
    const resizerTop = refTop.current;
    resizerTop.addEventListener("mousedown", onMouseDownTopResize);
    const resizerBottom = refBottom.current;
    resizerBottom.addEventListener("mousedown", onMouseDownBottomResize);
    const resizerLeft = refLeft.current;
    resizerLeft.addEventListener("mousedown", onMouseDownLeftResize);

    return () => {
      resizerRight.removeEventListener("mousedown", onMouseDownRightResize);
      resizerTop.removeEventListener("mousedown", onMouseDownTopResize);
      resizerBottom.removeEventListener("mousedown", onMouseDownBottomResize);
      resizerLeft.removeEventListener("mousedown", onMouseDownLeftResize);
    };
  }, []);

  return (
    <div ref={ref} className="resizeable">
      {children}
      <div ref={refLeft} className="resizer resizer-l"></div>
      <div ref={refTop} className="resizer resizer-t"></div>
      <div ref={refRight} className="resizer resizer-r"></div>
      <div ref={refBottom} className="resizer resizer-b"></div>
    </div>
  );
};

export default ResizableBox;
