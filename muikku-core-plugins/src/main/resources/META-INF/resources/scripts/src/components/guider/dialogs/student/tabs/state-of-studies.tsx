import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import { bindActionCreators } from "redux";
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
import GuiderToolbarLabels from "../../../body/application/toolbar/labels";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import Avatar from "~/components/general/avatar";
import {
  UpdateCurrentStudentHopsPhaseTriggerType,
  updateCurrentStudentHopsPhase,
} from "~/actions/main-function/guider";
import { AnyActionType } from "~/actions";
import Notes from "~/components/general/notes/notes";
import { Instructions } from "~/components/general/instructions";
import StudyProgress from "~/components/general/study-progress";
import StudyProgressContextProvider from "~/components/general/study-progress/context";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * StateOfStudiesProps
 */
interface StateOfStudiesProps extends WithTranslation {
  guider: GuiderState;
  status: StatusType;
  updateCurrentStudentHopsPhase: UpdateCurrentStudentHopsPhaseTriggerType;
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
   * handleHopsPhaseChange
   * @param e e
   */
  handleHopsPhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.updateCurrentStudentHopsPhase({
      value: e.currentTarget.value,
    });
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
      this.props.guider.currentStudent.emails &&
      this.props.guider.currentStudent.emails.find((e) => e.defaultAddress);

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
        firstName={
          this.props.guider.currentStudent.basic &&
          this.props.guider.currentStudent.basic.firstName
        }
      ></Avatar>
    );

    const studentBasicHeader = this.props.guider.currentStudent.basic && (
      <ApplicationSubPanelViewHeader
        decoration={avatar}
        title={getName(this.props.guider.currentStudent.basic, true)}
        titleDetail={
          (defaultEmailAddress && defaultEmailAddress.address) ||
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
        {this.props.guider.currentStudent.emails && (
          <ApplicationSubPanelItem
            title={this.props.i18n.t("labels.email", { ns: "users" })}
            modifier="currentstudent-emails-list"
          >
            {this.props.guider.currentStudent.emails.length ? (
              this.props.guider.currentStudent.emails.map((email, index) => {
                const emailString = `${email.defaultAddress ? "*" : ""}${
                  email.address
                } (${email.type})`;

                return (
                  <ApplicationSubPanelItem.Content
                    key={`email-${index}-${email.studentIdentifier}`}
                    modifier="currentstudent-email-item"
                  >
                    {emailString}
                  </ApplicationSubPanelItem.Content>
                );
              })
            ) : (
              <ApplicationSubPanelItem.Content>
                {this.props.i18n.t("labels.noEmail", { ns: "guider" })}
              </ApplicationSubPanelItem.Content>
            )}
          </ApplicationSubPanelItem>
        )}
        {this.props.guider.currentStudent.phoneNumbers && (
          <ApplicationSubPanelItem
            title={this.props.i18n.t("labels.phone")}
            modifier="currentstudent-phonenumbers-list"
          >
            {this.props.guider.currentStudent.phoneNumbers.length ? (
              this.props.guider.currentStudent.phoneNumbers.map(
                (phone, index) => {
                  const phoneString = `${phone.defaultNumber ? "*" : ""}${
                    phone.number
                  } (${phone.type})`;

                  return (
                    <ApplicationSubPanelItem.Content
                      key={`phone-${index}-${phone.studentIdentifier}`}
                      modifier="currentstudent-phonenumber-item"
                    >
                      {phoneString}
                    </ApplicationSubPanelItem.Content>
                  );
                }
              )
            ) : (
              <ApplicationSubPanelItem.Content>
                {this.props.i18n.t("labels.noPhone", { ns: "guider" })}
              </ApplicationSubPanelItem.Content>
            )}
          </ApplicationSubPanelItem>
        )}
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
              {this.props.guider.currentStudent.labels &&
              this.props.guider.currentStudent.labels.length ? (
                <ApplicationSubPanel.Body modifier="labels">
                  <div className="labels">{studentLabels}</div>
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
            <ApplicationSubPanel modifier="student-data-container">
              <ApplicationSubPanel>
                <ApplicationSubPanel.Header>
                  {this.props.i18n.t("labels.studyProgress", {
                    ns: "guider",
                  })}
                </ApplicationSubPanel.Header>
                <ApplicationSubPanel.Body>
                  <StudyProgressContextProvider
                    user="supervisor"
                    useCase="state-of-studies"
                    studentId={this.props.guider.currentStudent.basic.id}
                    studentUserEntityId={
                      this.props.guider.currentStudent.basic.userEntityId
                    }
                    dataToLoad={["studentActivity"]}
                  >
                    <StudyProgress
                      curriculumName={
                        this.props.guider.currentStudent.basic.curriculumName
                      }
                      studyProgrammeName={
                        this.props.guider.currentStudent.basic
                          .studyProgrammeName
                      }
                      editMode={true}
                    />
                  </StudyProgressContextProvider>
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      displayNotification,
      updateCurrentStudentHopsPhase,
    },
    dispatch
  );
}

export default withTranslation(["guider"])(
  connect(mapStateToProps, mapDispatchToProps)(StateOfStudies)
);
