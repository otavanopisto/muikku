import * as React from "react";
import type { Identifier, XYCoord } from "dnd-core";
import type { FC } from "react";
import { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { IconButton } from "../button";
import "~/sass/elements/draggable-element.scss";

export const ItemTypes = {
  CARD: "card",
};

/**
 * CardProps
 */
export interface DraggableElementProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  id: any;
  index: number;
  active: boolean;
  onElementDrag: (dragIndex: number, hoverIndex: number) => void;
  onElementDrop: (dragIndex: number, hoverIndex: number) => void;
}

/**
 * DragItem
 */
interface DraggableElementItem {
  index: number;
  id: string;
  type: string;
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const DraggableElement: FC<DraggableElementProps> = ({
  id,
  children,
  index,
  onElementDrag,
  onElementDrop,
  active,
}) => {
  const previewRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<HTMLDivElement>(null);

  React.useLayoutEffect(() => {
    if (active && dragRef.current) {
      dragRef.current.style.width = "40px";
    } else {
      dragRef.current.style.width = "0px";
    }
  }, [active]);

  const [{ opacity }, drag, preview] = useDrag({
    type: ItemTypes.CARD,
    // eslint-disable-next-line jsdoc/require-jsdoc
    item: { type: ItemTypes.CARD, id, index },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, jsdoc/require-jsdoc
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.4 : 1,
    }),

    // eslint-disable-next-line jsdoc/require-jsdoc
    canDrag: () => active,
  });

  const [{ handlerId }, drop] = useDrop<
    DraggableElementItem,
    void,
    { handlerId: Identifier | null }
  >({
    accept: ItemTypes.CARD,

    // eslint-disable-next-line jsdoc/require-jsdoc
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },

    // eslint-disable-next-line jsdoc/require-jsdoc
    hover(item, monitor) {
      if (!previewRef.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = previewRef.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      onElementDrag(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },

    // eslint-disable-next-line jsdoc/require-jsdoc
    /* drop: (item: DraggableElementItem, monitor) => {
      if (monitor.canDrop()) {
        console.log("drop");
        onElementDrop(item.index, index);
      }
    }, */
  });

  drag(dragRef);
  drop(dragRef);

  preview(previewRef);

  return (
    <div className="draggable-element">
      <div
        ref={dragRef}
        className="draggable-element__handle swiper-no-swiping"
      >
        <IconButton
          icon="move"
          buttonModifiers={["notebook-item-action", "notebook-drag-handle"]}
        />
      </div>
      <div
        className="draggable-element__body"
        ref={previewRef}
        style={{ opacity }}
        data-handler-id={handlerId}
      >
        {children}
      </div>
    </div>
  );
};
