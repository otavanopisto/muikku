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
import { RecordsList, RecordsListItem } from "./records-list";
import {
  WorkspaceType,
  WorkspaceAssessementStateType,
} from "~/reducers/workspaces";

/**
 * RecordsBySubject
 */
interface RecordsBySubject {
  subjectId: string | number;
  workspaces: WorkspaceType[];
}

/**
 * Filters
 */
interface Filters {
  /**
   * aka Study programm id
   */
  studyProgram?: string;
  /**
   * ongoing, transfered, "all", or subject name
   */
  group?: string;
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
  filters: Filters;
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
      filters: {
        group: "",
      },
    };
  }

  /**
   * componentDidUpdate
   */
  componentDidUpdate = (prevProps: RecordsProps, prevState: RecordsState) => {
    if (
      this.props.records.userDataStatus !== prevProps.records.userDataStatus
    ) {
      if (this.props.records.userDataStatus === "READY") {
        const studyProgram =
          this.props.records.userData[this.props.records.userData.length - 1]
            .user.studyProgrammeIdentifier;

        this.setState({
          filters: {
            ...this.state.filters,
            studyProgram: studyProgram,
          },
        });
      }
    }
  };

  /**
   * filterRecordsBySubject
   * @returns Object of filtered records data
   */
  filterRecordsBySubject = () => {
    /**
     * Initial data what will be returned
     */
    let transferedCourses: TransferCreditType[] = [];
    const arrayOfOnGoingCourses: WorkspaceType[] = [];
    const arrayCoursesBySubjects: RecordsBySubject[] = [];

    /**
     * User data by default, which should be found by ongoing programme
     */
    const userDatas = this.props.records.userData.find(
      (uItem) =>
        uItem.user.studyProgrammeIdentifier === this.state.filters.studyProgram
    );

    /**
     * If not found, then return null
     */
    if (!userDatas) {
      return;
    }

    const userEntityId = userDatas.user.userEntityId;

    /**
     * Initialize workspace list to help filter data
     */
    let workspaces: WorkspaceType[] = [];

    /**
     * concat workspaces previously initialize list and transfered studies its own
     */
    userDatas.records.map((rItem) => {
      if (
        this.state.filters.group === "" ||
        this.state.filters.group === "alltransfered"
      ) {
        transferedCourses = transferedCourses.concat(rItem.transferCredits);
      }

      workspaces = workspaces.concat(rItem.workspaces);
    });

    /**
     * Filter by "allongoing" group
     */
    if (
      this.state.filters.group === "" ||
      this.state.filters.group === "allongoing"
    ) {
      for (const workspace of workspaces) {
        if (
          (this.state.filters.group === "" ||
            this.state.filters.group === "allongoing") &&
          (workspace.studentAssessmentState.state === "incomplete" ||
            workspace.studentAssessmentState.state === "unassessed" ||
            workspace.studentAssessmentState.state === "pending")
        ) {
          arrayOfOnGoingCourses.push(workspace);
        }
      }
    }

    /**
     * Filter by "subject" and set subject object to hold all studies under that are done in that subject
     */
    if (this.state.filters.group === "") {
      for (const workspace of workspaces) {
        const subjectListFound = arrayCoursesBySubjects.findIndex(
          (aItem) => aItem.subjectId === workspace.subjectIdentifier
        );

        if (
          workspace.studentAssessmentState.state === "incomplete" ||
          workspace.studentAssessmentState.state === "unassessed" ||
          workspace.studentAssessmentState.state === "pending"
        ) {
          continue;
        }

        if (subjectListFound !== -1) {
          arrayCoursesBySubjects[subjectListFound].workspaces.push(workspace);
        } else {
          let newCourseListBySubject: RecordsBySubject = {
            subjectId: workspace.subjectIdentifier,
            workspaces: [workspace],
          };

          arrayCoursesBySubjects.push(newCourseListBySubject);
        }
      }
    }

    return {
      arrayCoursesBySubjects,
      arrayOfOnGoingCourses,
      transferedCourses,
      userEntityId,
    };
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

        idList.push("alltransfered");

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
   * handleFilterChange
   * @param filterName
   */
  handleFilterChange =
    (filterName: keyof Filters) =>
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      let updatedFilters: Filters = {
        ...this.state.filters,
        [filterName]: e.currentTarget.value,
      };

      this.setState({
        filters: updatedFilters,
      });
    };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    if (
      this.props.records.userDataStatus === "LOADING" ||
      this.props.records.userDataStatus === "WAIT"
    ) {
      return null;
    }

    const filteredData = this.filterRecordsBySubject();

    const curriculums = this.props.records.curriculums;

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
                  }}
                >
                  <label>Ryhmä:</label>
                  <select
                    onChange={this.handleFilterChange("group")}
                    value={this.state.filters.group}
                  >
                    <option value="">Kaikki</option>
                    <option value="allongoing">Työnalla</option>
                    <option value="alltransfered">HyväksiLuvut</option>
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
                  <select
                    onChange={this.handleFilterChange("studyProgram")}
                    value={this.state.filters.studyProgram}
                  >
                    {this.props.records.userData.map((item, index) => {
                      return (
                        <option
                          key={item.user.studyProgrammeIdentifier}
                          value={item.user.studyProgrammeIdentifier}
                        >
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

            {this.state.filters.group === "" ||
            this.state.filters.group === "allongoing" ? (
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
                    <div
                      className="studies-records__section-content-course-list-item-cell"
                      style={{ borderLeft: "10px solid transparent" }}
                    >
                      <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                        Nimi
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Arviointipvm.
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
                          excerciseCount:
                            cItem.studentActivity.exercisesAnswered,
                          maxExcercise: cItem.studentActivity.exercisesTotal,
                          assigmentCount:
                            cItem.studentActivity.evaluablesAnswered,
                          maxAssigment: cItem.studentActivity.evaluablesTotal,
                        }}
                      />
                    ))}
                </RecordsList>
              </div>
            ) : null}

            {this.state.filters.group === "" ||
            this.state.filters.group === "alltransfered" ? (
              <div className="studies-records__section-content-subject-list">
                <RecordsList
                  key="transfered"
                  name="Hyväksiluetut"
                  subjectId="alltransfered"
                  openList={this.state.listOfListsIds.includes("alltransfered")}
                  onOpenClick={this.handleListOpen}
                  courseCount={
                    filteredData &&
                    filteredData.transferedCourses &&
                    filteredData.transferedCourses.length
                  }
                  studiesListType="ongoing"
                >
                  <div className="studies-records__section-content-course-list-item studies-records__section-content-course-list-item--header">
                    <div
                      className="studies-records__section-content-course-list-item-cell"
                      style={{ borderLeft: "10px solid transparent" }}
                    >
                      <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                        Nimi
                      </div>
                    </div>
                    <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                      <div className="studies-records__section-content-course-list-item-cell-label">
                        Hyväksilukupvm.
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
                    filteredData.transferedCourses &&
                    filteredData.transferedCourses.length > 0 &&
                    filteredData.transferedCourses.map((tItem, index) => {
                      const curriculum = curriculums.find(
                        (item) => item.identifier === tItem.curriculumIdentifier
                      );

                      return (
                        <RecordsListItem
                          key={tItem.identifier}
                          userEntityId={filteredData.userEntityId}
                          courseName={`${tItem.courseName} (${curriculum.name}) `}
                          index={index}
                          asessor="Eka Vekara"
                          name={`${tItem.courseName} (${curriculum.name}) `}
                          status="TRANSFERED"
                          evaluationDate={tItem.date}
                          grade={tItem.grade}
                        />
                      );
                    })}
                </RecordsList>
              </div>
            ) : null}

            <div className="studies-records__section-content-subject-list">
              {filteredData &&
              filteredData.arrayCoursesBySubjects &&
              filteredData.arrayCoursesBySubjects.length > 0
                ? filteredData.arrayCoursesBySubjects.map((rItem, index) => {
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
                          <div
                            className="studies-records__section-content-course-list-item-cell"
                            style={{ borderLeft: "10px solid transparent" }}
                          >
                            <div className="studies-records__section-content-course-list-item-cell-label studies-records__section-content-course-list-item-cell-label--name">
                              Nimi
                            </div>
                          </div>
                          <div className="studies-records__section-content-course-list-item-cell studies-records__section-content-course-list-item--header">
                            <div className="studies-records__section-content-course-list-item-cell-label">
                              Arviointipvm.
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
                  })
                : null}
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
