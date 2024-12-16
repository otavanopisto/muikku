import * as React from "react";
import AnimateHeight from "react-animate-height";
import { useLocalStorage } from "usehooks-ts";
import { CourseFilter, SchoolSubject } from "~/@types/shared";
import Button, { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { filterSubjectsAndCourses } from "../helper";
import CourseItem from "./course-item";

/**
 * PlannerSidebarProps
 */
interface PlannerSidebarProps {
  subjects: SchoolSubject[];
  onCourseSelect: (subjectCode: string, courseNumber: number) => void;
}

/**
 * PlannerSidebar component
 * @param props props
 */
const PlannerSidebar: React.FC<PlannerSidebarProps> = (props) => {
  const { subjects, onCourseSelect } = props;

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

  // Filter subjects and courses
  const filteredSubjects = filterSubjectsAndCourses(
    subjects,
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
    <div className="hops-planner__sidebar">
      <div className="hops-planner__sidebar-header">
        <h3 className="hops-planner__sidebar-title">Opintojaksot</h3>
        <div className="hops-planner_sidebar-filters">
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
      <div className="hops-planner__search">
        <input
          type="text"
          className="hops__input"
          placeholder="Hae opintojaksoja"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="hops-planner__course-groups">
        {filteredSubjects.map((subject) => (
          <div key={subject.subjectCode} className="hops-planner__course-group">
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
              <div className="hops-planner__course-list">
                {subject.availableCourses.map((course) => (
                  <CourseItem
                    key={`${subject.subjectCode}${course.courseNumber}`}
                    course={course}
                    subjectCode={subject.subjectCode}
                    onClick={() =>
                      onCourseSelect(subject.subjectCode, course.courseNumber)
                    }
                  />
                ))}
              </div>
            </AnimateHeight>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlannerSidebar;
