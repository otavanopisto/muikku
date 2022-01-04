import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/course.scss";
import "~/sass/elements/activity-badge.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/workspace-activity.scss";
import "~/sass/elements/file-uploader.scss";
import {
  RecordsType,
  TransferCreditType
} from "~/reducers/main-function/records";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import Link from "~/components/general/link";
import {
  WorkspaceType,
  WorkspaceAssessementStateType
} from "~/reducers/workspaces";
import { UserWithSchoolDataType } from "~/reducers/user-index";
import { StateType } from "~/reducers";
import { shortenGrade, getShortenGradeExtension } from "~/util/modifiers";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemHeader
} from "~/components/general/application-list";

interface RecordsProps {
  i18n: i18nType;
  records: RecordsType;
}

interface RecordsState {
  sortDirectionWorkspaces?: string;
  sortDirectionRecords?: string;
  sortedWorkspaces?: any;
  sortedRecords?: any;
}

let storedCurriculumIndex: any = {};

function getEvaluationRequestIfAvailable(
  props: RecordsProps,
  workspace: WorkspaceType
) {
  let assesmentState: WorkspaceAssessementStateType;
  let assesmentDate: string;
  if (
    workspace.studentAssessmentState &&
    workspace.studentAssessmentState.state
  ) {
    assesmentState = workspace.studentAssessmentState.state;
    assesmentDate = workspace.studentAssessmentState.date;
  } else if (
    workspace.studentActivity &&
    workspace.studentActivity.assessmentState
  ) {
    assesmentState = workspace.studentActivity.assessmentState.state;
    assesmentDate = workspace.studentActivity.assessmentState.date;
  }

  if (
    assesmentState === "pending" ||
    assesmentState === "pending_pass" ||
    assesmentState === "pending_fail"
  ) {
    return (
      <span
        title={props.i18n.text.get(
          "plugin.records.workspace.pending",
          props.i18n.time.format(assesmentDate)
        )}
        className="application-list__indicator-badge application-list__indicator-badge--evaluation-request icon-assessment-pending"
      ></span>
    );
  }
  return null;
}

function getTransferCreditValue(
  props: RecordsProps,
  transferCredit: TransferCreditType
) {
  // this shouldn't come to this, but just in case
  if (transferCredit === null) {
    return <div className="application-list__header-secondary" />;
  }

  return (
    <span
      title={
        props.i18n.text.get(
          "plugin.records.transferCreditsDate",
          props.i18n.time.format(transferCredit.date)
        ) + getShortenGradeExtension(transferCredit.grade)
      }
      className={`application-list__indicator-badge application-list__indicator-badge-course ${
        transferCredit.passed ? "state-PASSED" : "state-FAILED"
      }`}
    >
      {shortenGrade(transferCredit.grade)}
    </span>
  );
}

function getAssessments(props: RecordsProps, workspace: WorkspaceType) {
  if (
    workspace.studentAssessmentState &&
    workspace.studentAssessmentState.grade
  ) {
    return (
      <span
        title={
          props.i18n.text.get(
            "plugin.records.workspace.evaluated",
            props.i18n.time.format(workspace.studentAssessmentState.date)
          ) + getShortenGradeExtension(workspace.studentAssessmentState.grade)
        }
        className={`application-list__indicator-badge application-list__indicator-badge--course ${
          workspace.studentAssessmentState.state === "pass" ||
          workspace.studentAssessmentState.state === "pending_pass"
            ? "state-PASSED"
            : "state-FAILED"
        }`}
      >
        {shortenGrade(workspace.studentAssessmentState.grade)}
      </span>
    );
  } else if (
    workspace.studentAssessmentState &&
    workspace.studentAssessmentState.state === "incomplete"
  ) {
    let status = props.i18n.text.get(
      workspace.studentAssessmentState.state === "incomplete"
        ? "plugin.records.workspace.incomplete"
        : "plugin.records.workspace.failed"
    );
    return (
      <span
        title={
          props.i18n.text.get(
            "plugin.records.workspace.evaluated",
            props.i18n.time.format(workspace.studentAssessmentState.date)
          ) +
          " - " +
          status
        }
        className={`application-list__indicator-badge application-list__indicator-badge--course ${
          workspace.studentAssessmentState.state === "incomplete"
            ? "state-INCOMPLETE"
            : "state-FAILED"
        }`}
      >
        {status[0].toLocaleUpperCase()}
      </span>
    );
  } else {
    return null;
  }
}

function getActivity(props: RecordsProps, workspace: WorkspaceType) {
  if (!workspace.studentActivity) {
    return null;
  } else if (
    workspace.studentActivity.exercisesTotal +
      workspace.studentActivity.evaluablesTotal ===
    0
  ) {
    return null;
  }
  let evaluablesCompleted =
    workspace.studentActivity.evaluablesPassed +
    workspace.studentActivity.evaluablesSubmitted +
    workspace.studentActivity.evaluablesFailed +
    workspace.studentActivity.evaluablesIncomplete;
  return (
    <div className="activity-badge">
      {workspace.studentActivity.evaluablesTotal ? (
        <div
          title={props.i18n.text.get(
            "plugin.records.workspace.activity.assignment.title",
            workspace.studentActivity.evaluablesDonePercent
          )}
          className="activity-badge__item activity-badge__item--assignment"
        >
          <div
            className={
              "activity-badge__unit-bar activity-badge__unit-bar--" +
              workspace.studentActivity.evaluablesDonePercent
            }
          ></div>
        </div>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
      {workspace.studentActivity.exercisesTotal ? (
        <div
          title={props.i18n.text.get(
            "plugin.records.workspace.activity.exercise.title",
            workspace.studentActivity.exercisesDonePercent
          )}
          className="activity-badge__item activity-badge__item--exercise"
        >
          <div
            className={
              "activity-badge__unit-bar activity-badge__unit-bar--" +
              workspace.studentActivity.exercisesDonePercent
            }
          ></div>
        </div>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
    </div>
  );
}

class Records extends React.Component<RecordsProps, RecordsState> {
  constructor(props: RecordsProps) {
    super(props);
    this.goToWorkspace = this.goToWorkspace.bind(this);
    this.state = {
      sortDirectionWorkspaces: "desc",
      sortDirectionRecords: "desc"
    };
  }

  goToWorkspace(user: UserWithSchoolDataType, workspace: WorkspaceType) {
    window.location.hash =
      "#?u=" +
      user.userEntityId +
      "&i=" +
      encodeURIComponent(user.id) +
      "&w=" +
      workspace.id;
  }
  sortBy(data: any, key: string, direction: string) {
    data.sort((a: any, b: any) => {
      if (a[key] < b[key]) {
        return direction === "asc" ? -1 : 1;
      }
      if (a[key] > b[key]) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });
  }
  sortWorkspaces(data: any) {
    let key = "name";
    let sortDirection = this.state.sortDirectionWorkspaces;
    let sortedData = this.sortBy(data, key, sortDirection);

    this.setState({
      sortDirectionWorkspaces:
        this.state.sortDirectionWorkspaces === "asc" ? "desc" : "asc",
      sortedWorkspaces: sortedData
    });
  }

  sortRecords(data: any) {
    let key = "courseName";
    let sortDirection = this.state.sortDirectionRecords;
    let sortedData = this.sortBy(data, key, sortDirection);
    this.setState({
      sortDirectionRecords:
        this.state.sortDirectionRecords === "asc" ? "desc" : "asc",
      sortedRecords: sortedData
    });
  }

  render() {
    if (
      this.props.records.userDataStatus === "LOADING" ||
      this.props.records.userDataStatus === "WAIT"
    ) {
      return null;
    } else if (this.props.records.userDataStatus === "ERROR") {
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
    }

    if (
      !Object.keys(storedCurriculumIndex).length &&
      this.props.records.curriculums.length
    ) {
      this.props.records.curriculums.forEach((curriculum) => {
        storedCurriculumIndex[curriculum.identifier] = curriculum.name;
      });
    }

    let studentRecords = (
      <div className="application-sub-panel">
        {this.props.records.userData.map((data) => {
          let user = data.user;
          let records = data.records;
          return (
            <div className="react-required-container" key={data.user.id}>
              <div className="application-sub-panel__header">
                {user.studyProgrammeName}
              </div>
              <div className="application-sub-panel__body">
                {records.length ? (
                  records.map((record, index) => {
                    // TODO this sorting is not right, this needs to be a part of the application list component
                    return (
                      <ApplicationList
                        key={record.groupCurriculumIdentifier || index}
                      >
                        {record.groupCurriculumIdentifier ? (
                          <div
                            onClick={this.sortWorkspaces.bind(
                              this,
                              record.workspaces
                            )}
                            className="application-list__header-container application-list__header-container--sorter"
                          >
                            <h3 className="application-list__header application-list__header--sorter">
                              {record.groupCurriculumIdentifier
                                ? storedCurriculumIndex[
                                    record.groupCurriculumIdentifier
                                  ]
                                : null}
                            </h3>
                            <div
                              className={`icon-sort-alpha-${
                                this.state.sortDirectionWorkspaces === "asc"
                                  ? "desc"
                                  : "asc"
                              }`}
                            ></div>
                          </div>
                        ) : null}
                        {record.workspaces.map((workspace) => {
                          // Do we want an special way to display all these different states? passed is very straightforward but failed and
                          // incomplete might be difficult to understand
                          let extraClassNameState = "";
                          if (
                            workspace.studentAssessmentState.state === "pass"
                          ) {
                            extraClassNameState = "state-PASSED";
                          } else if (
                            workspace.studentAssessmentState.state === "fail"
                          ) {
                            extraClassNameState = "state-FAILED";
                          } else if (
                            workspace.studentAssessmentState.state ===
                            "incomplete"
                          ) {
                            extraClassNameState = "state-INCOMPLETE";
                          }
                          return (
                            <ApplicationListItem
                              className={`course course--studies ${extraClassNameState}`}
                              key={workspace.id}
                              onClick={this.goToWorkspace.bind(
                                this,
                                user,
                                workspace
                              )}
                            >
                              <ApplicationListItemHeader
                                modifiers="course"
                                key={workspace.id}
                              >
                                <span className="application-list__header-icon icon-books"></span>
                                <span className="application-list__header-primary">
                                  {workspace.name}{" "}
                                  {workspace.nameExtension
                                    ? "(" + workspace.nameExtension + ")"
                                    : null}
                                </span>
                                <div className="application-list__header-secondary">
                                  {getEvaluationRequestIfAvailable(
                                    this.props,
                                    workspace
                                  )}
                                  {getAssessments(this.props, workspace)}
                                  {getActivity(this.props, workspace)}
                                </div>
                              </ApplicationListItemHeader>
                            </ApplicationListItem>
                          );
                        })}
                        {record.transferCredits.length ? (
                          <div
                            className="application-list__header-container application-list__header-container--sorter"
                            onClick={this.sortRecords.bind(
                              this,
                              record.transferCredits
                            )}
                          >
                            <h3 className="application-list__header application-list__header--sorter">
                              {this.props.i18n.text.get(
                                "plugin.records.transferCredits"
                              )}{" "}
                              {record.groupCurriculumIdentifier
                                ? storedCurriculumIndex[
                                    record.groupCurriculumIdentifier
                                  ]
                                : null}
                            </h3>
                            <div
                              className={`icon-sort-alpha-${
                                this.state.sortDirectionRecords === "asc"
                                  ? "desc"
                                  : "asc"
                              }`}
                            ></div>
                          </div>
                        ) : null}
                        {record.transferCredits.map((credit) => {
                          return (
                            <ApplicationListItem
                              className="course course--credits"
                              key={credit.identifier}
                            >
                              <ApplicationListItemHeader modifiers="course">
                                <span className="application-list__header-icon icon-books"></span>
                                <span className="application-list__header-primary">
                                  {credit.courseName}
                                </span>
                                <div className="application-list__header-secondary">
                                  {getTransferCreditValue(this.props, credit)}
                                </div>
                              </ApplicationListItemHeader>
                            </ApplicationListItem>
                          );
                        })}
                      </ApplicationList>
                    );
                  })
                ) : (
                  <div className="application-sub-panel__item application-sub-panel__item--empty">
                    {this.props.i18n.text.get("plugin.records.courses.empty")}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
    // Todo fix the first sub-panel border-bottom stuff from guider. It should be removed from title only.

    return (
      <BodyScrollKeeper
        hidden={
          this.props.records.location !== "records" ||
          !!this.props.records.current
        }
      >
        <h2 className="application-panel__content-header">
          {this.props.i18n.text.get("plugin.records.records.title")}
        </h2>

        {studentRecords}
        <div className="application-sub-panel">
          <div className="application-sub-panel__header">
            {this.props.i18n.text.get("plugin.records.files.title")}
          </div>
          <div className="application-sub-panel__body">
            {this.props.records.files.length ? (
              <ApplicationList>
                {this.props.records.files.map((file) => {
                  return (
                    <ApplicationListItem
                      className="application-list__item application-list__item--studies-file-attacment"
                      key={file.id}
                    >
                      <span className="icon-attachment"></span>
                      <Link
                        className="link link--studies-file-attachment"
                        href={`/rest/records/files/${file.id}/content`}
                        openInNewTab={file.title}
                      >
                        {file.title}
                      </Link>
                    </ApplicationListItem>
                  );
                })}
              </ApplicationList>
            ) : (
              <ApplicationListItem className="application-list__item application-list__item--studies-file-attacment">
                {this.props.i18n.text.get("plugin.records.files.empty")}
              </ApplicationListItem>
            )}
          </div>
        </div>
      </BodyScrollKeeper>
    );
  }
}
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records
  };
}
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Records);
