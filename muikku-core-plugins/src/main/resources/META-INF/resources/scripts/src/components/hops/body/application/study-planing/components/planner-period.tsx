import {
  Reorder,
  useAnimation,
  useDragControls,
  useMotionValue,
  useTransform,
} from "framer-motion";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import { Period, PlannedCourse } from "~/@types/shared";
import Button from "~/components/general/button";

const AUTUMN_MONTHS = ["Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"];
const SPRING_MONTHS = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
  "Heinäkuu",
];

/**
 * PlannerPeriodProps
 */
interface PlannerPeriodProps extends Period {
  onCourseAction: (
    action: "detail" | "remove" | "reorder",
    courseCode: string,
    newIndex?: number
  ) => void;
}

/**
 * PlannerPeriod component
 * @param props props
 */
const PlannerPeriod: React.FC<PlannerPeriodProps> = (props) => {
  const { title, credits, type, plannedCourses, onCourseAction } = props;

  const months = type === "AUTUMN" ? AUTUMN_MONTHS : SPRING_MONTHS;

  /**
   * Gets courses by month
   * @param monthName month name
   */
  const getCoursesByMonth = (monthName: string) =>
    plannedCourses.filter((course) => {
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

          return (
            <PlannerPeriodMonth
              key={month}
              month={month}
              courses={monthCourses}
            />
          );
        })}
      </div>
    </div>
  );
};

/**
 * PlannerPeriodMonthProps
 */
interface PlannerPeriodMonthProps {
  month: string;
  courses: PlannedCourse[];
}

/**
 * PlannerPeriodMonth component
 * @param props props
 */
const PlannerPeriodMonth: React.FC<PlannerPeriodMonthProps> = (props) => {
  const { month, courses } = props;

  const [isExpanded, setIsExpanded] = React.useState(true);
  const [coursesInOrder, setCoursesInOrder] = React.useState<any[]>(courses);

  /**
   * Handles month toggle
   */
  const handleMonthToggle = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div key={month} className="hops-planner__month">
      <Button
        iconPosition="left"
        icon={isExpanded ? "arrow-down" : "arrow-right"}
        buttonModifiers={["planner-month-toggle"]}
        onClick={handleMonthToggle}
      >
        {month}
      </Button>

      <AnimateHeight height={isExpanded ? "auto" : 0}>
        <Reorder.Group
          axis="y"
          values={coursesInOrder}
          as="div"
          className="hops-planner__month-content"
          onReorder={setCoursesInOrder}
          layoutScroll
        >
          {coursesInOrder.length > 0 ? (
            coursesInOrder.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))
          ) : (
            <div className="hops-planner__empty-month">
              <div className="hops-planner__dropzone">
                <i className="muikku-icon-drag-handle" />
                <span>Raahaa kursseja tähän</span>
              </div>
            </div>
          )}
        </Reorder.Group>
      </AnimateHeight>
    </div>
  );
};

/**
 * CourseCardProps
 */
interface CourseCardProps {
  course: PlannedCourse;
}

/**
 * CourseCard component
 * @param props props
 */
const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { course } = props;

  const [isDragging, setIsDragging] = React.useState(false);

  const y = useMotionValue(0);
  const controls = useDragControls();

  const calculatedEndDate = new Date(
    course.startDate.getTime() + course.duration
  );

  return (
    <Reorder.Item
      id={course.id.toString()}
      value={course}
      dragControls={controls}
      as="div"
      style={{
        boxShadow: isDragging ? "0px 0px 10px 0px" : "0px 0px 0px 0px",
        y,
        transition: "box-shadow 0.2s ease-in-out",
      }}
      onDragStart={() => setIsDragging(true)}
      onDragEnd={() => setIsDragging(false)}
      className="hops-planner__course-card"
    >
      <div className="hops-planner__course-header">
        <span className="hops-planner__course-code">
          {`${course.subjectCode}-${course.courseNumber}`}
        </span>
        <span className="hops-planner__course-name">{course.name}</span>
      </div>

      <div className="hops-planner__course-content">
        <span
          className={`hops-planner__course-type hops-planner__course-type--${course.mandatory ? "mandatory" : "optional"}`}
        >
          {course.mandatory ? "PAKOLLINEN" : "VALINNAINEN"}
        </span>
        <span className="hops-planner__course-dates">
          {calculatedEndDate ? (
            <>
              {course.startDate.toLocaleDateString()} -{" "}
              {calculatedEndDate.toLocaleDateString()}
            </>
          ) : (
            course.startDate.toLocaleDateString()
          )}
        </span>
      </div>

      <div className="hops-planner__course-actions">
        <button
          className="hops-planner__action-button"
          onClick={() => undefined}
        >
          Tarkenna
        </button>
        <button
          className="hops-planner__action-button hops-planner__action-button--danger"
          onClick={() => undefined}
        >
          Poista
        </button>
      </div>
    </Reorder.Item>
  );
};

export default PlannerPeriod;
