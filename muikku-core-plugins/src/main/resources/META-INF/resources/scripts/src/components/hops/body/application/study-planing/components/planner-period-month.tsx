import * as React from "react";
import AnimateHeight from "react-animate-height";
import { Course } from "~/@types/shared";
import Button from "~/components/general/button";
import {
  CourseChangeAction,
  PlannedCourseWithIdentifier,
  SelectedCourse,
} from "~/reducers/hops";
import Droppable from "./react-dnd/droppable";
import { PlannerPeriodProps } from "./planner-period";
import PlannerPeriodCourseCard from "./planner-period-course";
import { motion, AnimatePresence, LayoutGroup, Variants } from "framer-motion";
import { isPlannedCourse } from "../helper";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Action, Dispatch } from "redux";
import { connect } from "react-redux";
import {
  updateSelectedCourse,
  UpdateSelectedCourseTriggerType,
} from "~/actions/main-function/hops";

/**
 * PlannerPeriodMonthProps
 */
interface PlannerPeriodMonthProps {
  title: string;
  monthIndex: number;
  year: number;
  courses: PlannedCourseWithIdentifier[];
  onCourseChange: PlannerPeriodProps["onCourseChange"];

  //Redux state
  selectedCourse: SelectedCourse;
  editedPlannedCourses: PlannedCourseWithIdentifier[];
  updateSelectedCourse: UpdateSelectedCourseTriggerType;
}

const dropZoneVariants: Variants = {
  initial: {
    opacity: 0.6,
    scale: 1,
  },
  dropIsActive: {
    opacity: [0.6, 1, 0.6],
    scale: [1, 1.02, 1],
    transition: {
      duration: 1.5,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

/**
 * PlannerPeriodMonth component
 * @param props props
 */
const PlannerPeriodMonth: React.FC<PlannerPeriodMonthProps> = (props) => {
  const {
    monthIndex,
    title,
    year,
    courses,
    selectedCourse,
    editedPlannedCourses,
    onCourseChange,
    updateSelectedCourse,
  } = props;

  const [isExpanded, setIsExpanded] = React.useState(true);
  const [showDropIndicator, setShowDropIndicator] = React.useState(false);

  // Create a ref to always have access to latest courses
  const coursesRef = React.useRef(courses);

  // Keep the ref updated
  React.useEffect(() => {
    coursesRef.current = courses;
  }, [courses]);

  /**
   * Handles month toggle
   */
  const handleMonthToggle = () => {
    setIsExpanded(!isExpanded);
  };

  /**
   * Handles move course here click
   */
  const handleMoveCourseHereClick = () => {
    // If there is no selected course, do nothing
    if (!selectedCourse) {
      return;
    }

    // Try to find the course info from the edited planned courses
    const courseInfo = editedPlannedCourses.find(
      (c) => c.identifier === selectedCourse.identifier
    );

    // If the course info is found, update the course
    if (courseInfo) {
      onCourseChange(
        {
          ...courseInfo,
          startDate: new Date(year, monthIndex, 1),
        },
        "update"
      );
    }
    // Else means that the course does not exist in the planned list and must be added as new one
    else {
      onCourseChange(
        {
          identifier: "planned-course-" + new Date().getTime(),
          id: new Date().getTime(),
          name: selectedCourse.name,
          courseNumber: selectedCourse.courseNumber,
          length: selectedCourse.length,
          lengthSymbol: "op",
          subjectCode: selectedCourse.subjectCode,
          mandatory: selectedCourse.mandatory,
          startDate: new Date(year, monthIndex, 1),
        },
        "add"
      );
    }

    // Clear the selected course
    updateSelectedCourse(null);
  };

  /**
   * Handles drop
   * @param course course
   * @param type type
   */
  const handleDrop = (
    course: PlannedCourseWithIdentifier | (Course & { subjectCode: string }),
    type: string
  ) => {
    let updatedCourse: PlannedCourseWithIdentifier;

    let action: CourseChangeAction = "add";

    if (isPlannedCourse(course)) {
      // Set start date to the month number and year
      const updatedStartDate = new Date(course.startDate);
      updatedStartDate.setMonth(monthIndex);
      updatedStartDate.setFullYear(year);

      updatedCourse = {
        ...course,
        startDate: updatedStartDate,
      };

      action = "update";
    } else {
      updatedCourse = {
        identifier: "planned-course-" + new Date().getTime(),
        id: new Date().getTime(),
        name: course.name,
        courseNumber: course.courseNumber,
        length: course.length,
        lengthSymbol: "op",
        subjectCode: course.subjectCode,
        mandatory: course.mandatory,
        startDate: new Date(year, monthIndex, 1),
      };

      action = "add";
    }

    onCourseChange(updatedCourse, action);
  };

  /**
   * Finds if the course is already in the droppable area
   * @param course course
   * @returns true if the course is already in the droppable area
   */
  const isAlreadyInMonth = React.useCallback(
    (
      course: PlannedCourseWithIdentifier | (Course & { subjectCode: string })
    ) => {
      // Use coursesRef.current instead of courses
      if (isPlannedCourse(course)) {
        return coursesRef.current.some(
          (c) => c.identifier === course.identifier
        );
      }
      return false;
    },
    []
  ); // No dependencies needed since we're using ref

  /**
   * Handles drop hover
   * @param isOver is over
   * @param course course
   */
  const handleDropHover = React.useCallback(
    (
      isOver: boolean,
      course: PlannedCourseWithIdentifier | (Course & { subjectCode: string })
    ) => {
      if (isOver && !isAlreadyInMonth(course)) {
        setShowDropIndicator(true);
      } else {
        setShowDropIndicator(false);
      }
    },
    [isAlreadyInMonth]
  );

  // Check if selected course is in month already
  const selectedCourseIsInMonth = selectedCourse
    ? courses.some((course) => course.identifier === selectedCourse.identifier)
    : false;

  // Pulse dropzone if selected course is not in month or drop indicator is shown
  const pulseDropzone =
    (selectedCourse && !selectedCourseIsInMonth) || showDropIndicator;

  return (
    <motion.div layout className="study-planner__month">
      <motion.div layout="position" className="study-planner__month-header">
        <Button
          iconPosition="left"
          icon={isExpanded ? "arrow-down" : "arrow-right"}
          buttonModifiers={["planner-month-toggle"]}
          onClick={handleMonthToggle}
        >
          {title}
          <AnimatePresence>
            {showDropIndicator && (
              <motion.span
                className="drop-indicator"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </motion.div>

      <AnimateHeight height={isExpanded ? "auto" : 0}>
        <Droppable<
          PlannedCourseWithIdentifier | (Course & { subjectCode: string })
        >
          accept={["planned-course-card", "new-course-card"]}
          onDrop={handleDrop}
          onHover={handleDropHover}
          className="study-planner__month-content"
        >
          <LayoutGroup id={`month-${monthIndex}-${year}`}>
            <motion.div
              className="study-planner__month-courses"
              layout="position"
              initial={false}
              transition={{
                layout: { duration: 0.3, ease: "easeInOut" },
              }}
            >
              <AnimatePresence initial={false}>
                {courses.length > 0
                  ? courses.map((course) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.4 }}
                        layout
                      >
                        <PlannerPeriodCourseCard
                          course={course}
                          selected={
                            selectedCourse &&
                            selectedCourse.identifier === course.identifier
                          }
                          onCourseChange={onCourseChange}
                        />
                      </motion.div>
                    ))
                  : null}
              </AnimatePresence>
              <motion.div
                layout="position"
                animate={pulseDropzone ? "dropIsActive" : "initial"}
                variants={dropZoneVariants}
                className="study-planner__month-dropzone"
              >
                <i className="muikku-icon-drag-handle" />
                <span onClick={handleMoveCourseHereClick}>
                  Siirrä kursseja tähän raahamalla tai klikkaamalla tästä, kun
                  kurssi on valittu
                </span>
              </motion.div>
            </motion.div>
          </LayoutGroup>
        </Droppable>
      </AnimateHeight>
    </motion.div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    editedPlannedCourses: state.hopsNew.hopsEditing.plannedCourses,
    selectedCourse: state.hopsNew.hopsEditing.selectedCourse,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ updateSelectedCourse }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(PlannerPeriodMonth);
