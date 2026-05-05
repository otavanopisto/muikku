import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { Action, bindActionCreators, Dispatch } from "redux";
import { localize } from "~/locales/i18n";
import "~/sass/elements/link.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/course.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/avatar.scss";
import "~/sass/elements/workspace-activity.scss";
import { getName } from "~/util/modifiers";
import Workspaces from "../workspaces";
import Ceepos from "./state-of-studies/ceepos";
import CeeposButton from "./state-of-studies/ceepos-button";
import { StatusType } from "~/reducers/base/status";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import {
  GuiderState,
  GuiderNotificationStudentsDataType,
} from "~/reducers/main-function/guider";
import NewMessage from "~/components/communicator/dialogs/new-message";
import { ButtonPill } from "~/components/general/button";
import GuiderToolbarLabels from "../../../body/application/toolbar/students/labels";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import Avatar from "~/components/general/avatar";
import { AnyActionType } from "~/actions";
import Notes from "~/components/general/notes/notes";
import { Instructions } from "~/components/general/instructions";
import { withTranslation, WithTranslation } from "react-i18next";
import StudyProgress from "./study-progress";
import Dropdown from "~/components/general/dropdown";
import CommunicatorNewMessage from "~/components/communicator/dialogs/new-message";
import { WhatsappButtonLink } from "~/components/general/whatsapp-link";
import ContactCard from "~/components/general/contact-card";
import GuardianPermissionsDialog from "~/components/profile/dialogs/guardian-permissions";
import Link from "~/components/general/link";

/**
 * StateOfStudiesProps
 */
interface StateOfStudiesProps extends WithTranslation {
  guider: GuiderState;
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * StateOfStudiesState
 */
interface StateOfStudiesState {}
/**
 * StateOfStudies
 */
class StateOfStudies extends React.Component<
  StateOfStudiesProps,
  StateOfStudiesState
> {
  /**
   * constructor
   *
   * @param props props
   */
  constructor(props: StateOfStudiesProps) {
    super(props);
  }

  /**
   * Render statistics
   */
  renderStatistics = () => {
    const { studyDataByEducationTypeCode, selectedEducationTypeCode } =
      this.props.guider.currentStudent;

    if (!studyDataByEducationTypeCode || !selectedEducationTypeCode) {
      return null;
    }

    const studyActivity =
      studyDataByEducationTypeCode[selectedEducationTypeCode]?.studyActivity;
    const curriculumConfig =
      studyDataByEducationTypeCode[selectedEducationTypeCode]?.curriculumConfig;

    if (!studyActivity || !curriculumConfig) {
      return null;
    }

    const statistics =
      curriculumConfig.strategy.calculateStatistics(studyActivity);

    let title = this.props.i18n.t("labels.courseCredits");
    let mandatoryLabel = this.props.t("labels.courseCreditsMandatory");
    let optionalLabel = this.props.t("labels.courseCreditsOptional");
    let totalLabel = this.props.t("labels.courseCreditsTotal");

    if (
      curriculumConfig.type === "compulsory" ||
      curriculumConfig.type === "unknown"
    ) {
      title = this.props.i18n.t("labels.courses");
      mandatoryLabel = this.props.t("labels.courseCreditsMandatory");
      optionalLabel = this.props.t("labels.courseCreditsOptional");
      totalLabel = this.props.t("labels.courseCreditsTotal");
    }

    return (
      <ApplicationSubPanelItem title={title} modifier="guider-course-credits">
        {curriculumConfig.type !== "unknown" && (
          <ApplicationSubPanelItem.Content>
            {`${mandatoryLabel} ${statistics.mandatoryStudies}`}
          </ApplicationSubPanelItem.Content>
        )}
        {curriculumConfig.type !== "unknown" && (
          <ApplicationSubPanelItem.Content>
            {`${optionalLabel} ${statistics.optionalStudies}`}
          </ApplicationSubPanelItem.Content>
        )}
        <ApplicationSubPanelItem.Content>
          {`${totalLabel} ${statistics.totalStudies}`}
        </ApplicationSubPanelItem.Content>
      </ApplicationSubPanelItem>
    );
  };

  //TODO doesn't anyone notice that nor assessment requested, nor no passed courses etc... is available in this view
  /**
   * render
   */
  render() {
    if (this.props.guider.currentStudent === null) {
      return null;
    }

    // Note that some properties are not available until later, that's because it does
    // step by step loading, make sure to show this in the way this is represented, ensure to have
    // a case where the property is not available
    // You can use the cheat && after the property
    // eg. guider.currentStudent.property && guider.currentStudent.property.useSubProperty

    const defaultEmailAddress =
      this.props.guider.currentStudent.contactInfos &&
      this.props.guider.currentStudent.contactInfos.find(
        (e) => e.defaultContact
      ).email;

    const avatar = (
      <Avatar
        id={
          this.props.guider.currentStudent.basic &&
          this.props.guider.currentStudent.basic.userEntityId
        }
        hasImage={
          this.props.guider.currentStudent.basic &&
          this.props.guider.currentStudent.basic.hasImage
        }
        name={
          this.props.guider.currentStudent.basic &&
          this.props.guider.currentStudent.basic.firstName
        }
      ></Avatar>
    );
    const contacts = (
      <ApplicationSubPanel modifier="contact-infos">
        <ApplicationSubPanel.Header>
          {this.props.i18n.t("labels.contactInfo", {
            ns: "users",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          <div className="item-list item-list--student-contact-info">
            {this.props.guider.currentStudent.contactInfos?.map(
              (contact, index) => {
                const contactState = contact.allowStudyDiscussions
                  ? this.props.i18n.t("labels.hasConsentToDiscussStudies", {
                      ns: "users",
                    })
                  : this.props.i18n.t("labels.noConsentToDiscussStudies", {
                      ns: "users",
                    });
                return (
                  <ContactCard
                    key={contact.id}
                    tag={contact.contactType}
                    email={contact.email}
                    phone={contact.phoneNumber}
                    streetAddress={contact.streetAddress}
                    postalCode={contact.postalCode}
                    city={contact.city}
                    country={contact.country}
                    fullName={contact.name}
                    state={contact.contactType && contactState}
                  />
                );
              }
            )}
          </div>
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    );
    const studentGuardians = (
      <ApplicationSubPanel modifier="guardians">
        <ApplicationSubPanel.Header>
          {this.props.i18n.t("labels.guardians", {
            ns: "users",
          })}
        </ApplicationSubPanel.Header>
        <ApplicationSubPanel.Body>
          <div className="item-list item-list--student-guardians">
            {this.props.guider.currentStudent.guardians?.length > 0 &&
              this.props.guider.currentStudent.guardians?.map(
                (guardian, index) => {
                  const { continuedViewPermission } = guardian;
                  const guardianState = continuedViewPermission
                    ? this.props.i18n.t("labels.hasConsentToViewStudies", {
                        ns: "users",
                      })
                    : this.props.i18n.t("labels.noConsentToViewStudies", {
                        ns: "users",
                      });

                  return (
                    <ContactCard
                      key={"guardian" + index}
                      fullName={getName(guardian, true)}
                      state={guardianState}
                    />
                  );
                }
              )}
          </div>
        </ApplicationSubPanel.Body>
      </ApplicationSubPanel>
    );

    const studentBasicHeader = this.props.guider.currentStudent.basic && (
      <ApplicationSubPanelViewHeader
        decoration={avatar}
        title={getName(this.props.guider.currentStudent.basic, true)}
        titleDetail={
          (defaultEmailAddress && defaultEmailAddress) ||
          this.props.i18n.t("labels.noEmail", { ns: "guider" })
        }
      >
        {this.props.guider.currentStudent.basic.ceeposLine !== null &&
        this.props.guider.currentStudent.basic.ceeposLine !== "aineopiskelu" ? (
          <CeeposButton />
        ) : null}
        <NewMessage
          extraNamespace="student-view"
          initialSelectedItems={[
            {
              type: "user",
              value: {
                id: this.props.guider.currentStudent.basic.userEntityId,
                name: getName(this.props.guider.currentStudent.basic, true),
              },
            },
          ]}
        >
          <ButtonPill
            icon="envelope"
            buttonModifiers={["new-message", "guider-student"]}
          />
        </NewMessage>
        <GuiderToolbarLabels />
      </ApplicationSubPanelViewHeader>
    );

    const studentLabels =
      this.props.guider.currentStudent.labels &&
      this.props.guider.currentStudent.labels.map((label) => (
        <span className="label" key={label.id}>
          <span
            className="label__icon icon-flag"
            style={{ color: label.flagColor }}
          ></span>
          <span className="label__text">{label.flagName}</span>
        </span>
      ));

    const studentBasicInfo = this.props.guider.currentStudent.basic && (
      <ApplicationSubPanel.Body>
        <ApplicationSubPanelItem
          title={this.props.i18n.t("labels.studyStartDate", { ns: "users" })}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.studyStartDate
              ? localize.date(
                  this.props.guider.currentStudent.basic.studyStartDate
                )
              : "-"}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        <ApplicationSubPanelItem
          title={this.props.i18n.t("labels.studyEndDate", { ns: "users" })}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.studyEndDate
              ? localize.date(
                  this.props.guider.currentStudent.basic.studyEndDate
                )
              : "-"}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        <ApplicationSubPanelItem
          title={this.props.i18n.t("labels.studyTimeEnd", { ns: "users" })}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.studyTimeEnd
              ? localize.date(
                  this.props.guider.currentStudent.basic.studyTimeEnd
                )
              : "-"}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        <ApplicationSubPanelItem
          title={this.props.i18n.t("labels.school", { ns: "guider" })}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.school ||
              this.props.i18n.t("labels.school", { ns: "guider" })}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        {this.props.guider.currentStudent.usergroups && (
          <ApplicationSubPanelItem
            title={this.props.i18n.t("labels.studentGroups", { ns: "users" })}
            modifier="currentstudent-usergroups-list"
          >
            {this.props.guider.currentStudent.usergroups.length ? (
              this.props.guider.currentStudent.usergroups.map((usergroup) => (
                <ApplicationSubPanelItem.Content
                  key={`group-${usergroup.id}`}
                  modifier="currentstudent-usergroup-item"
                >
                  {`${usergroup.name} `}
                </ApplicationSubPanelItem.Content>
              ))
            ) : (
              <ApplicationSubPanelItem.Content>
                {this.props.i18n.t("content.empty", {
                  ns: "users",
                  context: "studentGroups",
                })}
              </ApplicationSubPanelItem.Content>
            )}
          </ApplicationSubPanelItem>
        )}
        {this.props.guider.currentStudent.basic && (
          <ApplicationSubPanelItem
            title={this.props.i18n.t("labels.lastLogin", { ns: "guider" })}
          >
            <ApplicationSubPanelItem.Content>
              {this.props.guider.currentStudent.basic.lastLogin
                ? localize.date(
                    this.props.guider.currentStudent.basic.lastLogin,
                    "LLL"
                  )
                : "-"}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        )}
        {this.props.guider.currentStudent.notifications &&
          Object.keys(this.props.guider.currentStudent.notifications).map(
            (notification: keyof GuiderNotificationStudentsDataType) => {
              <ApplicationSubPanelItem
                title={this.props.i18n.t("labels.studentNotification", {
                  ns: "guider",
                  context: notification,
                })}
                modifier="notification"
                key={notification}
              >
                <ApplicationSubPanelItem.Content>
                  {localize.date(
                    this.props.guider.currentStudent.notifications[notification]
                  )}
                </ApplicationSubPanelItem.Content>
              </ApplicationSubPanelItem>;
            }
          )}

        {this.renderStatistics()}
      </ApplicationSubPanel.Body>
    );

    const studentWorkspaces = (
      <Workspaces
        workspaces={
          this.props.guider.currentStudent.currentWorkspaces &&
          this.props.guider.currentStudent.currentWorkspaces
        }
      />
    );

    return (
      <>
        {this.props.guider.currentStudentState === "LOADING" ? (
          <ApplicationSubPanel>
            <div className="loader-empty" />
          </ApplicationSubPanel>
        ) : (
          <>
            <ApplicationSubPanel modifier="guider-student-header">
              {studentBasicHeader}
              {(this.props.guider.currentStudent.labels &&
                this.props.guider.currentStudent.labels.length) ||
              this.props.guider.currentStudent.basic.hasPedagogyForm ||
              this.props.guider.currentStudent.basic.u18Compulsory ? (
                <ApplicationSubPanel.Body modifier="labels">
                  <div className="labels">
                    {studentLabels}

                    {this.props.guider.currentStudent.basic.hasPedagogyForm ? (
                      <Dropdown
                        alignSelfVertically="top"
                        openByHover
                        content={
                          <span
                            id={
                              `pedagogyPlan-` +
                              this.props.guider.currentStudent.basic.id
                            }
                          >
                            {this.props.i18n.t("labels.pedagogyPlan", {
                              ns: "common",
                            })}
                          </span>
                        }
                      >
                        <div className="label label--pedagogy-plan">
                          <span
                            className="label__text label__text--pedagogy-plan"
                            aria-labelledby={
                              `pedagogyPlan-` +
                              this.props.guider.currentStudent.basic.id
                            }
                          >
                            P
                          </span>
                        </div>
                      </Dropdown>
                    ) : null}

                    {this.props.guider.currentStudent.basic.u18Compulsory ? (
                      <Dropdown
                        alignSelfVertically="top"
                        openByHover
                        content={
                          <span
                            id={
                              `u18Compulsory-` +
                              this.props.guider.currentStudent.basic.id
                            }
                          >
                            {this.props.i18n.t("labels.u18Compulsory", {
                              ns: "common",
                            })}
                          </span>
                        }
                      >
                        <div className="label label--u18-compulsory">
                          <span
                            className="label__text label__text--u18-compulsory"
                            aria-labelledby={
                              `u18Compulsory-` +
                              this.props.guider.currentStudent.basic.id
                            }
                          >
                            O
                          </span>
                        </div>
                      </Dropdown>
                    ) : null}
                  </div>
                </ApplicationSubPanel.Body>
              ) : null}
            </ApplicationSubPanel>
            <ApplicationSubPanel modifier="student-data-container">
              <ApplicationSubPanel modifier="student-data-primary">
                {studentBasicInfo}
              </ApplicationSubPanel>
              <ApplicationSubPanel modifier="student-data-secondary">
                {this.props.guider.currentStudent.basic &&
                this.props.guider.currentStudent.basic.ceeposLine !== null ? (
                  <ApplicationSubPanel>
                    <ApplicationSubPanel.Header>
                      {this.props.i18n.t("labels.orders", {
                        ns: "orders",
                      })}
                    </ApplicationSubPanel.Header>
                    <ApplicationSubPanel.Body>
                      <Ceepos />
                    </ApplicationSubPanel.Body>
                  </ApplicationSubPanel>
                ) : null}

                <ApplicationSubPanel.Header>
                  {this.props.i18n.t("labels.workspaces", { ns: "workspace" })}
                </ApplicationSubPanel.Header>

                <ApplicationSubPanel.Body>
                  {studentWorkspaces}
                </ApplicationSubPanel.Body>
              </ApplicationSubPanel>
            </ApplicationSubPanel>

            {contacts}
            {this.props.guider.currentStudent.guardians.length > 0 &&
              studentGuardians}
            <ApplicationSubPanel modifier="counselors">
              <ApplicationSubPanel.Header modifier="with-instructions">
                {this.props.i18n.t("labels.counselors", {
                  ns: "users",
                })}
                <Instructions
                  modifier="instructions"
                  alignSelfVertically="top"
                  openByHover={false}
                  closeOnClick={true}
                  closeOnOutsideClick={true}
                  persistent
                  content={
                    <div
                      dangerouslySetInnerHTML={{
                        __html: this.props.i18n.t(
                          "content.counselorsDescription",
                          {
                            ns: "studies",
                          }
                        ),
                      }}
                    />
                  }
                />
              </ApplicationSubPanel.Header>
              <ApplicationSubPanel.Body>
                <div className="item-list item-list--student-counselors">
                  {this.props.guider.currentStudent.basic.guidanceCounselors
                    .length > 0 ? (
                    this.props.guider.currentStudent.basic.guidanceCounselors.map(
                      (counselor) => {
                        const {
                          userEntityId,
                          email,
                          hasImage,
                          groupAdvisor,
                          studyAdvisor,
                          properties,
                        } = counselor;
                        const councelorActions = (
                          <>
                            <CommunicatorNewMessage
                              extraNamespace="guidance-counselor"
                              initialSelectedItems={[
                                {
                                  type: "staff",
                                  value: {
                                    id: userEntityId,
                                    name: getName(counselor, true),
                                  },
                                },
                              ]}
                            >
                              <ButtonPill
                                icon="envelope"
                                aria-label={this.props.i18n.t("labels.send", {
                                  ns: "messaging",
                                })}
                                title={this.props.i18n.t("labels.send", {
                                  ns: "messaging",
                                })}
                                buttonModifiers={[
                                  "new-message",
                                  "new-message-to-staff",
                                ]}
                              ></ButtonPill>
                            </CommunicatorNewMessage>
                            {properties["profile-phone"] &&
                            properties["profile-whatsapp"] ? (
                              <WhatsappButtonLink
                                mobileNumber={properties["profile-phone"]}
                              />
                            ) : null}
                            {properties["profile-appointmentCalendar"] ? (
                              <ButtonPill
                                aria-label={this.props.i18n.t(
                                  "labels.appointment"
                                )}
                                title={this.props.i18n.t("labels.appointment")}
                                icon="clock"
                                buttonModifiers="appointment-calendar"
                                openInNewTab="_blank"
                                href={properties["profile-appointmentCalendar"]}
                              />
                            ) : null}
                          </>
                        );

                        return (
                          <ContactCard
                            key={userEntityId}
                            actions={councelorActions}
                            fullName={getName(counselor, true)}
                            hasImage={hasImage}
                            id={userEntityId}
                            email={email}
                            phone={properties["profile-phone"]}
                            groupAdvisor={groupAdvisor}
                            studyAdvisor={studyAdvisor}
                            vacationStart={properties["profile-vacationStart"]}
                            vacationEnd={properties["profile-vacationEnd"]}
                          />
                        );
                      }
                    )
                  ) : (
                    <div className="empty">
                      <span>
                        {this.props.i18n.t("content.empty", {
                          ns: "guider",
                          context: "counselors",
                        })}
                      </span>
                    </div>
                  )}
                </div>
              </ApplicationSubPanel.Body>
            </ApplicationSubPanel>
            <ApplicationSubPanel modifier="student-data-container">
              <ApplicationSubPanel>
                <ApplicationSubPanel.Header>
                  {this.props.i18n.t("labels.studyProgress", {
                    ns: "guider",
                  })}
                </ApplicationSubPanel.Header>

                <ApplicationSubPanel.Body>
                  <StudyProgress
                    studentIdentifier={
                      this.props.guider.currentStudent.basic.id
                    }
                    studentUserEntityId={
                      this.props.guider.currentStudent.basic.userEntityId
                    }
                    curriculumName={
                      this.props.guider.currentStudent.basic.curriculumName
                    }
                    studyProgrammeName={
                      this.props.guider.currentStudent.basic.studyProgrammeName
                    }
                  />
                </ApplicationSubPanel.Body>
              </ApplicationSubPanel>
            </ApplicationSubPanel>
            <ApplicationSubPanel modifier="student-data-container">
              <ApplicationSubPanel>
                <ApplicationSubPanel.Header>
                  {this.props.i18n.t("labels.tasks", { ns: "tasks" })}
                  <Instructions
                    modifier="instructions"
                    alignSelfVertically="top"
                    openByHover={false}
                    closeOnClick={true}
                    closeOnOutsideClick={false}
                    persistent
                    content={
                      <div
                        dangerouslySetInnerHTML={{
                          __html: this.props.i18n.t(
                            "content.addTaskInstruction",
                            { ns: "guider" }
                          ),
                        }}
                      />
                    }
                  />
                </ApplicationSubPanel.Header>
                <ApplicationSubPanel.Body>
                  <Notes
                    userId={this.props.status.userId}
                    usePlace="guider"
                    studentId={
                      this.props.guider.currentStudent.basic.userEntityId
                    }
                    showHistoryPanel
                  />
                </ApplicationSubPanel.Body>
              </ApplicationSubPanel>
            </ApplicationSubPanel>
          </>
        )}
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    guider: state.guider,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      displayNotification,
    },
    dispatch
  );
}

export default withTranslation(["guider"])(
  connect(mapStateToProps, mapDispatchToProps)(StateOfStudies)
);
