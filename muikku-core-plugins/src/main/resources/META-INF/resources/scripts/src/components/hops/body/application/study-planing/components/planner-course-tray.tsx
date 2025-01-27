import * as React from "react";
import { useMemo } from "react";
import AnimateHeight from "react-animate-height";
import { useDrag } from "react-dnd";
import { getEmptyImage } from "react-dnd-html5-backend";
import { useLocalStorage } from "usehooks-ts";
import { Course, CourseFilter } from "~/@types/shared";
import Button, { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import {
  CourseStatus,
  HopsOpsCourse,
  StudentStudyActivity,
} from "~/generated/client";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import { filterSubjectsAndCourses } from "../helper";
import {
  PlannerCard,
  PlannerCardActions,
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
  studyOptions: string[];
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
    studyOptions,
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

  /**
   * Handles course click. If the same course is clicked, clear the selection
   * @param course course
   */
  const handleCourseClick = (course: Course & { subjectCode: string }) => {
    props.onCourseClick(course);
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

  const [isCourseStateOpen, setIsCourseStateOpen] = React.useState(false);

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

    return { disabled: false, state: null, label: null };
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

  /**
   * Handles course state open
   * @param e Event
   */
  const handleCourseStateOpen = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    setIsCourseStateOpen(!isCourseStateOpen);
  };

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
        onClick={!isDisabled ? handleSelectCourse : undefined}
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

        {studyActivity && (
          <PlannerCardActions modifiers={["course-tray"]}>
            <Button
              icon="arrow-down"
              iconPosition="left"
              onClick={handleCourseStateOpen}
              buttonModifiers={["study-planner-extra-info-toggle"]}
            >
              Lisätietoa
            </Button>
          </PlannerCardActions>
        )}
      </PlannerCard>

      {studyActivity && (
        <AnimateHeight
          height={isCourseStateOpen ? "auto" : 0}
          animateOpacity={false}
          contentClassName="study-planner__extra-section study-planner__extra-section--specify"
        >
          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssi suunniteltu
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssille ilmoittauduttu
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssilta pyydetty arviointia
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssi arvioitu
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>

          <div className="study-planner__state-info-row">
            <span className="study-planner__state-info-row-label">
              Kurssin arvosana
            </span>
            <span className="study-planner__state-info-row-value">-</span>
          </div>
        </AnimateHeight>
      )}
    </div>
  );
};

export default PlannerCourseTray;
