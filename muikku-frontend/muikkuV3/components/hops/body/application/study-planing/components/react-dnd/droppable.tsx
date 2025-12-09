import * as React from "react";
import { useDrop } from "react-dnd";
import { TargetType } from "dnd-core";

/**
 * DroppableProps
 */
interface DroppableProps<T, D> {
  className?: string;
  accept: D[];
  onDrop: (info: T, type: D) => void;
  onHover?: (isOver: boolean, info: T) => void;
  wrapper?: React.ReactElement;
  children: React.ReactNode;
}

/**
 * Droppable component
 * @param props props
 */
const Droppable = <T, D>(props: DroppableProps<T, D>) => {
  const { accept, onDrop, children, className, onHover, wrapper } = props;

  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: accept as TargetType,
    // eslint-disable-next-line jsdoc/require-jsdoc
    drop: (item: { info: T; type: D }) => {
      onDrop(item.info, item.type);
    },
    // eslint-disable-next-line jsdoc/require-jsdoc
    hover: (item: { info: T; type: D }) => {
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
