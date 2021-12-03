import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/records.scss";
import {
  RecordsType,
  TransferCreditType,
} from "~/reducers/main-function/records";
import { StateType } from "~/reducers";
import Link from "~/components/general/link";
import {
  RecordsList,
  RecordsListItem,
  RecordSubject,
  RecordSubjectCourse,
} from "./records-list";
import {
  WorkspaceType,
  WorkspaceAssessementStateType,
} from "~/reducers/workspaces";

interface RecordsBySubject {
  subjectId: string | number;
  workspaces: WorkspaceType[];
}

/**
 * RecordsProps
 */
interface RecordsProps {
  i18n: i18nType;
  records: RecordsType;
}

/**
 * RecordsState
 */
interface RecordsState {
  sortDirectionWorkspaces?: string;
  sortDirectionRecords?: string;
  sortedWorkspaces?: any;
  sortedRecords?: any;
  allGroupsOpen: boolean;
  listOfListsIds: string[];
}

/**
 * Records
 */
class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps) {
    super(props);

    this.state = {
      allGroupsOpen: false,
      listOfListsIds: [],
    };
  }

  filterOnGoingStatusCourses = (records: RecordSubject[]) => {
    const ongoingList: RecordSubjectCourse[] = [];

    records.map((rItem) => {
      rItem.courses.map((cItem) => {
        if (cItem.status === "ONGOING") {
          ongoingList.push(cItem);
        }
      });
    });

    return ongoingList;
  };

  filterRecordsBySubject = () => {
    const arrayOfOnGoingCourses: WorkspaceType[] = [];
    const arrayCoursesBySubjects: RecordsBySubject[] = [];

    if (
      this.props.records.userDataStatus === "LOADING" ||
      this.props.records.userDataStatus === "WAIT" ||
      this.props.records.userDataStatus === "ERROR"
    ) {
      return;
    }

    const userEntityId = this.props.records.userData[0].user.userEntityId;

    this.props.records.userData[0].records[0].workspaces.map((item) => {
      const subjectListFound = arrayCoursesBySubjects.findIndex(
        (aItem) => aItem.subjectId === item.subjectIdentifier
      );

      if (
        item.studentAssessmentState.state === "incomplete" ||
        item.studentAssessmentState.state === "unassessed" ||
        item.studentAssessmentState.state === "pending"
      ) {
        arrayOfOnGoingCourses.push(item);
      } else if (subjectListFound !== -1) {
        arrayCoursesBySubjects[subjectListFound].workspaces.push(item);
      } else {
        let newCourseListBySubject: RecordsBySubject = {
          subjectId: item.subjectIdentifier,
          workspaces: [item],
        };

        arrayCoursesBySubjects.push(newCourseListBySubject);
      }
    });

    return { arrayCoursesBySubjects, arrayOfOnGoingCourses, userEntityId };
  };

  /**
   * evaluationStatus
   * @param state
   * @returns status
   */
  evaluationStatus = (state: WorkspaceAssessementStateType) => {
    let status: "EVALUATED" | "SUPPLEMENTATION" | "ONGOING";

    switch (state) {
      case "incomplete":
        status = "SUPPLEMENTATION";
        break;
      case "pass":
        status = "EVALUATED";
        break;
      case "fail":
        status = "EVALUATED";
        break;
      case "unassessed":
        status = "ONGOING";
        break;
      case "pending":
        status = "ONGOING";
        break;
      default:
    }

    return status;
  };

  /**
   * handleOpenAllSubjectGroupLists
   */
  handleOpenAllSubjectGroupLists =
    (type: "CLOSE" | "OPEN") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (type === "CLOSE") {
        this.setState({
          listOfListsIds: [],
        });
      } else {
        const filteredData = this.filterRecordsBySubject();

        const idList = filteredData.arrayCoursesBySubjects.map(
          (item) => item.subjectId as string
        );

        idList.push("allongoing");

        this.setState({
          listOfListsIds: idList,
        });
      }
    };

  /**
   * handleListOpen
   * @param listId
   */
  handleListOpen = (listId: string) => {
    let updatedList = [...this.state.listOfListsIds];

    const index = updatedList.findIndex((itemId) => itemId === listId);

    if (index !== -1) {
      updatedList.splice(index, 1);
    } else {
      updatedList.push(listId);
    }

    this.setState({
      listOfListsIds: updatedList,
    });
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const filteredData = this.filterRecordsBySubject();

    return (
      <div className="records">
        <h1>Opintosuoritukset</h1>
        <div className="studies-records__section studies-records__section--subject-evaluations">
          <div className="studies-records__section-content">
            <div className="studies-records__section-content-filters">
              <div
                style={{
                  display: "flex",
                  flexGrow: 1,
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginRight: "5px",
                  }}
                >
                  <label>Arviointiaika (alk):</label>
                  <input type="date" />
                </div>
                <div>-</div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "5px",
                  }}
                >
                  <label>Arviointiaika (lop):</label>
                  <input type="date" />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "5px",
                  }}
                >
                  <label>Ryhmä:</label>
                  <select>
                    <option>Kaikki</option>
                    <option>Työnalla</option>
                    <optgroup label="Oppiaine">
                      <option>Äidinkieli</option>
                      <option>Matematiikka</option>
                    </optgroup>
                  </select>
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginLeft: "5px",
                  }}
                >
                  <label>Opintolinja:</label>
                  <select>
                    {this.props.records.userData.map((item, index) => {
                      return (
                        <option value={item.user.studyProgrammeIdentifier}>
                          {index + 1}. {item.user.studyProgrammeName}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div style={{ display: "flex", flexGrow: 1 }}>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flexGrow: 1,
                  }}
                >
                  <label>Haku:</label>
                  <input />
                </div>
              </div>
            </div>
            <div
              style={{
                display: "flex",
                margin: "10px 0 0",
                justifyContent: "end",
              }}
            >
              <Link
                onClick={this.handleOpenAllSubjectGroupLists("OPEN")}
                style={{ margin: "0 5px" }}
              >
                Avaa kaikki
              </Link>
              <Link
                onClick={this.handleOpenAllSubjectGroupLists("CLOSE")}
                style={{ margin: "0 5px" }}
              >
                Sulje kaikki
              </Link>
            </div>

            <div className="studies-records__section-content-subject-list">
              <RecordsList
                key="ongoing"
                name="Työnalla"
                subjectId="allongoing"
                openList={this.state.listOfListsIds.includes("allongoing")}
                onOpenClick={this.handleListOpen}
                courseCount={
                  filteredData &&
                  filteredData.arrayOfOnGoingCourses &&
                  filteredData.arrayOfOnGoingCourses.length
                }
                studiesListType="ongoing"
              >
                <div className="studies-records__section-content-course-list-item studies-records__section-content-course-list-item--header">
                  <div className="studies-records__section-content-course-list-item-cell">
                    <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                      Nimi
                    </div>
                  </div>
                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Suorituspvm
                    </div>
                  </div>
                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Arvioija / Opettaja
                    </div>
                  </div>

                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Arvosana
                    </div>
                  </div>
                  <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                    <div className="studies-records__section-content-course-list-item-cell-label">
                      Tehtävät
                    </div>
                  </div>
                </div>
                {filteredData &&
                  filteredData.arrayOfOnGoingCourses &&
                  filteredData.arrayOfOnGoingCourses.length > 0 &&
                  filteredData.arrayOfOnGoingCourses.map((cItem, index) => (
                    <RecordsListItem
                      key={index}
                      userEntityId={filteredData.userEntityId}
                      courseName={cItem.name}
                      index={index}
                      asessor="Eka Vekara"
                      name={cItem.name}
                      status={this.evaluationStatus(
                        cItem.studentAssessmentState.state
                      )}
                      evaluationDate={cItem.studentAssessmentState.date}
                      grade={cItem.studentAssessmentState.grade}
                      description={cItem.studentAssessmentState.text}
                      workspaceId={cItem.id}
                      studies={{
                        excerciseCount: cItem.studentActivity.exercisesAnswered,
                        maxExcercise: cItem.studentActivity.exercisesTotal,
                        assigmentCount:
                          cItem.studentActivity.evaluablesAnswered,
                        maxAssigment: cItem.studentActivity.evaluablesTotal,
                      }}
                    />
                  ))}
              </RecordsList>

              {filteredData &&
                filteredData.arrayCoursesBySubjects &&
                filteredData.arrayCoursesBySubjects.length > 0 &&
                filteredData.arrayCoursesBySubjects.map((rItem, index) => {
                  const open = this.state.listOfListsIds.includes(
                    rItem.subjectId as string
                  );

                  return (
                    <RecordsList
                      key={index}
                      subjectId={rItem.subjectId as string}
                      name={`AineId ${rItem.subjectId as string}`}
                      courseCount={rItem.workspaces.length}
                      studiesListType="normal"
                      onOpenClick={this.handleListOpen}
                      openList={open}
                    >
                      <div className="studies-records__section-content-course-list-item studies-records__section-content-course-list-item--header">
                        <div className="studies-records__section-content-course-list-item-cell">
                          <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                            Nimi
                          </div>
                        </div>
                        <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                          <div className="studies-records__section-content-course-list-item-cell-label">
                            Suorituspvm
                          </div>
                        </div>
                        <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                          <div className="studies-records__section-content-course-list-item-cell-label">
                            Arvioija / Opettaja
                          </div>
                        </div>

                        <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                          <div className="studies-records__section-content-course-list-item-cell-label">
                            Arvosana
                          </div>
                        </div>
                        <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                          <div className="studies-records__section-content-course-list-item-cell-label">
                            Tehtävät
                          </div>
                        </div>
                      </div>
                      {rItem.workspaces.map((cItem, index) => {
                        return (
                          <RecordsListItem
                            key={index}
                            userEntityId={filteredData.userEntityId}
                            courseName={cItem.name}
                            index={index}
                            asessor="Eka Vekara"
                            name={cItem.name}
                            status={this.evaluationStatus(
                              cItem.studentAssessmentState.state
                            )}
                            evaluationDate={cItem.studentAssessmentState.date}
                            grade={cItem.studentAssessmentState.grade}
                            description={cItem.studentAssessmentState.text}
                            workspaceId={cItem.id}
                            studies={{
                              excerciseCount:
                                cItem.studentActivity.exercisesAnswered,
                              maxExcercise:
                                cItem.studentActivity.exercisesTotal,
                              assigmentCount:
                                cItem.studentActivity.evaluablesAnswered,
                              maxAssigment:
                                cItem.studentActivity.evaluablesTotal,
                            }}
                          />
                        );
                      })}
                    </RecordsList>
                  );
                })}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Records);
