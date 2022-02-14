import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/course.scss";
import "~/sass/elements/activity-badge.scss";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/file-uploader.scss";
import {
  RecordsType,
  TransferCreditType,
} from "~/reducers/main-function/records";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import Link from "~/components/general/link";
import { WorkspaceType, Assessment } from "~/reducers/workspaces";
import { UserWithSchoolDataType } from "~/reducers/user-index";
import { StateType } from "~/reducers";
import { shortenGrade, getShortenGradeExtension } from "~/util/modifiers";
import ApplicationList, {
  ApplicationListItem,
  ApplicationListItemContentContainer,
  ApplicationListItemHeader,
} from "~/components/general/application-list";

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
}

const storedCurriculumIndex: any = {};

/**
 * AssessmentRequestIndicatorProps
 */
interface AssessmentRequestIndicatorProps extends RecordsProps {
  assessment: Assessment;
  i18n: i18nType;
}

/**
 * Creates assessment request indicator if assessmentState is following
 * @param props component props
 * @returns JSX.Element
 */
const AssessmentRequestIndicator: React.FC<AssessmentRequestIndicatorProps> = (
  props
) => {
  const { assessment, i18n } = props;

  if (
    assessment.state === "pending" ||
    assessment.state === "pending_pass" ||
    assessment.state === "pending_fail"
  ) {
    return (
      <span
        title={i18n.text.get(
          "plugin.records.workspace.pending",
          props.i18n.time.format(assessment.date)
        )}
        className="application-list__indicator-badge application-list__indicator-badge--evaluation-request icon-assessment-pending"
      ></span>
    );
  }
  return null;
};

/**
 * TransfereCreditValueIndicatorProps
 */
interface TransfereCreditValueIndicatorProps {
  transferCredit: TransferCreditType;
  i18n: i18nType;
}

/**
 * Creates indicator for transferecredit
 * @param props Component props
 * @returns JSX.Element
 */
const TransfereCreditValueIndicator: React.FC<
  TransfereCreditValueIndicatorProps
> = (props) => {
  const { i18n, transferCredit } = props;

  // this shouldn't come to this, but just in case
  if (transferCredit === null) {
    return <div className="application-list__header-secondary" />;
  }

  return (
    <span
      title={
        i18n.text.get(
          "plugin.records.transferCreditsDate",
          i18n.time.format(transferCredit.date)
        ) + getShortenGradeExtension(transferCredit.grade)
      }
      className={`application-list__indicator-badge application-list__indicator-badge-course ${
        transferCredit.passed ? "state-PASSED" : "state-FAILED"
      }`}
    >
      {shortenGrade(transferCredit.grade)}
    </span>
  );
};

/**
 * AssessmentProps
 */
interface AssessmentProps extends RecordsProps {
  assessment?: Assessment;
  isCombinationWorkspace: boolean;
}

/**
 * Creates component that shows assessment
 * @param props Component props
 * @returns JSX.Element
 */
const RecordsAssessment: React.FC<AssessmentProps> = (props) => {
  const { i18n, assessment, isCombinationWorkspace } = props;

  if (!assessment) {
    return null;
  }

  if (assessment.grade) {
    return (
      <span
        title={
          i18n.text.get(
            "plugin.records.workspace.evaluated",
            i18n.time.format(assessment.date)
          ) + getShortenGradeExtension(assessment.grade)
        }
        className={`application-list__indicator-badge application-list__indicator-badge--course ${
          assessment.state === "pass" || assessment.state === "pending_pass"
            ? "state-PASSED"
            : "state-FAILED"
        }`}
      >
        {shortenGrade(assessment.grade)}
      </span>
    );
  } else if (assessment.state === "incomplete") {
    const status = i18n.text.get(
      assessment.state === "incomplete"
        ? "plugin.records.workspace.incomplete"
        : "plugin.records.workspace.failed"
    );

    return (
      <span
        title={
          i18n.text.get(
            "plugin.records.workspace.evaluated",
            i18n.time.format(assessment.date)
          ) +
          " - " +
          status
        }
        className={`application-list__indicator-badge application-list__indicator-badge--course ${
          assessment.state === "incomplete"
            ? "state-INCOMPLETE"
            : "state-FAILED"
        }`}
      >
        {status[0].toLocaleUpperCase()}
      </span>
    );
  } else {
    if (isCombinationWorkspace) {
      return (
        <span
          title={
            i18n.text.get(
              "plugin.records.workspace.evaluated",
              i18n.time.format(assessment.date)
            ) + getShortenGradeExtension(assessment.grade)
          }
          className={`application-list__indicator-badge application-list__indicator-badge--course ${
            assessment.state === "unassessed" ? "state-UNASSESSED" : null
          }`}
          style={{ color: "black" }}
        >
          -
        </span>
      );
    }
  }

  return null;
};

/**
 * ActivityIndicatorProps
 */
interface ActivityIndicatorProps extends RecordsProps {
  workspace: WorkspaceType;
}

/**
 * Creates activity indicator component if
 * activity property exist and there are excercise
 * @param props component prosp
 * @returns JSX.Element
 */
const ActivityIndicator: React.FC<ActivityIndicatorProps> = (props) => {
  const { workspace, i18n } = props;

  if (!workspace.activity) {
    return null;
  } else if (
    workspace.activity.exercisesTotal + workspace.activity.evaluablesTotal ===
    0
  ) {
    return null;
  }

  return (
    <div className="activity-badge">
      {workspace.activity.evaluablesTotal ? (
        <div
          title={i18n.text.get(
            "plugin.records.workspace.activity.assignment.title",
            workspace.activity.evaluablesDonePercent
          )}
          className="activity-badge__item activity-badge__item--assignment"
        >
          <div
            className={
              "activity-badge__unit-bar activity-badge__unit-bar--" +
              workspace.activity.evaluablesDonePercent
            }
          ></div>
        </div>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
      {workspace.activity.exercisesTotal ? (
        <div
          title={i18n.text.get(
            "plugin.records.workspace.activity.exercise.title",
            workspace.activity.exercisesDonePercent
          )}
          className="activity-badge__item activity-badge__item--exercise"
        >
          <div
            className={
              "activity-badge__unit-bar activity-badge__unit-bar--" +
              workspace.activity.exercisesDonePercent
            }
          ></div>
        </div>
      ) : (
        <div className="activity-badge__item activity-badge__item--empty"></div>
      )}
    </div>
  );
};

/**
 * Records
 */
class Records extends React.Component<RecordsProps, RecordsState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: RecordsProps) {
    super(props);
    this.goToWorkspace = this.goToWorkspace.bind(this);
    this.state = {
      sortDirectionWorkspaces: "desc",
      sortDirectionRecords: "desc",
    };
  }

  /**
   * goToWorkspace
   * @param user user
   * @param workspace workspace
   */
  goToWorkspace(user: UserWithSchoolDataType, workspace: WorkspaceType) {
    window.location.hash =
      "#?u=" +
      user.userEntityId +
      "&i=" +
      encodeURIComponent(user.id) +
      "&w=" +
      workspace.id;
  }

  /**
   * sortBy
   * @param data data
   * @param key key
   * @param direction direction
   */
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

  /**
   * sortWorkspaces
   * @param data data
   */
  sortWorkspaces(data: any) {
    const key = "name";
    const sortDirection = this.state.sortDirectionWorkspaces;
    const sortedData = this.sortBy(data, key, sortDirection);

    this.setState({
      sortDirectionWorkspaces:
        this.state.sortDirectionWorkspaces === "asc" ? "desc" : "asc",
      sortedWorkspaces: sortedData,
    });
  }

  /**
   * sortRecords
   * @param data data
   */
  sortRecords(data: any) {
    const key = "courseName";
    const sortDirection = this.state.sortDirectionRecords;
    const sortedData = this.sortBy(data, key, sortDirection);
    this.setState({
      sortDirectionRecords:
        this.state.sortDirectionRecords === "asc" ? "desc" : "asc",
      sortedRecords: sortedData,
    });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
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

    /**
     * studentRecords
     */
    const studentRecords = (
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
                          // By default every workspace is not combination
                          let isCombinationWorkspace = false;

                          if (workspace.subjects) {
                            // If assessmentState contains more than 1 items, then its is combination
                            isCombinationWorkspace =
                              workspace.subjects.length > 1;
                          }

                          // By default this is undefined so ApplicationListItemHeader won't get empty list
                          // item as part of its modifiers when course is non combined version
                          let applicationListWorkspaceTypeMod = undefined;

                          if (isCombinationWorkspace) {
                            applicationListWorkspaceTypeMod =
                              "combination-course";
                          }

                          return (
                            <ApplicationListItem
                              className="course course--studies"
                              key={workspace.id}
                              onClick={this.goToWorkspace.bind(
                                this,
                                user,
                                workspace
                              )}
                            >
                              <ApplicationListItemHeader
                                modifiers={
                                  applicationListWorkspaceTypeMod
                                    ? [
                                        "course",
                                        applicationListWorkspaceTypeMod,
                                      ]
                                    : ["course"]
                                }
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
                                  {!isCombinationWorkspace ? (
                                    // So "legasy" case where there is only one module, render indicator etc next to workspace name
                                    <>
                                      <AssessmentRequestIndicator
                                        {...this.props}
                                        assessment={
                                          workspace.activity.assessmentState[0]
                                        }
                                      />
                                      <RecordsAssessment
                                        {...this.props}
                                        assessment={
                                          workspace.activity.assessmentState[0]
                                        }
                                        isCombinationWorkspace={
                                          isCombinationWorkspace
                                        }
                                      />
                                    </>
                                  ) : null}
                                  <ActivityIndicator
                                    {...this.props}
                                    workspace={workspace}
                                  />
                                </div>
                              </ApplicationListItemHeader>

                              {isCombinationWorkspace ? (
                                // If combinatin workspace render module assessments below workspace name
                                <ApplicationListItemContentContainer modifiers="combination-course">
                                  {workspace.activity.assessmentState.map(
                                    (a) => {
                                      /**
                                       * Find subject data, that contains basic information about that subject
                                       */
                                      const subjectData =
                                        workspace.subjects.find(
                                          (s) =>
                                            s.identifier ===
                                            a.workspaceSubjectIdentifier
                                        );

                                      /**
                                       * If not found, return nothing
                                       */
                                      if (!subjectData) {
                                        return;
                                      }

                                      return (
                                        <div
                                          key={a.workspaceSubjectIdentifier}
                                          className="application-list__item-content-single-item"
                                        >
                                          <span className="application-list__item-content-single-item-primary">
                                            {subjectData.subject.code.toUpperCase()}{" "}
                                            - {subjectData.subject.name} (
                                            {subjectData.courseLength}
                                            {
                                              subjectData.courseLengthSymbol
                                                .symbol
                                            }
                                            )
                                          </span>

                                          <AssessmentRequestIndicator
                                            {...this.props}
                                            assessment={a}
                                          />

                                          <RecordsAssessment
                                            {...this.props}
                                            assessment={a}
                                            isCombinationWorkspace={
                                              isCombinationWorkspace
                                            }
                                          />
                                        </div>
                                      );
                                    }
                                  )}
                                </ApplicationListItemContentContainer>
                              ) : null}
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
                                  <TransfereCreditValueIndicator
                                    {...this.props}
                                    transferCredit={credit}
                                  />
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
                {this.props.records.files.map((file) => (
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
                ))}
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    records: state.records,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}
export default connect(mapStateToProps, mapDispatchToProps)(Records);
