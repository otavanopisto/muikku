import * as React from "react";
import { useDrop } from "react-dnd";

/**
 * DroppableProps
 */
interface DroppableProps<T> {
  className?: string;
  accept: string[];
  onDrop: (info: T, type: string) => void;
  onHover?: (isOver: boolean, info: T) => void;
  wrapper?: React.ReactElement;
  children: React.ReactNode;
}

/**
 * Droppable component
 * @param props props
 */
const Droppable = <T,>(props: DroppableProps<T>) => {
  const { accept, onDrop, children, className, onHover, wrapper } = props;

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: accept,
    // eslint-disable-next-line jsdoc/require-jsdoc
    drop: (item: { info: T; type: string }) => {
      onDrop(item.info, item.type);
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    hover: (item: { info: T; type: string }) => {
      if (onHover) {
        onHover(true, item.info);
      }
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    collect: (monitor) => {
      const isOverNow = monitor.isOver();

      if (onHover) {
        onHover(isOverNow, monitor?.getItem()?.info || null);
      }
      return {
        isOver: isOverNow,
        canDrop: monitor.canDrop(),
      };
    },
  }));

  const isActive = canDrop && isOver;

  if (wrapper) {
    return React.cloneElement(wrapper, {
      ref: drop,
      className: `${className} ${isActive ? "is-active" : ""}`,
      children: children,
    });
  }

  return (
    <div ref={drop} className={`${className} ${isActive ? "is-active" : ""}`}>
      {children}
    </div>
  );
};

export default Droppable;
