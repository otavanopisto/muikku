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
  clearAddToPeriod,
  ClearAddToPeriodTriggerType,
  updateAddToPeriod,
  UpdateAddToPeriodTriggerType,
  updateHopsEditingStudyPlan,
  UpdateHopsEditingStudyPlanTriggerType,
  updateSelection,
  UpdateSelectionTriggerType,
} from "~/actions/main-function/hops";
import Button, { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { StateType } from "~/reducers";
import {
  isPeriodMonthSelection,
  isUnplannedCourseSelection,
  PlannedCourseWithIdentifier,
  Selection,
} from "~/reducers/hops";
import { CurriculumConfig } from "~/util/curriculum-config";
import { filterSubjectsAndCourses } from "../helper";
import PlannerSidebarCourse from "./planner-sidebar-course";

/**
 * PlannerSidebarProps
 */
interface PlannerSidebarProps {
  plannedCourses: PlannedCourseWithIdentifier[];
  curriculumConfig: CurriculumConfig;
  selection: Selection;
  addToPeriod: (Course & { subjectCode: string })[];
  updateSelection: UpdateSelectionTriggerType;
  updateHopsEditingStudyPlan: UpdateHopsEditingStudyPlanTriggerType;
  updateAddToPeriod: UpdateAddToPeriodTriggerType;
  clearAddToPeriod: ClearAddToPeriodTriggerType;
}

/**
 * PlannerSidebar component
 * @param props props
 */
const PlannerSidebar: React.FC<PlannerSidebarProps> = (props) => {
  const {
    plannedCourses,
    selection,
    addToPeriod,
    curriculumConfig,
    updateSelection,
    updateHopsEditingStudyPlan,
    updateAddToPeriod,
    clearAddToPeriod,
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
    if (selection && isPeriodMonthSelection(selection)) {
      updateAddToPeriod({ courses: [...(addToPeriod ?? []), course] });
    } else {
      if (
        selection &&
        isUnplannedCourseSelection(selection) &&
        selection.course.courseNumber === course.courseNumber &&
        selection.course.subjectCode === course.subjectCode
      ) {
        updateSelection(null);
      } else {
        updateSelection({ selection: { type: "unplanned-course", course } });
      }
    }
  };

  // Filter subjects and courses
  const filteredSubjects = filterSubjectsAndCourses(
    curriculumConfig.strategy.getCurriculumMatrix().subjectsTable,
    searchTerm,
    selectedFilters
  );

  /**
   * Handles course removal
   * @param course course
   */
  const handleRemoveCourse =
    (course: Course & { subjectCode: string }) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      updateAddToPeriod({
        courses: addToPeriod.filter(
          (c) =>
            c.subjectCode !== course.subjectCode ||
            c.courseNumber !== course.courseNumber
        ),
      });
    };

  /**
   * Handles confirm add
   */
  const handleConfirmAdd = () => {
    if (!selection || !isPeriodMonthSelection(selection)) return;

    const newCourses = addToPeriod.map((course) =>
      curriculumConfig.strategy.createPlannedCourse(
        course,
        new Date(selection.year, selection.monthIndex, 1)
      )
    );

    const newPlannedCourses = [...plannedCourses, ...newCourses];

    /* updateHopsEditingStudyPlan({

    }); */
  };

  /**
   * Handles cancel selection
   */
  const handleCancelSelection = () => {
    clearAddToPeriod();
    updateSelection(null);
  };

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
  /**
   * Renders a single course that will be planned
   * @param course course
   */
  const renderWillBePlannedCourse = (
    course: Course & { subjectCode: string }
  ) => (
    <li
      key={`${course.subjectCode}${course.courseNumber}`}
      className="study-planner__will-be-added-course"
    >
      <span className="study-planner__will-be-added-course-name">
        {course.name}
      </span>
      <IconButton
        icon="cross"
        buttonModifiers={["small", "transparent"]}
        onClick={handleRemoveCourse(course)}
        aria-label="Poista kurssi listalta"
      />
    </li>
  );

  /**
   * Renders the list of courses that will be planned
   */
  const renderWillBeAddedPlannedCourses = () => {
    if (!addToPeriod || addToPeriod.length === 0) return null;

    return (
      <div className="study-planner__will-be-added">
        <h4 className="study-planner__will-be-added-title">
          Lisättävät kurssit ({addToPeriod.length})
        </h4>
        <ul className="study-planner__will-be-added-planned-courses">
          {addToPeriod.map(renderWillBePlannedCourse)}
        </ul>
      </div>
    );
  };

  return (
    <div className="study-planner__sidebar">
      {selection && isPeriodMonthSelection(selection) && (
        <div className="study-planner__sidebar-header-extra">
          <div className="study-planner__selection-info">
            <span className="study-planner__selection-info-text">
              Valitse haluamasi kursseja ajankohtaan
            </span>
            <span className="study-planner__selected-period-month">
              {new Date(selection.year, selection.monthIndex).toLocaleString(
                "fi-FI",
                {
                  month: "long",
                  year: "numeric",
                }
              )}
            </span>
            {renderWillBeAddedPlannedCourses()}

            <div className="study-planner__selection-actions">
              <Button
                buttonModifiers={["study-planner-month-toggle"]}
                onClick={handleCancelSelection}
              >
                Peruuta valinta
              </Button>

              {addToPeriod && addToPeriod.length > 0 && (
                <Button
                  buttonModifiers={["study-planner-month-toggle"]}
                  onClick={handleConfirmAdd}
                >
                  Lisää valinta
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
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
                    selection &&
                    isUnplannedCourseSelection(selection) &&
                    selection.course.subjectCode === subject.subjectCode &&
                    selection.course.courseNumber === course.courseNumber;

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
    selection: state.hopsNew.hopsEditing.selection,
    addToPeriod: state.hopsNew.hopsEditing.addToPeriod,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateSelection,
      updateHopsEditingStudyPlan,
      updateAddToPeriod,
      clearAddToPeriod,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(PlannerSidebar);
