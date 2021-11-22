import Button from "~/components/general/button";
import * as React from "react";
import AnimateHeight from "react-animate-height";
import Avatar from "~/components/general/avatar";
import RecordsAssignmentsListDialog from "~/components/records2/dialogs/records-assignments-list-dialog";
import RecordingsList from "~/components/general/voice-recorder/recordings-list";
let ProgressBarCircle = require("react-progress-bar.js").Circle;

export interface RecordSubject {
  name: string;
  courses: RecordSubjectCourse[];
}

export interface RecordSubjectCourse {
  name: string;

  evaluationDate: string;
  asessor: string;
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
}

export const RecordsList: React.FC<RecordsListProps> = ({
  children,
  name,
  courseCount,
}) => {
  const [open, setOpen] = React.useState(false);

  const animateHeight = open ? "auto" : 0;

  const arrowClass = open ? "arrow-down" : "arrow-right";

  return (
    <div className="studies-records__section-content-course-list">
      <div
        className="studies-records__section-content-course-list-container"
        style={{ display: "flex", alignItems: "center" }}
      >
        <div
          className="studies-records__section-content-course-list-subject"
          onClick={() => setOpen(!open)}
        >
          {`${name} (${courseCount}) `}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        <div className={arrowClass}></div>
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
  userEntityId: number;
}

export const RecordsListItem: React.FC<RecordsListItemProps> = ({
  index,
  userEntityId,
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
        return "studies-records__section-content-course-list-item-cell-box--status-evaluated";

      case "SUPPLEMENTATION":
        return "studies-records__section-content-course-list-item-cell-box--status-supplementation";

      case "ONGOING":
        return "studies-records__section-content-course-list-item-cell-box--status-ongoing";
    }
  };

  /**
   * handleCourseClickName
   */
  const handleCourseClickName = () => {
    setHeight(height === "auto" ? 0 : "auto");
  };

  return (
    <>
      <div className="studies-records__section-content-course-list-item">
        <div
          className="studies-records__section-content-course-list-item-cell"
          onClick={handleCourseClickName}
        >
          <div className="studies-records__section-content-course-list-item-cell-box studies-records__section-content-course-list-item-cell-box--course-name">
            {course.name}
          </div>
        </div>
        <div className="studies-records__section-content-course-list-item-cell">
          <div className="studies-records__section-content-course-list-item-cell-box">
            {course.evaluationDate}
          </div>
        </div>
        <div className="studies-records__section-content-course-list-item-cell">
          <div className="studies-records__section-content-course-list-item-cell-box studies-records__section-content-course-list-item-cell-box--asessor">
            <div className="asessor-data">
              <div className="avatar">
                <Avatar hasImage={false} id={1} firstName="Eka" />
              </div>
              <div className="asessor">
                <div className="name">{course.asessor}</div>
                <div className="title">titteli</div>
              </div>
            </div>
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
        <div
          className={`studies-records__section-content-course-list-item-cell ${statusClassMod()}`}
        >
          <div className="studies-records__section-content-course-list-item-cell-box">
            {course.status}
          </div>
        </div>
        <div className="studies-records__section-content-course-list-item-cell">
          <div className="studies-records__section-content-course-list-item-cell-box">
            {course.grade ? course.grade : "-"}
          </div>
        </div>
      </div>
      <AnimateHeight height={height}>
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
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
              et facilisis risus. Mauris fringilla nec tortor sed egestas. Nam
              posuere sem et luctus tincidunt. Suspendisse elementum odio ex, ut
              vehicula enim porta a. Integer dictum, purus ac dapibus elementum,
              neque urna pellentesque magna, nec eleifend ex ligula id diam.
              Vivamus lobortis nec mauris porta porttitor. Vestibulum luctus
              sapien velit, eget ullamcorper neque maximus ut.{" "}
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
      </AnimateHeight>
    </>
  );
};
