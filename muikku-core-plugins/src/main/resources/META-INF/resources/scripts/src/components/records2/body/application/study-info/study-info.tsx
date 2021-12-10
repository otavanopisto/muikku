import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/study-info.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import Avatar from "~/components/general/avatar";
import { RecordsType } from "~/reducers/main-function/records";
import { SummaryType } from "~/reducers/main-function/records/summary";
import { StatusType } from "~/reducers/base/status";
import { HOPSType } from "~/reducers/main-function/hops";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import * as moment from "moment";
import { getName } from "~/util/modifiers";

/**
 * RecordsProps
 */
interface StudyInfoProps {
  i18n: i18nType;
  records: RecordsType;
  summary: SummaryType;
  status: StatusType;
  hops: HOPSType;
}

/**
 * RecordsState
 */
interface StudyInfoState {
  sortDirectionWorkspaces?: string;
  sortDirectionRecords?: string;
  sortedWorkspaces?: any;
  sortedRecords?: any;
}

/**
 * StudyInfo
 */
class StudyInfo extends React.Component<StudyInfoProps, StudyInfoState> {
  constructor(props: StudyInfoProps) {
    super(props);

    this.state = {};
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    if (
      this.props.records.location !== "info" ||
      this.props.summary.status !== "READY"
    ) {
      return null;
    }

    let studentBasicInfo = (
      <div className="application-sub-panel--study-info">
        <div
          className="application-sub-panel__header"
          style={{ width: "100%" }}
        >
          Opintojen tiedot
        </div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-summary-info">
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get("plugin.records.studyStartDateLabel")}
            </div>
            <div className="application-sub-panel__item-data application-sub-panel__item-data--study-start-date">
              <span className="application-sub-panel__single-entry">
                {this.props.summary.data.studentsDetails.studyStartDate
                  ? this.props.i18n.time.format(
                      this.props.summary.data.studentsDetails.studyStartDate
                    )
                  : this.props.i18n.text.get(
                      "plugin.records.summary.studyTime.empty"
                    )}
              </span>
            </div>
          </div>
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                this.props.summary.data.studentsDetails.studyEndDate
                  ? "plugin.records.studyEndDateLabel"
                  : "plugin.records.studyTimeEndLabel"
              )}
            </div>
            <div className="application-sub-panel__item-data application-sub-panel__item-data--study-end-date">
              <span className="application-sub-panel__single-entry">
                {this.props.summary.data.studentsDetails.studyEndDate ||
                this.props.summary.data.studentsDetails.studyTimeEnd
                  ? this.props.i18n.time.format(
                      this.props.summary.data.studentsDetails.studyEndDate ||
                        this.props.summary.data.studentsDetails.studyTimeEnd
                    )
                  : this.props.i18n.text.get(
                      "plugin.records.summary.studyTime.empty"
                    )}
              </span>
            </div>
          </div>

          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.records.studyStudentCouncelorsLabel"
              )}
            </div>
            <div className="application-sub-panel__item-data application-sub-panel__item-data--summary-student-councelors">
              <div className="item-list item-list--student-councelors">
                {this.props.summary.data.studentsStudentCouncelors.map(
                  (councelor, index) => {
                    let displayVacationPeriod =
                      !!councelor.properties["profile-vacation-start"];
                    if (councelor.properties["profile-vacation-end"]) {
                      // we must check for the ending
                      const vacationEndsAt = moment(
                        councelor.properties["profile-vacation-end"]
                      );
                      const today = moment();
                      // if it's before or it's today then we display, otherwise nope
                      displayVacationPeriod =
                        vacationEndsAt.isAfter(today, "day") ||
                        vacationEndsAt.isSame(today, "day");
                    }
                    return (
                      <div
                        className="item-list__item item-list__item--student-councelor"
                        key={councelor.userEntityId}
                      >
                        <div className="item-list__profile-picture">
                          <Avatar
                            id={councelor.userEntityId}
                            userCategory={3}
                            firstName={councelor.firstName}
                            hasImage={councelor.hasImage}
                          />
                        </div>
                        <div className="item-list__text-body item-list__text-body--multiline">
                          <div className="item-list__user-name">
                            {councelor.firstName} {councelor.lastName}
                          </div>
                          <div className="item-list__user-contact-info">
                            <div className="item-list__user-email">
                              <div className="glyph icon-envelope"></div>
                              {councelor.email}
                            </div>
                            {councelor.properties["profile-phone"] ? (
                              <div className="item-list__user-phone">
                                <div className="glyph icon-phone"></div>
                                {councelor.properties["profile-phone"]}
                              </div>
                            ) : null}
                          </div>
                          {displayVacationPeriod ? (
                            <div className="item-list__user-vacation-period">
                              {this.props.i18n.text.get(
                                "plugin.workspace.index.teachersVacationPeriod.label"
                              )}
                              &nbsp;
                              {this.props.i18n.time.format(
                                councelor.properties["profile-vacation-start"]
                              )}
                              {councelor.properties["profile-vacation-end"]
                                ? "–" +
                                  this.props.i18n.time.format(
                                    councelor.properties["profile-vacation-end"]
                                  )
                                : null}
                            </div>
                          ) : null}
                          <CommunicatorNewMessage
                            extraNamespace="guidance-councelor"
                            initialSelectedItems={[
                              {
                                type: "staff",
                                value: {
                                  id: councelor.userEntityId,
                                  name: getName(councelor, true),
                                },
                              },
                            ]}
                          >
                            <Button
                              buttonModifiers={[
                                "info",
                                "contact-student-councelor",
                              ]}
                            >
                              {this.props.i18n.text.get(
                                "plugin.records.contactStudentCouncelor.message.label"
                              )}
                            </Button>
                          </CommunicatorNewMessage>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="application-sub-panel__body application-sub-panel__body--studies-options">
          <h1>Asetuksia</h1>
        </div>
      </div>
    );

    return (
      <section>
        <h2 className="application-panel__content-header">
          {this.props.i18n.text.get("plugin.records.summary.title")}
        </h2>
        {studentBasicInfo}
      </section>
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
    summary: state.summary,
    status: state.status,
    hops: state.hops,
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
export default connect(mapStateToProps, mapDispatchToProps)(StudyInfo);
