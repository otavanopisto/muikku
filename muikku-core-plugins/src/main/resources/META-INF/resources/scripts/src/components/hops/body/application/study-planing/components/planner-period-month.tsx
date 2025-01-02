import * as React from "react";
import AnimateHeight from "react-animate-height";
import { Course } from "~/@types/shared";
import Button from "~/components/general/button";
import {
  CourseChangeAction,
  PlannedCourseWithIdentifier,
} from "~/reducers/hops";
import Droppable from "./react-dnd/droppable";
import PlannerPeriodCourseCard from "./planner-period-course";
import { motion, AnimatePresence, LayoutGroup, Variants } from "framer-motion";
import { isPlannedCourse, selectedIsPlannedCourse } from "../helper";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Action, Dispatch } from "redux";
import { connect } from "react-redux";
import {
  updateHopsEditingStudyPlan,
  UpdateHopsEditingStudyPlanTriggerType,
  updateSelectedCourse,
  UpdateSelectedCourseTriggerType,
} from "~/actions/main-function/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import _ from "lodash";

/**
 * PlannerPeriodMonthProps
 */
interface PlannerPeriodMonthProps {
  title: string;
  monthIndex: number;
  year: number;
  courses: PlannedCourseWithIdentifier[];

  //Redux state
  selectedCourse:
    | PlannedCourseWithIdentifier
    | (Course & { subjectCode: string })
    | null;
  originalPlannedCourses: PlannedCourseWithIdentifier[];
  editedPlannedCourses: PlannedCourseWithIdentifier[];
  curriculumConfig: CurriculumConfig;
  updateSelectedCourse: UpdateSelectedCourseTriggerType;
  updateHopsEditingStudyPlan: UpdateHopsEditingStudyPlanTriggerType;
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
    originalPlannedCourses,
    editedPlannedCourses,
    curriculumConfig,
    updateHopsEditingStudyPlan,
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

    // If the selected course is not a planned course, do nothing
    if (selectedIsPlannedCourse(selectedCourse)) {
      // Try to find the course info from the edited planned courses
      const index = editedPlannedCourses.findIndex(
        (c) => c.identifier === selectedCourse.identifier
      );

      if (index === -1) {
        return;
      }

      // Update the course
      updateHopsEditingStudyPlan({
        updatedCourse: {
          ...editedPlannedCourses[index],
          startDate: new Date(year, monthIndex, 1),
        },
        action: "update",
      });
    }
    // Else means that the course does not exist in the planned list and must be added as new one
    else {
      updateHopsEditingStudyPlan({
        updatedCourse: curriculumConfig.strategy.createPlannedCourse(
          selectedCourse,
          new Date(year, monthIndex, 1)
        ),
        action: "add",
      });
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
      updatedCourse = curriculumConfig.strategy.createPlannedCourse(
        course,
        new Date(year, monthIndex, 1)
      );

      action = "add";
    }

    updateHopsEditingStudyPlan({
      updatedCourse,
      action,
    });
  };

  /**
   * Handles course change
   * @param course course
   * @param action action
   */
  const handleCourseChange = (
    course: PlannedCourseWithIdentifier,
    action: CourseChangeAction
  ) => {
    updateHopsEditingStudyPlan({
      updatedCourse: course,
      action,
    });
  };

  /**
   * Handles course select
   * @param course course
   */
  const handleSelectCourse = (course: PlannedCourseWithIdentifier) => {
    if (course === null) {
      updateSelectedCourse(null);
    } else {
      updateSelectedCourse({ course });
    }
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

  // Check if selected course is planned and in month already
  const selectedCourseIsInMonth =
    selectedCourse && selectedIsPlannedCourse(selectedCourse)
      ? courses.some(
          (course) => course.identifier === selectedCourse.identifier
        )
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
                  ? courses.map((course) => {
                      // Check if the course is selected
                      const isSelected =
                        selectedCourse &&
                        selectedIsPlannedCourse(selectedCourse) &&
                        selectedCourse.identifier === course.identifier;

                      // Find the original course info
                      const originalInfo = originalPlannedCourses.find(
                        (c) => c.identifier === course.identifier
                      );

                      // Check if there are any unsaved changes
                      const hasChanges =
                        originalInfo && !_.isEqual(originalInfo, course);

                      // Check if the course is new
                      const isNew = !originalInfo;

                      return (
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
                            selected={isSelected}
                            hasChanges={hasChanges || isNew}
                            curriculumConfig={curriculumConfig}
                            onCourseChange={handleCourseChange}
                            onSelectCourse={handleSelectCourse}
                          />
                        </motion.div>
                      );
                    })
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
    originalPlannedCourses: state.hopsNew.hopsStudyPlanState.plannedCourses,
    editedPlannedCourses: state.hopsNew.hopsEditing.plannedCourses,
    selectedCourse: state.hopsNew.hopsEditing.selectedCourse,
    curriculumConfig: state.hopsNew.hopsCurriculumConfig,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { updateSelectedCourse, updateHopsEditingStudyPlan },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PlannerPeriodMonth);
