import * as React from "react";

interface Course {
  code: string;
  name: string;
  type: "mandatory" | "optional";
  startDate: string;
  endDate: string;
}

type PeriodType = "AUTUMN" | "SPRING";

const AUTUMN_MONTHS = ["Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];
const SPRING_MONTHS = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
];

interface PlannerPeriodProps {
  title: string;
  credits: number;
  type: PeriodType;
  courses: Course[];
  onCourseAction: (action: "detail" | "remove", courseCode: string) => void;
}

const PlannerPeriod: React.FC<PlannerPeriodProps> = ({
  title,
  credits,
  type,
  courses,
  onCourseAction,
}) => {
  const [expandedMonths, setExpandedMonths] = React.useState<string[]>(
    type === "AUTUMN" ? [...AUTUMN_MONTHS] : [...SPRING_MONTHS]
  );

  const months = type === "AUTUMN" ? AUTUMN_MONTHS : SPRING_MONTHS;

  const handleMonthToggle = (month: string) => {
    setExpandedMonths((prev) =>
      prev.includes(month) ? prev.filter((m) => m !== month) : [...prev, month]
    );
  };

  const getCoursesByMonth = (monthName: string) =>
    courses.filter((course) => {
      const startDate = new Date(course.startDate);
      const monthIndex = startDate.getMonth();
      return months[monthIndex - (type === "AUTUMN" ? 7 : 0)] === monthName;
    });

  return (
    <div className="hops-planner__period">
      <h3 className="hops-planner__period-title">
        {title} - {credits} op
      </h3>
      <div className="hops-planner__months">
        {months.map((month) => {
          const monthCourses = getCoursesByMonth(month);
          const isExpanded = expandedMonths.includes(month);

          return (
            <div key={month} className="hops-planner__month">
              <button
                className={`hops-planner__month-toggle ${isExpanded ? "is-expanded" : ""}`}
                onClick={() => handleMonthToggle(month)}
              >
                <i className="muikku-icon-arrow" />
                {month}
              </button>
              {isExpanded && (
                <div className="hops-planner__month-content">
                  {monthCourses.length > 0 ? (
                    monthCourses.map((course) => (
                      <div
                        key={course.code}
                        className="hops-planner__course-card"
                      >
                        <div className="hops-planner__course-header">
                          <span className="hops-planner__course-code">
                            {course.code}
                          </span>
                          <span
                            className={`hops-planner__course-type hops-planner__course-type--${course.type}`}
                          >
                            {course.type === "mandatory"
                              ? "PAKOLLINEN"
                              : "VALINNAINEN"}
                          </span>
                        </div>
                        <h4 className="hops-planner__course-name">
                          {course.name}
                        </h4>
                        <div className="hops-planner__course-dates">
                          {course.startDate} - {course.endDate}
                        </div>
                        <div className="hops-planner__course-actions">
                          <button
                            className="hops-planner__action-button"
                            onClick={() =>
                              onCourseAction("detail", course.code)
                            }
                          >
                            Tarkenna
                          </button>
                          <button
                            className="hops-planner__action-button hops-planner__action-button--danger"
                            onClick={() =>
                              onCourseAction("remove", course.code)
                            }
                          >
                            Poista
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="hops-planner__empty-month">
                      <div className="hops-planner__dropzone">
                        <i className="muikku-icon-drag-handle" />
                        <span>Raahaa kursseja tähän</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlannerPeriod;
