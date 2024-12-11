import * as React from "react";
import AnimateHeight from "react-animate-height";
import { SchoolSubject } from "~/@types/shared";
import Button from "~/components/general/button";
import CourseItem from "./course-item";

/**
 * PlannerSidebarProps
 */
interface PlannerSidebarProps {
  subjects: SchoolSubject[];
  expandedGroups: string[];
  onGroupToggle: (groupName: string) => void;
  onCourseSelect: (subjectCode: string, courseNumber: number) => void;
  onSearch: (searchTerm: string) => void;
}

/**
 * PlannerSidebar component
 * @param props props
 */
const PlannerSidebar: React.FC<PlannerSidebarProps> = (props) => {
  const { subjects, expandedGroups, onGroupToggle, onCourseSelect, onSearch } =
    props;
  return (
    <div className="hops-planner__sidebar">
      <h3 className="hops-planner__sidebar-title">Opintojaksot</h3>
      <div className="hops-planner__search">
        <input
          type="text"
          className="hops__input"
          placeholder="Hae opintojaksoja"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="hops-planner__course-groups">
        {subjects.map((subject) => (
          <div key={subject.subjectCode} className="hops-planner__course-group">
            <Button
              iconPosition="left"
              icon={
                expandedGroups.includes(subject.subjectCode)
                  ? "arrow-down"
                  : "arrow-right"
              }
              buttonModifiers={["planner-course-group-toggle"]}
              onClick={() => onGroupToggle(subject.subjectCode)}
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
