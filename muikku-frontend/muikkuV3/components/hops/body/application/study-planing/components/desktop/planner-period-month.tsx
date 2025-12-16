import * as React from "react";
import {
  StudyPlanChangeAction,
  PlannedCourseWithIdentifier,
  PlannerActivityItem,
  SelectedItem,
  StudyPlannerNoteWithIdentifier,
  DroppableCardType,
  PlannedCourseNew,
  StudyPlannerNoteNew,
} from "~/reducers/hops";
import Droppable from "../react-dnd/droppable";
import { AnimatePresence, motion, Variants } from "framer-motion";
import {
  isDragDropItemStudyPlannerNote,
  isDragDropItemPlannedCourse,
  isSelectedItemPlannedCourse,
  isSelectedItemStudyPlannerNote,
  isSelectedItemStudyPlannerNoteNew,
} from "../../helper";
import { StateType } from "~/reducers";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSelectedItems,
  updateEditingStudyPlanBatch,
  updateHopsEditingPlanNotes,
  updateHopsEditingStudyPlan,
  updateSelectedPlanItem,
} from "~/actions/main-function/hops";
import { AnimatedDrawer } from "../Animated-drawer";
import PlannerPlannedList from "../planner-planned-list";
import Button from "~/components/general/button";
import PlannerActivityList from "../planner-activity-list";
import PlannerNotesList from "../planner-notes-list";
import { v4 as uuidv4 } from "uuid";

/**
 * PlannerPeriodMonthProps
 */
interface PlannerPeriodMonthProps {
  title: string;
  monthIndex: number;
  year: number;
  courses: PlannedCourseWithIdentifier[];
  activities: PlannerActivityItem[];
  notes: StudyPlannerNoteWithIdentifier[];
  disabled: boolean;
  isPast: boolean;
}

const dropZoneVariants: Variants = {
  initial: {
    opacity: 0.7,
  },
  dropIsActive: {
    opacity: [0.7, 1, 0.7],
    transition: {
      duration: 2.0,
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
    activities,
    notes,
    disabled,
    isPast,
  } = props;

  // Selectors
  const { hopsMode, hopsCurriculumConfig: curriculumConfig } = useSelector(
    (state: StateType) => state.hopsNew
  );
  const {
    plannedCourses: originalPlannedCourses,
    planNotes: originalPlanNotes,
    studyActivity,
  } = useSelector((state: StateType) => state.hopsNew.hopsStudyPlanState);
  const {
    plannedCourses: editedPlannedCourses,
    planNotes: editedPlanNotes,
    selectedPlanItemIds,
  } = useSelector((state: StateType) => state.hopsNew.hopsEditing);

  // Dispatch
  const dispatch = useDispatch();

  // State
  const [isExpanded, setIsExpanded] = React.useState(true);
  const [showDropIndicator, setShowDropIndicator] = React.useState(false);

  const items = React.useMemo(() => [...courses, ...notes], [courses, notes]);

  // Create a ref to always have access to latest courses
  const itemsRef = React.useRef(items);

  // Keep the ref updated
  React.useEffect(() => {
    itemsRef.current = items;
  }, [items]);

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
    if (!selectedPlanItemIds.length || disabled || isPast) {
      return;
    }

    const targetDate = new Date(year, monthIndex, 1);
    targetDate.setMinutes(-targetDate.getTimezoneOffset());

    const selectedCourseIds: string[] = [];
    const selectedNoteIds: string[] = [];

    for (const identifier of selectedPlanItemIds) {
      if (
        identifier.startsWith("ops-course-") ||
        identifier.startsWith("planned-course-")
      ) {
        selectedCourseIds.push(identifier);
      } else if (
        identifier.startsWith("plan-note-") ||
        identifier === "new-note-card"
      ) {
        selectedNoteIds.push(identifier);
      } else {
        continue;
      }
    }

    // Check if this is an existing planned course
    // Update the date for existing planned course
    // If not found in planned courses, it must be a new course from tray
    // Find the course in curriculum config and create a new planned course
    const updatedPlannedCourses = selectedCourseIds
      .map((courseIdentifier) => {
        const existingPlannedCourse = editedPlannedCourses.find(
          (course) => course.identifier === courseIdentifier
        );

        if (existingPlannedCourse) {
          return {
            ...existingPlannedCourse,
            startDate: targetDate,
          };
        }

        const courseFromTray =
          curriculumConfig.strategy.findCourseByIdentifier(courseIdentifier);

        if (!courseFromTray) {
          return null;
        }

        return {
          ...curriculumConfig.strategy.createPlannedCourse(
            courseFromTray,
            targetDate
          ),
        };
      })
      .filter((c) => c !== null);

    // Same for notes as above
    const updatedPlanNotes =
      selectedNoteIds.map<StudyPlannerNoteWithIdentifier>((noteIdentifier) => {
        const existingPlanNote = editedPlanNotes.find(
          (note) => note.identifier === noteIdentifier
        );

        if (existingPlanNote) {
          return {
            ...existingPlanNote,
            startDate: targetDate,
          };
        }

        return {
          id: null,
          title: "Muistiinpanon otsikko",
          identifier: `plan-note-${uuidv4()}`,
          startDate: targetDate,
        };
      });

    // Create a map of the new/updated courses/notes separately by identifier for efficient lookup
    const plannedCoursesMap = new Map(
      updatedPlannedCourses.map((course) => [course.identifier, course])
    );
    const planNotesMap = new Map(
      updatedPlanNotes.map((note) => [note.identifier, note])
    );

    // Update existing courses and notes and keep unchanged ones
    const updatedList = editedPlannedCourses.map(
      (course) => plannedCoursesMap.get(course.identifier) || course
    );
    const updatedNotes = editedPlanNotes.map(
      (note) => planNotesMap.get(note.identifier) || note
    );

    // Add any new courses/notes that didn't exist in the original lists
    const newCourses = updatedPlannedCourses.filter(
      (course) =>
        !editedPlannedCourses.some(
          (existing) => existing.identifier === course.identifier
        )
    );
    const newNotes = updatedPlanNotes.filter(
      (note) =>
        !editedPlanNotes.some(
          (existing) => existing.identifier === note.identifier
        )
    );

    // Update the editing study plan with batch thunk
    dispatch(
      updateEditingStudyPlanBatch({
        plannedCourses: [...updatedList, ...newCourses],
        planNotes: [...updatedNotes, ...newNotes],
      })
    );

    // Clear the selected course
    dispatch(clearSelectedItems());
  };

  /**
   * Updates or adds a note
   * @param item item
   */
  const updateOrAddNote = (
    item: StudyPlannerNoteWithIdentifier | StudyPlannerNoteNew
  ) => {
    let action: StudyPlanChangeAction = "add";
    let updatedNote: StudyPlannerNoteWithIdentifier;

    const newDate = new Date(year, monthIndex, 1);
    newDate.setMinutes(-newDate.getTimezoneOffset());

    if (isSelectedItemStudyPlannerNote(item)) {
      action = "update";
      updatedNote = {
        ...item,
        startDate: newDate,
      };
    } else {
      updatedNote = {
        id: null,
        title: "Muistiinpanon otsikko",
        identifier: `plan-note-${uuidv4()}`,
        startDate: newDate,
      };
    }

    dispatch(
      updateHopsEditingPlanNotes({
        updatedNote,
        action,
      })
    );
  };

  /**
   * Updates or adds a course
   * @param item item
   */
  const updateOrAddCourse = (
    item: PlannedCourseWithIdentifier | PlannedCourseNew
  ) => {
    let updatedCourse: PlannedCourseWithIdentifier;
    let action: StudyPlanChangeAction = "add";

    const newDate = new Date(year, monthIndex, 1);
    newDate.setMinutes(-newDate.getTimezoneOffset());

    if (isSelectedItemPlannedCourse(item)) {
      action = "update";
      updatedCourse = {
        ...item,
        startDate: newDate,
      };
    } else {
      updatedCourse = curriculumConfig.strategy.createPlannedCourse(
        item,
        newDate
      );
    }

    dispatch(
      updateHopsEditingStudyPlan({
        updatedCourse,
        action,
      })
    );
  };

  /**
   * Handles drop
   * @param item item
   * @param type type
   */
  const handleDrop = (item: SelectedItem, type: DroppableCardType) => {
    if (
      isSelectedItemStudyPlannerNoteNew(item) ||
      isSelectedItemStudyPlannerNote(item)
    ) {
      updateOrAddNote(item);
    } else {
      updateOrAddCourse(item);
    }
  };

  /**
   * Handles course change
   * @param course course
   * @param action action
   */
  const handleCourseChange = (
    course: PlannedCourseWithIdentifier,
    action: StudyPlanChangeAction
  ) => {
    dispatch(
      updateHopsEditingStudyPlan({
        updatedCourse: course,
        action,
      })
    );
  };

  /**
   * Handles note change
   * @param note note
   * @param action action
   */
  const handleNoteChange = (
    note: StudyPlannerNoteWithIdentifier,
    action: StudyPlanChangeAction
  ) => {
    dispatch(updateHopsEditingPlanNotes({ updatedNote: note, action }));
  };

  /**
   * Handles course select
   * @param course course
   */
  const handleSelectCourse = (course: PlannedCourseWithIdentifier) => {
    dispatch(updateSelectedPlanItem({ planItemIdentifier: course.identifier }));
  };

  /**
   * Handles note select
   * @param note note
   */
  const handleSelectNote = (note: StudyPlannerNoteWithIdentifier) => {
    dispatch(updateSelectedPlanItem({ planItemIdentifier: note.identifier }));
  };

  /**
   * Finds if the course is already in the droppable area
   * @param item item
   * @returns true if the course is already in the droppable area
   */
  const isAlreadyInMonth = React.useCallback(
    (
      item:
        | PlannedCourseWithIdentifier
        | PlannedCourseNew
        | StudyPlannerNoteNew
        | StudyPlannerNoteWithIdentifier
    ) => {
      // Use coursesRef.current instead of courses
      if (
        isDragDropItemPlannedCourse(item) ||
        isDragDropItemStudyPlannerNote(item)
      ) {
        return itemsRef.current.some((c) => c.identifier === item.identifier);
      }
      return false;
    },
    []
  ); // No dependencies needed since we're using ref

  /**
   * Handles drop hover
   * @param isOver is over
   * @param item item
   */
  const handleDropHover = React.useCallback(
    (
      isOver: boolean,
      item:
        | PlannedCourseWithIdentifier
        | PlannedCourseNew
        | StudyPlannerNoteNew
        | StudyPlannerNoteWithIdentifier
    ) => {
      if (isOver && !isAlreadyInMonth(item)) {
        setShowDropIndicator(true);
      } else {
        setShowDropIndicator(false);
      }
    },
    [isAlreadyInMonth]
  );

  const isDisabled = hopsMode === "READ" || disabled;

  // Pulse dropzone if there are selected courses or the drop indicator is shown
  // and the period is not past
  const pulseDropzone =
    !isPast && (selectedPlanItemIds.length > 0 || showDropIndicator);

  return (
    <div className="study-planner__month">
      <div className="study-planner__month-header">
        <Button
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
                animate={{ opacity: 1, scale: 1.2 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
              >
                +
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>

      <AnimatedDrawer
        isOpen={isExpanded}
        className="study-planner__month-wrapper"
      >
        <Droppable<
          | PlannedCourseWithIdentifier
          | PlannedCourseNew
          | StudyPlannerNoteWithIdentifier
          | StudyPlannerNoteNew,
          DroppableCardType
        >
          accept={
            !isPast
              ? [
                  "planned-course-card",
                  "planned-course-new",
                  "note-card",
                  "new-note-card",
                ]
              : []
          }
          onDrop={handleDrop}
          onHover={handleDropHover}
          className="study-planner__month-content"
        >
          {notes.length > 0 && (
            <PlannerNotesList
              disabled={isDisabled}
              notes={notes}
              selectedPlanItemIds={selectedPlanItemIds}
              originalNotes={originalPlanNotes}
              onNoteChange={handleNoteChange}
              onSelectNote={handleSelectNote}
            />
          )}

          {courses.length > 0 && (
            <PlannerPlannedList
              disabled={isDisabled}
              courses={courses}
              selectedPlanItemIds={selectedPlanItemIds}
              originalPlannedCourses={originalPlannedCourses}
              studyActivity={studyActivity}
              curriculumConfig={curriculumConfig}
              onCourseChange={handleCourseChange}
              onSelectCourse={handleSelectCourse}
            />
          )}

          {activities.length > 0 && (
            <PlannerActivityList
              activities={activities}
              curriculumConfig={curriculumConfig}
            />
          )}

          <motion.div
            variants={dropZoneVariants}
            animate={pulseDropzone ? "dropIsActive" : "initial"}
            className={`study-planner__month-dropzone ${pulseDropzone ? "study-planner__month-dropzone--active" : ""}`}
            onClick={handleMoveCourseHereClick}
          />
        </Droppable>
      </AnimatedDrawer>
    </div>
  );
};

export default PlannerPeriodMonth;
