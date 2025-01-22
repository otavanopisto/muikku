import * as React from "react";
import AnimateHeight from "react-animate-height";
import Button, { IconButton } from "~/components/general/button";
import {
  CourseChangeAction,
  isPlannedCourseWithIdentifier,
  PlannedCourseWithIdentifier,
  SelectedCourse,
  TimeContextSelection,
} from "~/reducers/hops";
import PlannerPeriodCourseCard from "./planner-period-course";
import { motion, AnimatePresence, LayoutGroup, Variants } from "framer-motion";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { Action, Dispatch } from "redux";
import { connect } from "react-redux";
import {
  clearSelectedCourses,
  ClearSelectedCoursesTriggerType,
  updateEditingStudyPlanBatch,
  UpdateEditingStudyPlanBatchTriggerType,
  updateHopsEditingStudyPlan,
  UpdateHopsEditingStudyPlanTriggerType,
  updateSelectedCourses,
  UpdateSelectedCoursesTriggerType,
  updateTimeContextSelection,
  UpdateTimeContextSelectionTriggerType,
} from "~/actions/main-function/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import _ from "lodash";
import moment from "moment";
import PlannerMonthEditDialog from "./planner-month-edit";
import Droppable from "../react-dnd/droppable";
import { Course } from "~/@types/shared";
import { isPlannedCourse } from "../../helper";
import { HopsOpsCourse, StudentStudyActivity } from "~/generated/client";

/**
 * PlannerPeriodMonthProps
 */
interface MobilePlannerPeriodMonthProps {
  title: string;
  monthIndex: number;
  year: number;
  courses: PlannedCourseWithIdentifier[];

  //Redux state
  timeContextSelection: TimeContextSelection;
  originalPlannedCourses: PlannedCourseWithIdentifier[];
  editedPlannedCourses: PlannedCourseWithIdentifier[];
  curriculumConfig: CurriculumConfig;
  selectedCourses: SelectedCourse[];
  studyActivity: StudentStudyActivity[];
  studyOptions: string[];
  availableOPSCourses: HopsOpsCourse[];
  updateHopsEditingStudyPlan: UpdateHopsEditingStudyPlanTriggerType;
  updateTimeContextSelection: UpdateTimeContextSelectionTriggerType;
  updateSelectedCourses: UpdateSelectedCoursesTriggerType;
  clearSelectedCourses: ClearSelectedCoursesTriggerType;
  updateEditingStudyPlanBatch: UpdateEditingStudyPlanBatchTriggerType;
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
 * MobilePlannerPeriodMonth component
 * @param props props
 */
const MobilePlannerPeriodMonth: React.FC<MobilePlannerPeriodMonthProps> = (
  props
) => {
  const {
    monthIndex,
    title,
    year,
    courses,
    originalPlannedCourses,
    curriculumConfig,
    selectedCourses,
    editedPlannedCourses,
    studyActivity,
    studyOptions,
    availableOPSCourses,
    updateHopsEditingStudyPlan,
    updateSelectedCourses,
    clearSelectedCourses,
    updateEditingStudyPlanBatch,
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
  const handleMoveCoursesHereClick = () => {
    // If there is no selected course, do nothing
    if (!selectedCourses.length) {
      return;
    }

    const plannedCourses = selectedCourses.map((course) => {
      if (isPlannedCourseWithIdentifier(course)) {
        return {
          ...course,
          startDate: moment(new Date(year, monthIndex, 1)).format("YYYY-MM-DD"),
        };
      }

      return {
        ...curriculumConfig.strategy.createPlannedCourse(
          course,
          new Date(year, monthIndex, 1)
        ),
      };
    });

    // Create a map of the new/updated courses by identifier for efficient lookup
    const plannedCoursesMap = new Map(
      plannedCourses.map((course) => [course.identifier, course])
    );

    // Update existing courses and keep unchanged ones
    const updatedList = editedPlannedCourses.map(
      (course) => plannedCoursesMap.get(course.identifier) || course
    );

    // Add any new courses that didn't exist in the original list
    const newCourses = plannedCourses.filter(
      (course) =>
        !editedPlannedCourses.some(
          (existing) => existing.identifier === course.identifier
        )
    );

    // Update the editing study plan with batch thunk
    updateEditingStudyPlanBatch({
      plannedCourses: [...updatedList, ...newCourses],
    });

    // Clear the selected course
    clearSelectedCourses();
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
    updateSelectedCourses({ course });
  };

  /**
   * Handles month edit confirm
   * @param selectedCourses selected courses
   */
  const handleMonthEditConfirm = (selectedCourses: SelectedCourse[]) => {
    const plannedCourses = selectedCourses.map((course) => {
      if (isPlannedCourseWithIdentifier(course)) {
        return {
          ...course,
          startDate: moment(new Date(year, monthIndex, 1)).format("YYYY-MM-DD"),
        };
      }

      return {
        ...curriculumConfig.strategy.createPlannedCourse(
          course,
          new Date(year, monthIndex, 1)
        ),
      };
    });

    // Get courses that should be removed (courses in this month that aren't in the new selection)
    const coursesToRemove = new Set(courses.map((course) => course.identifier));

    // Remove identifiers of courses that are staying
    plannedCourses.forEach((course) => {
      coursesToRemove.delete(course.identifier);
    });

    // Create the updated full course list:
    // 1. Start with all existing courses except those from this month
    // 2. Add the new/updated courses for this month
    const updatedFullCourseList = [
      ...editedPlannedCourses.filter((course) => {
        // Keep courses that aren't in this month and aren't marked for removal
        const courseMonth = moment(course.startDate).month();
        const courseYear = moment(course.startDate).year();
        return !(courseMonth === monthIndex && courseYear === year);
      }),
      ...plannedCourses, // Add all new/updated courses for this month
    ];

    // Update the editing study plan with batch thunk
    updateEditingStudyPlanBatch({
      plannedCourses: updatedFullCourseList,
    });
  };

  /**
   * Handles drop
   * @param course course
   * @param type type
   */
  const handleDrop = (course: SelectedCourse, type: string) => {
    let updatedCourse: PlannedCourseWithIdentifier;

    let action: CourseChangeAction = "add";

    if (isPlannedCourseWithIdentifier(course)) {
      // Set start date to the month number and year
      const updatedStartDate = new Date(course.startDate);
      updatedStartDate.setMonth(monthIndex);
      updatedStartDate.setFullYear(year);

      updatedCourse = {
        ...course,
        startDate: moment(updatedStartDate).format("YYYY-MM-DD"),
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
  );

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

  // Pulse dropzone if there are selected courses or the drop indicator is shown
  const pulseDropzone = selectedCourses.length > 0 || showDropIndicator;

  return (
    <motion.div layout className="study-planner__month">
      <motion.div layout="position" className="study-planner__month-header">
        <Button
          iconPosition="left"
          icon={isExpanded ? "arrow-down" : "arrow-right"}
          buttonModifiers={["study-planner-month-toggle"]}
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

        <PlannerMonthEditDialog
          onConfirm={handleMonthEditConfirm}
          plannedCourses={editedPlannedCourses}
          curriculumConfig={curriculumConfig}
          timeContext={new Date(year, monthIndex, 1)}
          currentSelection={courses}
          studyActivity={studyActivity}
          availableOPSCourses={availableOPSCourses}
          studyOptions={studyOptions}
        >
          <IconButton
            icon="plus"
            buttonModifiers={["study-planner-month-selection"]}
          />
        </PlannerMonthEditDialog>
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
                      const isSelected = selectedCourses.some(
                        (c) =>
                          isPlannedCourseWithIdentifier(c) &&
                          c.identifier === course.identifier
                      );

                      // Find the original course info
                      const originalInfo = originalPlannedCourses.find(
                        (c) => c.identifier === course.identifier
                      );

                      const courseActivity = studyActivity.find(
                        (sa) =>
                          sa.courseNumber === course.courseNumber &&
                          sa.subject === course.subjectCode
                      );

                      // Check if there are any unsaved changes
                      const hasChanges =
                        originalInfo && !_.isEqual(originalInfo, course);

                      // Check if the course is new
                      const isNew = !originalInfo;

                      return (
                        <motion.div
                          key={course.identifier}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.4 }}
                          layout="position"
                        >
                          <PlannerPeriodCourseCard
                            course={course}
                            selected={isSelected}
                            hasChanges={hasChanges || isNew}
                            curriculumConfig={curriculumConfig}
                            studyActivity={courseActivity}
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
                onClick={handleMoveCoursesHereClick}
                className="study-planner__month-dropzone"
              />
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
    timeContextSelection: state.hopsNew.hopsEditing.timeContextSelection,
    curriculumConfig: state.hopsNew.hopsCurriculumConfig,
    selectedCourses: state.hopsNew.hopsEditing.selectedCourses,
    studyActivity: state.hopsNew.hopsStudyPlanState.studyActivity,
    availableOPSCourses: state.hopsNew.hopsStudyPlanState.availableOPSCourses,
    studyOptions: state.hopsNew.hopsStudyPlanState.studyOptions,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateTimeContextSelection,
      updateHopsEditingStudyPlan,
      updateSelectedCourses,
      clearSelectedCourses,
      updateEditingStudyPlanBatch,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MobilePlannerPeriodMonth);
