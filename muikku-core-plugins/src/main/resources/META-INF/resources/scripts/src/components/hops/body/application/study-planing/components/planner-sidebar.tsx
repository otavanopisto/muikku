import * as React from "react";
import CourseItem from "./course-item";

interface Course {
  name: string;
  courseNumber: number;
  length: number;
  mandatory: boolean;
}

interface SubjectGroup {
  name: string;
  subjectCode: string;
  availableCourses: Course[];
}

interface PlannerSidebarProps {
  subjects: SubjectGroup[];
  expandedGroups: string[];
  onGroupToggle: (groupName: string) => void;
  onCourseSelect: (subjectCode: string, courseNumber: number) => void;
  onSearch: (searchTerm: string) => void;
}

const PlannerSidebar: React.FC<PlannerSidebarProps> = ({
  subjects,
  expandedGroups,
  onGroupToggle,
  onCourseSelect,
  onSearch,
}) => (
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
          <button
            className="hops-planner__course-group-toggle"
            onClick={() => onGroupToggle(subject.subjectCode)}
          >
            <i
              className={`muikku-icon-${
                expandedGroups.includes(subject.subjectCode)
                  ? "arrow-down"
                  : "arrow-right"
              }`}
            />
            {subject.name}
          </button>
          {expandedGroups.includes(subject.subjectCode) && (
            <div className="hops-planner__course-list">
              {subject.availableCourses.map((course) => (
                <CourseItem
                  key={`${subject.subjectCode}${course.courseNumber}`}
                  code={`${subject.subjectCode.toUpperCase()}${course.courseNumber}`}
                  name={course.name}
                  credits={course.length}
                  type={course.mandatory ? "mandatory" : "optional"}
                  onClick={() =>
                    onCourseSelect(subject.subjectCode, course.courseNumber)
                  }
                />
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
);

export default PlannerSidebar;
