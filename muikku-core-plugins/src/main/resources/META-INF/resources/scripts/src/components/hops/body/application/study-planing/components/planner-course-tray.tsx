import * as React from "react";
import { useMemo } from "react";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useSelector } from "react-redux";
import { useLocalStorage } from "usehooks-ts";
import { Course, CourseFilter } from "~/@types/shared";
import Button, { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { StudentStudyActivity } from "~/generated/client";
import { StateType } from "~/reducers";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import { filterSubjectsAndCourses } from "../helper";
import { AnimatedDrawer } from "./Animated-drawer";
import {
  PlannerCard,
  PlannerCardContent,
  PlannerCardHeader,
  PlannerCardLabel,
} from "./planner-card";

/**
 * PlannerSidebarProps
 */
interface PlannerCourseTrayProps {
  plannedCourses: PlannedCourseWithIdentifier[];
  onCourseClick: (course: Course & { subjectCode: string }) => void;
  isCourseSelected: (course: Course & { subjectCode: string }) => boolean;
}

/**
 * PlannerSidebar component
 * @param props props
 */
const PlannerCourseTray: React.FC<PlannerCourseTrayProps> = (props) => {
  const { plannedCourses, onCourseClick } = props;

  const [searchTerm, setSearchTerm] = useLocalStorage(
    "hops-planner-search-term",
    ""
  );
  const [expandedGroups, setExpandedGroups] = useLocalStorage<string[]>(
    "hops-planner-expanded-groups",
    []
  );

  const [selectedFilters, setSelectedFilters] = useLocalStorage<CourseFilter[]>(
    "hops-planner-selected-filters",
    []
  );

  const studyOptions = useSelector(
    (state: StateType) => state.hopsNew.hopsStudyPlanState.studyOptions
  );

  // Get curriculum config
  const curriculumConfig = useSelector(
    (state: StateType) => state.hopsNew.hopsCurriculumConfig
  );

  // Get available OPS courses
  const availableOPSCourses = useSelector(
    (state: StateType) => state.hopsNew.hopsStudyPlanState.availableOPSCourses
  );

  // Get study activity
  const studyActivity = useSelector(
    (state: StateType) => state.hopsNew.hopsStudyPlanState.studyActivity
  );

  // Disable course tray if in read mode
  const disabled = useSelector(
    (state: StateType) => state.hopsNew.hopsMode === "READ"
  );

  const matrix = useMemo(
    () =>
      curriculumConfig.strategy.getCurriculumMatrix({
        studyOptions,
      }),
    [curriculumConfig, studyOptions]
  );

  const availableOPSCoursesMap = useMemo(
    () =>
      availableOPSCourses.reduce((acc, course) => {
        acc.set(course.subjectCode, course.courseNumbers);
        return acc;
      }, new Map<string, number[]>()),
    [availableOPSCourses]
  );

  /**
   * Handles group toggle
   * @param groupName group name
   */
  const handleGroupToggle = (groupName: string) => {
    setExpandedGroups((prev) => {
      if (prev.includes(groupName)) {
        return prev.filter((name) => name !== groupName);
      }
      return [...prev, groupName];
    });
  };

  /**
   * Handles filter change
   * @param filter filter
   */
  const handleFilterChange = (filter: CourseFilter) => {
    setSelectedFilters((prev) => {
      if (prev.includes(filter)) {
        return prev.filter((f) => f !== filter);
      }
      return [...prev, filter];
    });
  };

  // Filter subjects and courses
  const filteredSubjects = useMemo(
    () =>
      filterSubjectsAndCourses(
        matrix.subjectsTable,
        searchTerm,
        selectedFilters,
        availableOPSCoursesMap,
        studyActivity,
        plannedCourses
      ),
    [
      matrix,
      searchTerm,
      selectedFilters,
      availableOPSCoursesMap,
      studyActivity,
      plannedCourses,
    ]
  );

  // Filter options
  const filterOptions: { label: string; value: CourseFilter }[] = [
    {
      label: "Saatavilla",
      value: "available",
    },
    {
      label: "Pakolliset",
      value: "mandatory",
    },
    {
      label: "Valinnaiset",
      value: "optional",
    },
    {
      label: "Suunniteltu",
      value: "planned",
    },
    {
      label: "Suoritettu",
      value: "GRADED",
    },
    {
      label: "Täydennettävä",
      value: "SUPPLEMENTATIONREQUEST",
    },
    {
      label: "Hyväksiluettu",
      value: "TRANSFERRED",
    },
    {
      label: "Työnalla",
      value: "ONGOING",
    },
  ];

  return (
    <div className="study-planner__course-tray">
      <div className="study-planner__course-tray-header">
        <h3 className="study-planner__course-tray-title">Opintojaksot</h3>
        <div className="study-planner__course-tray-filters">
          <Dropdown
            items={filterOptions.map((filter) => (
              <div key={filter.value} className="filter-item">
                <input
                  id={`filter-${filter.value}`}
                  type="checkbox"
                  value={filter.value}
                  checked={selectedFilters.includes(filter.value)}
                  onChange={() => handleFilterChange(filter.value)}
                />
                <label
                  htmlFor={`filter-${filter.value}`}
                  className="filter-item__label"
                >
                  {filter.label}
                </label>
              </div>
            ))}
          >
            <IconButton icon="filter" />
          </Dropdown>
        </div>
      </div>
      <div className="study-planner__course-tray-search">
        <input
          type="text"
          className="study-planner__input"
          placeholder="Hae opintojaksoja"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="study-planner__course-tray-groups">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.subjectCode}
            className="study-planner__course-tray-group"
          >
            <Button
              iconPosition="left"
              icon={
                expandedGroups.includes(subject.subjectCode)
                  ? "arrow-down"
                  : "arrow-right"
              }
              buttonModifiers={["planner-course-group-toggle"]}
              onClick={() => handleGroupToggle(subject.subjectCode)}
            >
              {subject.name}
            </Button>
            <AnimatedDrawer
              isOpen={expandedGroups.includes(subject.subjectCode)}
            >
              <div className="study-planner__course-tray-list">
                {subject.availableCourses.map((course) => {
                  // Check if course tray item is selected
                  const selected = props.isCourseSelected({
                    ...course,
                    subjectCode: subject.subjectCode,
                  });

                  const courseActivity = studyActivity?.find(
                    (activity) =>
                      activity.subject === subject.subjectCode &&
                      activity.courseNumber === course.courseNumber
                  );

                  // Check if the course is already planned
                  const isPlannedCourse =
                    plannedCourses.findIndex(
                      (plannedCourse) =>
                        plannedCourse.subjectCode === subject.subjectCode &&
                        plannedCourse.courseNumber === course.courseNumber
                    ) !== -1;

                  return (
                    <PlannerCourseTrayItem
                      key={
                        course.identifier ||
                        `${subject.subjectCode}${course.courseNumber}`
                      }
                      disabled={disabled}
                      course={course}
                      subjectCode={subject.subjectCode}
                      isPlannedCourse={isPlannedCourse}
                      selected={selected}
                      studyActivity={courseActivity}
                      curriculumConfig={curriculumConfig}
                      onSelectCourse={onCourseClick}
                    />
                  );
                })}
              </div>
            </AnimatedDrawer>
          </div>
        ))}
      </div>
    </div>
  );
};

/**
 * PlannerSidebarCourse props
 */
interface PlannerCourseTrayItemProps {
  disabled: boolean;
  course: Course;
  subjectCode: string;
  isPlannedCourse: boolean;
  selected: boolean;
  curriculumConfig: CurriculumConfig;
  studyActivity?: StudentStudyActivity;
  onSelectCourse: (course: Course & { subjectCode: string }) => void;
}

/**
 * PlannerSidebarCourse component
 * @param props props
 */
const PlannerCourseTrayItem: React.FC<PlannerCourseTrayItemProps> = (props) => {
  const {
    disabled,
    course,
    subjectCode,
    isPlannedCourse,
    onSelectCourse,
    selected,
    curriculumConfig,
    studyActivity,
  } = props;

  /**
   * Gets course state
   * @returns course state
   */
  const getCourseState = () => {
    if (studyActivity) {
      switch (studyActivity.status) {
        case "GRADED":
          return studyActivity.passing
            ? { state: "completed", label: "Suoritettu" }
            : { state: "failed", label: "Hylätty" };
        case "TRANSFERRED":
          return {
            state: "transferred",
            label: "Hyväksiluettu",
          };
        case "ONGOING":
          return { state: "inprogress", label: "Työnalla" };
        case "SUPPLEMENTATIONREQUEST":
          return {
            state: "supplementation-request",
            label: "Täydennettävä",
          };
        default:
          return { state: null, label: null };
      }
    }

    if (isPlannedCourse) {
      return { state: "planned", label: "Suunnitelmassa" };
    }

    return { state: null, label: null };
  };

  const courseState = getCourseState();

  const [{ isDragging }, drag, preview] = useDrag(
    () => ({
      type: "new-course-card",
      item: {
        info: { ...course, subjectCode },
        type: "new-course-card",
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      collect: (monitor) => ({
        isDragging: monitor.isDragging(),
      }),
      // eslint-disable-next-line jsdoc/require-jsdoc
      canDrag: !disabled && !studyActivity,
    }),
    [disabled, studyActivity]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * Handles course select
   */
  const handleSelectCourse = () => {
    if (disabled || studyActivity) {
      return;
    }

    onSelectCourse({ ...course, subjectCode });
  };

  // For later use, do not remove
  // /**
  //  * Handles course state open
  //  * @param e Event
  //  */
  // const handleCourseStateOpen = (
  //   e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  // ) => {
  //   e.stopPropagation();
  //   setIsCourseStateOpen(!isCourseStateOpen);
  // };

  const modifiers = [];

  isDragging && modifiers.push("is-dragging");
  selected && modifiers.push("selected");
  courseState.state && modifiers.push(courseState.state);

  const type = course.mandatory ? "mandatory" : "optional";

  return (
    <div className="study-planner__course-tray-item">
      <PlannerCard
        modifiers={modifiers}
        innerContainerModifiers={[type]}
        onClick={handleSelectCourse}
        ref={drag}
      >
        <PlannerCardHeader modifiers={["sidebar-course-card"]}>
          <span className="planner-sidebar-course__name">
            <b>{`${subjectCode} ${course.courseNumber}. `}</b>
            {`${course.name}, ${curriculumConfig.strategy.getCourseDisplayedLength(course)}`}
          </span>
        </PlannerCardHeader>

        <PlannerCardContent modifiers={["planned-course-card"]}>
          <PlannerCardLabel modifiers={[type]}>
            {type === "mandatory" ? "PAKOLLINEN" : "VALINNAINEN"}
          </PlannerCardLabel>

          {courseState.state && (
            <PlannerCardLabel modifiers={["course-state", courseState.state]}>
              {courseState.label}
            </PlannerCardLabel>
          )}
        </PlannerCardContent>
      </PlannerCard>
    </div>
  );
};

export default PlannerCourseTray;
