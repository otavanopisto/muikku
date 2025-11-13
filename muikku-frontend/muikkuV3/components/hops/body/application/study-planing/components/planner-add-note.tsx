import * as React from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { PlannerCard, PlannerCardHeader } from "./planner-card";

/**
 * Planner add note props
 */
interface PlannerAddNoteProps {
  disabled: boolean;
  onActivateNewNote?: () => void;
}

/**
 * Planner add note component
 * @param props props
 */
const PlannerAddNote = (props: PlannerAddNoteProps) => {
  const { disabled, onActivateNewNote } = props;

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
  const handleActivateNewNote = () => {
    if (disabled || !onActivateNewNote) {
      return;
    }

    onActivateNewNote();
  };

  const modifiers = [];
  isDragging && modifiers.push("is-dragging");
  disabled ? modifiers.push("not-draggable") : modifiers.push("draggable");

  return (
    <div className="study-planner__add-note">
      <div className="study-planner__add-note-header">
        <h3 className="study-planner__add-note-title">
          Muistiinpanon lisääminen
        </h3>
      </div>
      <div className="study-planner__add-note-content">
        <PlannerCard
          modifiers={["note-new-card"]}
          ref={drag}
          onClick={handleActivateNewNote}
        >
          <PlannerCardHeader modifiers={["course-tray-item"]}>
            <span className="planner-course-tray-item__name">
              <b>{`Uusi muistiinpano`}</b>
            </span>
          </PlannerCardHeader>
        </PlannerCard>
      </div>
    </div>
  );
};

export default PlannerAddNote;
