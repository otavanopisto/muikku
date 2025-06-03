import * as React from "react";
import { XYCoord, useDragLayer } from "react-dnd";
import { Course } from "~/@types/shared";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import PlannerPeriodCourseCardPreview from "./planner-period-course-preview";
import PlannerCourseTrayItemPreview from "./planner-course-tray-item-preview";

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
    case "new-course-card": {
      const course = item.info as Course & { subjectCode: string };
      return (
        <PlannerCourseTrayItemPreview
          course={course}
          subjectCode={course.subjectCode}
        />
      );
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
 * CourseDragLayer component
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
