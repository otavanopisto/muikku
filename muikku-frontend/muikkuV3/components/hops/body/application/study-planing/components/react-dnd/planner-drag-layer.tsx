import * as React from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import {
  PlannedCourseWithIdentifier,
  StudyPlannerNoteWithIdentifier,
} from "~/reducers/hops";
import PlannerPeriodCourseCardPreview from "./planner-period-course-preview";
import PlannerCourseTrayItemPreview from "./planner-course-tray-item-preview";
import PlannerNoteNewPreview from "./planner-note-new-preview";
import PlannerNotePreview from "./planner-note-preview";
import { CourseMatrixModuleEnriched } from "~/@types/course-matrix";

const layerStyles: React.CSSProperties = {
  position: "fixed",
  pointerEvents: "none",
  zIndex: 100,
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
};

/**
 * Get item styles
 * @param initialOffset initial offset
 * @param currentOffset current offset
 * @returns item styles
 */
function getItemStyles(
  initialOffset: XYCoord | null,
  currentOffset: XYCoord | null
) {
  if (!initialOffset || !currentOffset) {
    return {
      display: "none",
    };
  }

  const { x, y } = currentOffset;

  const transform = `translate(${x}px, ${y}px)`;
  return {
    transform,
    WebkitTransform: transform,
    width: "300px", // Adjust based on your card width
  };
}

/**
 * DragLayerProps
 */
interface StudyPlannerDragLayerProps {}

/**
 * Render item
 * @param type type
 * @param item item
 * @returns item
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const renderItem = (type: string, item: any) => {
  switch (type) {
    case "planned-course-card": {
      const course = item.info as PlannedCourseWithIdentifier;
      return <PlannerPeriodCourseCardPreview course={course} />;
    }
    case "planned-course-new": {
      const course = item.info as CourseMatrixModuleEnriched & {
        subjectCode: string;
      };
      return (
        <PlannerCourseTrayItemPreview
          course={course}
          subjectCode={course.subjectCode}
        />
      );
    }

    case "note-card": {
      const note = item.info as StudyPlannerNoteWithIdentifier;
      return <PlannerNotePreview note={note} />;
    }

    case "new-note-card": {
      return <PlannerNoteNewPreview />;
    }
    // Add more cases here for other draggable types
    // case "other-draggable-type":
    //   return (
    //     // render other draggable preview
    //   );
    default:
      return null;
  }
};

/**
 * StudyPlannerDragLayer component
 */
const StudyPlannerDragLayer: React.FC<StudyPlannerDragLayerProps> = () => {
  const { type, isDragging, item, initialOffset, currentOffset } = useDragLayer(
    (monitor) => ({
      item: monitor.getItem(),
      type: monitor.getItemType(),
      initialOffset: monitor.getInitialSourceClientOffset(),
      currentOffset: monitor.getSourceClientOffset(),
      isDragging: monitor.isDragging(),
    })
  );

  if (!isDragging) {
    return null;
  }

  return (
    <div style={layerStyles}>
      <div style={getItemStyles(initialOffset, currentOffset)}>
        {renderItem(type as string, item)}
      </div>
    </div>
  );
};

export default StudyPlannerDragLayer;
