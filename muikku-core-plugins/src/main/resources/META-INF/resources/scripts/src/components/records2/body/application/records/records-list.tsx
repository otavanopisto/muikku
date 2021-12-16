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
  studies?: {
    excerciseCount: number;
    maxExcercise: number;
    assigmentCount: number;
    maxAssigment: number;
  };
  status: "EVALUATED" | "SUPPLEMENTATION" | "ONGOING" | "TRANSFERED";
  grade?: string;
  description?: string;
  workspaceId?: number;
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

/**
 * RecordsListItemProps
 */
interface RecordsListItemProps extends RecordSubjectCourse {
  courseName: string;
  userEntityId: number;
}

/**
 * RecordsListItem
 * Creates records list item. The component itself creates
 * item name cell and functions cells to show possible assignments and diary entries
 * and content that show something data related to that course.
 *
 * Children props will render any other necessary cells that user wants. In desktop view
 * cell items headers are hidden and desktop view whole list uses one header for all
 * @returns JSX.Element
 */
export const RecordsListItem: React.FC<RecordsListItemProps> = ({
  userEntityId,
  courseName,
  children,
  ...course
}) => {
  const [height, setHeight] = React.useState<"auto" | 0>(0);

  /**
   * statusClassMod
   * Returns string className depending what is course status
   * This will affect what border color is showed within item-container
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

      case "TRANSFERED":
        return "studies-records__section-content-course-list-item-container--status-transfered";
    }
  };

  /**
   * handleCourseClickName
   * Handles course name click "aka" open content
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

  /**
   * renderContentByStatus
   * This coontent depends on course status
   * which will render different content opened by clicking
   * course name
   * @returns JSX.Element
   */
  const renderContentByStatus = () => {
    switch (course.status) {
      case "EVALUATED":
        return (
          <div className="studies-records__section-content-course-list-item-proggress-container">
            <div className="studies-records__section-content-course-list-item-proggress-container-item studies-records__section-content-course-list-item-proggress-container-item--literal">
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
            <div className="studies-records__section-content-course-list-item-proggress-container-item studies-records__section-content-course-list-item-proggress-container-item--verbal">
              <div style={{ fontWeight: "bold", margin: "5px 0" }}>
                Suullinen palaute
              </div>
              <RecordingsList records={[]} />
            </div>
          </div>
        );

      case "SUPPLEMENTATION":
        return (
          <div className="studies-records__section-content-course-list-item-proggress-container">
            <div className="studies-records__section-content-course-list-item-proggress-container-item studies-records__section-content-course-list-item-proggress-container-item--literal">
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
            <div className="studies-records__section-content-course-list-item-proggress-container-item studies-records__section-content-course-list-item-proggress-container-item--proggress">
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  flexDirection: "column",
                }}
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
                      (course.studies &&
                        course.studies.excerciseCount /
                          course.studies.maxExcercise) ||
                      0
                    }
                  />
                </div>
                <div style={{ margin: "5px 0", marginBottom: "0" }}>
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
                      (course.studies &&
                        course.studies.assigmentCount /
                          course.studies.maxAssigment) ||
                      0
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case "ONGOING":
        return (
          <div className="studies-records__section-content-course-list-item-proggress-container">
            <div className="studies-records__section-content-course-list-item-proggress-container-item studies-records__section-content-course-list-item-proggress-container-item--ongoing-proggress">
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
                    (course.studies &&
                      course.studies.excerciseCount /
                        course.studies.maxExcercise) ||
                    0
                  }
                />
              </div>
              <div style={{ margin: "5px 0", marginBottom: "0" }}>
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
                    (course.studies &&
                      course.studies.assigmentCount /
                        course.studies.maxAssigment) ||
                    0
                  }
                />
              </div>
            </div>
          </div>
        );

      case "TRANSFERED":
        return;
    }
  };

  return (
    <div
      className={`studies-records__section-content-course-list-item-container ${statusClassMod()}`}
    >
      <div className="studies-records__section-content-course-list-item">
        <RecordListItemCell classNameMods={["name"]}>
          <div
            className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item-cell--name"
            onClick={handleCourseClickName}
          >
            <div className="studies-records__section-content-course-list-item-cell-box studies-records__section-content-course-list-item-cell-box--course-name">
              {courseName}
            </div>
          </div>
        </RecordListItemCell>

        {children}

        <RecordListItemCell
          header="Tehtävät/Päiväkirj."
          headerClassMods={["mobile", "assignment"]}
          classNameMods={["assignment"]}
        >
          <div className="studies-records__section-content-course-list-item-cell-box">
            {course.status === "TRANSFERED" ? (
              "-"
            ) : (
              <div>
                <RecordsAssignmentsListDialog
                  courseName={course.name}
                  userEntityId={userEntityId}
                  workspaceEntityId={course.workspaceId}
                >
                  <Button
                    style={{ backgroundColor: "#009FE3", color: "white" }}
                    disabled={!course.workspaceId}
                  >
                    Näytä
                  </Button>
                </RecordsAssignmentsListDialog>
              </div>
            )}
          </div>
        </RecordListItemCell>
      </div>
      <AnimateHeight height={height}>{renderContentByStatus()}</AnimateHeight>
    </div>
  );
};

/**
 * RecordListItemCellProps
 */
interface RecordListItemCellProps {
  header?: string;
  classNameMods?: string[];
  headerClassMods?: string[];
}

/**
 * RecordListItemCell
 * @returns JSX.Element
 */
export const RecordListItemCell: React.FC<RecordListItemCellProps> = ({
  header,
  headerClassMods,
  classNameMods,
  children,
}) => {
  return (
    <div
      className={`studies-records__section-content-course-list-item-cell ${
        classNameMods
          ? classNameMods
              .map(
                (m) =>
                  `studies-records__section-content-course-list-item-cell--${m}`
              )
              .join(" ")
          : ""
      }`}
    >
      {header ? (
        <div
          className={`studies-records__section-content-course-list-item-cell-label ${
            headerClassMods
              ? headerClassMods
                  .map(
                    (m) =>
                      `studies-records__section-content-course-list-item-cell-label--${m}`
                  )
                  .join(" ")
              : ""
          }`}
        >
          {header}
        </div>
      ) : null}

      {children}
    </div>
  );
};
