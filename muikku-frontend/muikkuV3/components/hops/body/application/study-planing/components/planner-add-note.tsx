import * as React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { PlannerCard, PlannerCardHeader } from "./planner-card";

/**
 * Planner add note props
 */
interface PlannerAddNoteProps {
  disabled: boolean;
  activated: boolean;
  onActivateNewNote: () => void;
}

/**
 * Planner add note component
 * @param props props
 */
const PlannerAddNote = (props: PlannerAddNoteProps) => {
  const { disabled, activated, onActivateNewNote } = props;

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "new-note-card",
      item: {
        info: {
          type: "note-new",
        },
        type: "new-note-card",
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      // eslint-disable-next-line jsdoc/require-jsdoc
      canDrag: !disabled,
    }),
    [disabled]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * Handles activate new note
   */
  const handleActivateNewNoteClick = () => {
    if (disabled) {
      return;
    }

    onActivateNewNote();
  };

  const modifiers = ["tray-card", "note"];
  isDragging && modifiers.push("is-dragging");
  activated && modifiers.push("selected");
  disabled ? modifiers.push("not-draggable") : modifiers.push("draggable");

  return (
    <div className="study-planner__action-tray">
      <PlannerCard
        modifiers={modifiers}
        ref={drag}
        onClick={handleActivateNewNoteClick}
      >
        <PlannerCardHeader>
          <span className="planner-course-tray-item__name">
            {`Uusi muistiinpano`}
          </span>
        </PlannerCardHeader>
      </PlannerCard>
    </div>
  );
};

export default PlannerAddNote;
