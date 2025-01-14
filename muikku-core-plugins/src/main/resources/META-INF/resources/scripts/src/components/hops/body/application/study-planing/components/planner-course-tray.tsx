import * as React from "react";
import { useMemo } from "react";
import AnimateHeight from "react-animate-height";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useLocalStorage } from "usehooks-ts";
import { Course, CourseFilter } from "~/@types/shared";
import Button, { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { HopsOpsCourse, StudentStudyActivity } from "~/generated/client";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import { filterSubjectsAndCourses } from "../helper";
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
  studyActivity: StudentStudyActivity[];
  curriculumConfig: CurriculumConfig;
  availableOPSCourses: HopsOpsCourse[];
  onCourseClick: (course: Course & { subjectCode: string }) => void;
  isSelected: (course: Course & { subjectCode: string }) => boolean;
}

/**
 * PlannerSidebar component
 * @param props props
 */
const PlannerCourseTray: React.FC<PlannerCourseTrayProps> = (props) => {
  const {
    plannedCourses,
    studyActivity,
    curriculumConfig,
    availableOPSCourses,
  } = props;

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

  /**
   * Handles course click. If the same course is clicked, clear the selection
   * @param course course
   */
  const handleCourseClick = (course: Course & { subjectCode: string }) => {
    props.onCourseClick(course);
  };

  // Filter subjects and courses
  const filteredSubjects = filterSubjectsAndCourses(
    curriculumConfig.strategy.getCurriculumMatrix().subjectsTable,
    searchTerm,
    selectedFilters,
    availableOPSCoursesMap
  );

  // Filter options
  const filterOptions: { label: string; value: CourseFilter }[] = [
    {
      label: "Tarjolla Otaviassa",
      value: "available_in_otavi",
    },
    {
      label: "Pakolliset",
      value: "mandatory",
    },
    {
      label: "Valinnaiset",
      value: "optional",
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
            <AnimateHeight
              height={expandedGroups.includes(subject.subjectCode) ? "auto" : 0}
            >
              <div className="study-planner__course-tray-list">
                {subject.availableCourses.map((course) => {
                  // Check if course tray item is selected
                  const selected = props.isSelected({
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
                      key={`${subject.subjectCode}${course.courseNumber}`}
                      course={course}
                      subjectCode={subject.subjectCode}
                      isPlannedCourse={isPlannedCourse}
                      selected={selected}
                      studyActivity={courseActivity}
                      curriculumConfig={curriculumConfig}
                      onSelectCourse={handleCourseClick}
                    />
                  );
                })}
              </div>
            </AnimateHeight>
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
            ? { disabled: true, state: "completed", label: "Suoritettu" }
            : { disabled: false, state: "failed", label: "Hylätty" };
        case "TRANSFERRED":
          return {
            disabled: true,
            state: "transferred",
            label: "Hyväksiluettu",
          };
        case "ONGOING":
          return { disabled: true, state: "inprogress", label: "Työnalla" };
        case "SUPPLEMENTATIONREQUEST":
          return {
            disabled: true,
            state: "supplementation-request",
            label: "Täydennettävä",
          };
        default:
          return { disabled: false, state: null, label: null };
      }
    }

    if (isPlannedCourse) {
      return { disabled: true, state: "planned", label: "Suunnitelmassa" };
    }

    return { disabled: false, state: "available", label: "Lisättävissä" };
  };

  const courseState = getCourseState();
  const isDisabled = courseState.disabled;

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
      canDrag: !isDisabled,
    }),
    [isDisabled]
  );

  preview(getEmptyImage(), { captureDraggingState: true });

  /**
   * Handles course select
   */
  const handleSelectCourse = () => {
    onSelectCourse({ ...course, subjectCode });
  };

  const modifiers = [];

  isDragging && modifiers.push("is-dragging");
  selected && modifiers.push("selected");
  courseState.state && modifiers.push(courseState.state);
  isDisabled && modifiers.push("disabled");

  const type = course.mandatory ? "mandatory" : "optional";

  return (
    <PlannerCard
      modifiers={modifiers}
      innerContainerModifiers={[type]}
      onClick={!isDisabled ? handleSelectCourse : undefined}
      ref={drag}
    >
      <PlannerCardHeader modifiers={["sidebar-course-card"]}>
        <span className="planner-sidebar-course__code">
          {`${subjectCode} ${course.courseNumber}. `}
        </span>
        <span className="planner-sidebar-course__name">{course.name}</span>
      </PlannerCardHeader>

      <PlannerCardContent modifiers={["planned-course-card"]}>
        <PlannerCardLabel modifiers={[type]}>
          {type === "mandatory" ? "PAKOLLINEN" : "VALINNAINEN"}
        </PlannerCardLabel>
        <PlannerCardLabel modifiers={["course-length"]}>
          {curriculumConfig.strategy.getCourseDisplayedLength(course)}
        </PlannerCardLabel>

        {courseState.label && (
          <PlannerCardLabel modifiers={[courseState.state]}>
            {courseState.label}
          </PlannerCardLabel>
        )}
      </PlannerCardContent>
    </PlannerCard>
  );
};

export default PlannerCourseTray;
