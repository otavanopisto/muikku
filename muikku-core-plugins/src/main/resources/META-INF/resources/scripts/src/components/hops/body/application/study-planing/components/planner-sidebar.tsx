import * as React from "react";
import AnimateHeight from "react-animate-height";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Action } from "redux";
import { Dispatch } from "redux";
import { useLocalStorage } from "usehooks-ts";
import { Course, CourseFilter } from "~/@types/shared";
import { AnyActionType } from "~/actions";
import {
  updateSelectedCourse,
  UpdateSelectedCourseTriggerType,
} from "~/actions/main-function/hops";
import Button, { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { StateType } from "~/reducers";
import { PlannedCourseWithIdentifier } from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import { filterSubjectsAndCourses, selectedIsPlannedCourse } from "../helper";
import PlannerSidebarCourse from "./planner-sidebar-course";

/**
 * PlannerSidebarProps
 */
interface PlannerSidebarProps {
  plannedCourses: PlannedCourseWithIdentifier[];
  curriculumConfig: CurriculumConfig;
  selectedCourse:
    | PlannedCourseWithIdentifier
    | (Course & { subjectCode: string })
    | null;
  updateSelectedCourse: UpdateSelectedCourseTriggerType;
}

/**
 * PlannerSidebar component
 * @param props props
 */
const PlannerSidebar: React.FC<PlannerSidebarProps> = (props) => {
  const {
    plannedCourses,
    selectedCourse,
    curriculumConfig,
    updateSelectedCourse,
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
    if (course === null) {
      updateSelectedCourse(null);
    } else {
      updateSelectedCourse({ course });
    }
  };

  // Filter subjects and courses
  const filteredSubjects = filterSubjectsAndCourses(
    curriculumConfig.strategy.getCurriculumMatrix().subjectsTable,
    searchTerm,
    selectedFilters
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
    <div className="study-planner__sidebar">
      <div className="study-planner__sidebar-header">
        <h3 className="study-planner__sidebar-title">Opintojaksot</h3>
        <div className="study-planner_sidebar-filters">
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
      <div className="study-planner__search">
        <input
          type="text"
          className="study-planner__input"
          placeholder="Hae opintojaksoja"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="study-planner__course-groups">
        {filteredSubjects.map((subject) => (
          <div
            key={subject.subjectCode}
            className="study-planner__course-group"
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
              <div className="study-planner__course-list">
                {subject.availableCourses.map((course) => {
                  // Check if the course is already planned
                  const isPlannedCourse = plannedCourses.find(
                    (plannedCourse) =>
                      plannedCourse.subjectCode === subject.subjectCode &&
                      plannedCourse.courseNumber === course.courseNumber
                  );

                  // Check if the course is selected
                  const isSelected =
                    selectedCourse &&
                    !selectedIsPlannedCourse(selectedCourse) &&
                    selectedCourse.subjectCode === subject.subjectCode &&
                    selectedCourse.courseNumber === course.courseNumber;

                  return (
                    <PlannerSidebarCourse
                      key={`${subject.subjectCode}${course.courseNumber}`}
                      course={course}
                      subjectCode={subject.subjectCode}
                      plannedCourse={isPlannedCourse}
                      selected={isSelected}
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
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
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

export default connect(mapStateToProps, mapDispatchToProps)(PlannerSidebar);
