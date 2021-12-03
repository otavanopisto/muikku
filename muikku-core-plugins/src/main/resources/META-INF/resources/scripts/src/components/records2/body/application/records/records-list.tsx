import Button from "~/components/general/button";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import Avatar from "~/components/general/avatar";
import RecordsAssignmentsListDialog from "~/components/records2/dialogs/records-assignments-list-dialog";
import RecordingsList from "~/components/general/voice-recorder/recordings-list";
import * as moment from "moment";
let ProgressBarCircle = require("react-progress-bar.js").Circle;
let ProgressBarLine = require("react-progress-bar.js").Line;

/**
 * RecordSubject
 */
export interface RecordSubject {
  name: string;
  courses: RecordSubjectCourse[];
}

/**
 * RecordSubjectCourse
 */
export interface RecordSubjectCourse {
  name: string;
  subjectCode?: string;
  evaluationDate?: string;
  asessor?: string;
  studies: {
    excerciseCount: number;
    maxExcercise: number;
    assigmentCount: number;
    maxAssigment: number;
  };
  status: "EVALUATED" | "SUPPLEMENTATION" | "ONGOING";
  grade?: string;
  description?: string;
  workspaceId: number;
}

/**
 * RecordsListProps
 */
interface RecordsListProps {
  name: string;
  subjectId: string;
  courseCount: number;
  openList: boolean;
  onOpenClick: (id: string) => void;
  studiesListType: "ongoing" | "normal";
}

/**
 * RecordsList
 * @param param0
 * @returns JSX.Element
 */
export const RecordsList: React.FC<RecordsListProps> = ({
  children,
  name,
  courseCount,
  studiesListType,
  openList,
  subjectId,
  onOpenClick,
}) => {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open !== openList) {
      setOpen(openList);
    }
  }, [openList]);

  const handleOpenClick = () => {
    if (onOpenClick) {
      onOpenClick(subjectId);
    }
  };

  const animateHeight = open ? "auto" : 0;

  const arrowClass = open ? "arrow-down" : "arrow-right";

  return (
    <div
      className="studies-records__section-content-course-list"
      style={{ borderBottom: "1px solid black" }}
    >
      <div
        className="studies-records__section-content-course-list-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "10px 0",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            className="studies-records__section-content-course-list-subject"
            onClick={handleOpenClick}
          >
            {`${name} (${courseCount}) `}
          </div>

          <div className={arrowClass}></div>
        </div>
      </div>

      <AnimateHeight
        className="studies-records__section-content-course-list-items"
        height={animateHeight}
      >
        {children}
      </AnimateHeight>
    </div>
  );
};

interface RecordsListItemProps extends RecordSubjectCourse {
  index: number;
  courseName: string;
  userEntityId: number;
}

export const RecordsListItem: React.FC<RecordsListItemProps> = ({
  index,
  userEntityId,
  courseName,
  ...course
}) => {
  const [height, setHeight] = React.useState<"auto" | 0>(0);

  /**
   * statusClassMod
   * @returns string
   */
  const statusClassMod = () => {
    switch (course.status) {
      case "EVALUATED":
        return "studies-records__section-content-course-list-item-container--status-evaluated";

      case "SUPPLEMENTATION":
        return "studies-records__section-content-course-list-item-container--status-supplementation";

      case "ONGOING":
        return "studies-records__section-content-course-list-item-container--status-ongoing";
    }
  };

  /**
   * handleCourseClickName
   */
  const handleCourseClickName = () => {
    setHeight(height === "auto" ? 0 : "auto");
  };

  /**
   * createHtmlMarkup
   * This should sanitize html
   * @param htmlString string that contains html
   */
  const createHtmlMarkup = (htmlString: string) => {
    return {
      __html: htmlString,
    };
  };

  return (
    <div
      className={`studies-records__section-content-course-list-item-container ${statusClassMod()}`}
    >
      <div className="studies-records__section-content-course-list-item">
        <div
          className="studies-records__section-content-course-list-item-cell"
          onClick={handleCourseClickName}
        >
          <div className="studies-records__section-content-course-list-item-cell-box studies-records__section-content-course-list-item-cell-box--course-name">
            {courseName}
          </div>
        </div>
        <div className="studies-records__section-content-course-list-item-cell">
          <div className="studies-records__section-content-course-list-item-cell-box">
            {course.evaluationDate
              ? moment(course.evaluationDate).format("l")
              : "-"}
          </div>
        </div>
        <div className="studies-records__section-content-course-list-item-cell">
          <div className="studies-records__section-content-course-list-item-cell-box studies-records__section-content-course-list-item-cell-box--asessor">
            {course.asessor ? (
              <div className="asessor-data">
                <div className="avatar">
                  <Avatar hasImage={false} id={1} firstName="Eka" />
                </div>
                <div className="asessor">
                  <div className="name">{course.asessor}</div>
                  <div className="title">titteli</div>
                </div>
              </div>
            ) : (
              "-"
            )}
          </div>
        </div>

        <div className="studies-records__section-content-course-list-item-cell">
          <div className="studies-records__section-content-course-list-item-cell-box">
            {course.grade ? course.grade : "-"}
          </div>
        </div>

        <div className="studies-records__section-content-course-list-item-cell">
          <div className="studies-records__section-content-course-list-item-cell-box">
            <div>
              <RecordsAssignmentsListDialog
                courseName={course.name}
                userEntityId={userEntityId}
                workspaceEntityId={course.workspaceId}
              >
                <Button style={{ backgroundColor: "green" }}>Näytä</Button>
              </RecordsAssignmentsListDialog>
            </div>
          </div>
        </div>
      </div>
      <AnimateHeight height={height}>
        {course.status === "EVALUATED" ? (
          <div style={{ display: "flex", width: "100%" }}>
            <div
              style={{
                display: "flex",
                width: "50%",
                backgroundColor: "antiquewhite",
                flexDirection: "column",
                padding: "10px",
                marginRight: "5px",
              }}
            >
              <div style={{ fontWeight: "bold", margin: "5px 0" }}>
                Sanallinen arviointi
              </div>
              {course.description ? (
                <div
                  dangerouslySetInnerHTML={createHtmlMarkup(course.description)}
                />
              ) : (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  -
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                width: "50%",
                flexDirection: "column",
                padding: "10px",
                backgroundColor: "#f8f8f8",
                marginLeft: "5px",
              }}
            >
              <div style={{ fontWeight: "bold", margin: "5px 0" }}>
                Suullinen palaute
              </div>
              <RecordingsList records={[]} />
            </div>
          </div>
        ) : (
          <div
            style={{ display: "flex", width: "100%", flexDirection: "column" }}
          >
            <div style={{ margin: "5px 0" }}>
              <ProgressBarLine
                containerClassName="summary-page__study-file-progressbar"
                options={{
                  strokeWidth: 1,
                  duration: 1000,
                  color: "#FFA500",
                  trailColor: "#e3e3e3",
                  trailWidth: 1,
                  svgStyle: { width: "100%", height: "25px" },
                  text: {
                    className:
                      "material-page__audiofield-file-upload-percentage",
                    style: {
                      position: "absolute",
                      color: "white",
                    },
                  },
                }}
                strokeWidth={1}
                easing="easeInOut"
                duration={1000}
                color="#72d200"
                trailColor="#f5f5f5"
                trailWidth={1}
                svgStyle={{ width: "100%", height: "25px" }}
                text={`Harjoitustehtävät`}
                progress={
                  course.studies.excerciseCount / course.studies.maxExcercise
                }
              />
            </div>
            <div style={{ margin: "5px 0" }}>
              <ProgressBarLine
                containerClassName="summary-page__study-file-progressbar"
                options={{
                  strokeWidth: 1,
                  duration: 1000,
                  color: "#CE01BD",
                  trailColor: "#e3e3e3",
                  trailWidth: 1,
                  svgStyle: { width: "100%", height: "25px" },
                  text: {
                    className:
                      "material-page__audiofield-file-upload-percentage",
                    style: {
                      position: "absolute",
                      color: "white",
                    },
                  },
                }}
                strokeWidth={1}
                easing="easeInOut"
                duration={1000}
                color="#72d200"
                trailColor="#f5f5f5"
                trailWidth={1}
                svgStyle={{ width: "100%", height: "25px" }}
                text={`Arvioitavat tehtävät`}
                progress={
                  course.studies.assigmentCount / course.studies.maxAssigment
                }
              />
            </div>
          </div>
        )}
      </AnimateHeight>
    </div>
  );
};
