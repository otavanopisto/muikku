import Button from "~/components/general/button";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import Avatar from "~/components/general/avatar";
import RecordsAssignmentsListDialog from "~/components/records2/dialogs/records-assignments-list-dialog";
import RecordingsList from "~/components/general/voice-recorder/recordings-list";
let ProgressBarCircle = require("react-progress-bar.js").Circle;
let ProgressBarLine = require("react-progress-bar.js").Line;

export interface RecordSubject {
  name: string;
  courses: RecordSubjectCourse[];
}

export interface RecordSubjectCourse {
  name: string;
  subjectCode: string;
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
}

interface RecordsListProps {
  name: string;
  courseCount: number;
  studiesListType: "ongoing" | "normal";
}

export const RecordsList: React.FC<RecordsListProps> = ({
  children,
  name,
  courseCount,
  studiesListType,
}) => {
  const [open, setOpen] = React.useState(false);

  const animateHeight = open ? "auto" : 0;

  const arrowClass = open ? "arrow-down" : "arrow-right";

  return (
    <div className="studies-records__section-content-course-list">
      <div
        className="studies-records__section-content-course-list-container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid black",
          paddingTop: "10px",
        }}
      >
        <div style={{ display: "flex" }}>
          <div
            className="studies-records__section-content-course-list-subject"
            onClick={() => setOpen(!open)}
          >
            {`${name} (${courseCount}) `}
          </div>

          <div className={arrowClass}></div>
        </div>

        {studiesListType === "normal" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 10px",
            }}
          >
            <ProgressBarCircle
              containerClassName="summary-page__study-file-progresscircle"
              options={{
                strokeWidth: 10,
                duration: 1000,
                color: "#ce01bd",
                trailColor: "#ebebeb",
                easing: "easeInOut",
                trailWidth: 10,
                svgStyle: { width: "40px", height: "40px", margin: "10px 5px" },
                text: {
                  style: null,
                  value: "2/8",
                },
              }}
              progress={0.1}
            />
            <ProgressBarCircle
              containerClassName="summary-page__study-file-progresscircle"
              options={{
                strokeWidth: 10,
                duration: 1000,
                color: "#ce01bd",
                trailColor: "#ebebeb",
                easing: "easeInOut",
                trailWidth: 10,
                svgStyle: { width: "40px", height: "40px", margin: "10px 5px" },
                text: {
                  style: null,
                  value: "0/3",
                },
              }}
              progress={0.5}
            />
          </div>
        ) : null}
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
            {course.evaluationDate ? course.evaluationDate : "-"}
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
                userEntityId={userEntityId}
                workspaceEntityId={0}
              >
                <Button style={{ backgroundColor: "green" }}>Näytä</Button>
              </RecordsAssignmentsListDialog>
            </div>
          </div>
        </div>
      </div>
      <AnimateHeight height={height}>
        {course.status !== "ONGOING" ? (
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
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Maecenas et facilisis risus. Mauris fringilla nec tortor sed
                egestas. Nam posuere sem et luctus tincidunt. Suspendisse
                elementum odio ex, ut vehicula enim porta a. Integer dictum,
                purus ac dapibus elementum, neque urna pellentesque magna, nec
                eleifend ex ligula id diam. Vivamus lobortis nec mauris porta
                porttitor. Vestibulum luctus sapien velit, eget ullamcorper
                neque maximus ut.
              </div>
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
                  svgStyle: { width: "100%", height: "35px" },
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
                progress={0.5}
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
                  svgStyle: { width: "100%", height: "35px" },
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
                progress={0.5}
              />
            </div>
          </div>
        )}
      </AnimateHeight>
    </div>
  );
};
