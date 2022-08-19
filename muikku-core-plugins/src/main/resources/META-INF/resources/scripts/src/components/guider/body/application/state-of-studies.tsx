import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/course.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/application-sub-panel.scss";
import "~/sass/elements/avatar.scss";
import "~/sass/elements/workspace-activity.scss";
import { getName } from "~/util/modifiers";
import Workspaces from "./workspaces";
import Ceepos from "./state-of-studies/ceepos";
import CeeposButton from "./state-of-studies/ceepos-button";
import { StatusType } from "~/reducers/base/status";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";

import { StateType } from "~/reducers";
import {
  GuiderType,
  GuiderStudentUserProfileLabelType,
  GuiderNotificationStudentsDataType,
} from "~/reducers/main-function/guider";
import NewMessage from "~/components/communicator/dialogs/new-message";
import { ButtonPill } from "~/components/general/button";
import GuiderToolbarLabels from "./toolbar/labels";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import Avatar from "~/components/general/avatar";
import Notes from "~/components/general/notes/notes";

// import GuidanceEvent from "../../dialogs/guidance-event";
// import { CalendarEvent } from "~/reducers/main-function/calendar";
// import { ResourceTimeline } from "../../../general/resource-timeline";
// import { ExternalEventType } from "../../../general/resource-timeline";
import {
  UpdateCurrentStudentHopsPhaseTriggerType,
  updateCurrentStudentHopsPhase,
} from "~/actions/main-function/guider";
import StudySuggestionMatrix from "./study-suggestion-matrix";
import { AnyActionType } from "~/actions";
import { COMPULSORY_HOPS_VISIBLITY } from "~/components/general/hops-compulsory-education-wizard";

/**
 * StateOfStudiesProps
 */
interface StateOfStudiesProps {
  i18n: i18nType;
  guider: GuiderType;
  status: StatusType;

  displayNotification: DisplayNotificationTriggerType;
  updateCurrentStudentHopsPhase: UpdateCurrentStudentHopsPhaseTriggerType;
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

    //Note that some properties are not available until later, that's because it does
    //step by step loading, make sure to show this in the way this is represented, ensure to have
    //a case where the property is not available
    //You can use the cheat && after the property
    //eg. guider.currentStudent.property && guider.currentStudent.property.useSubProperty

    /**
     * IsStudentPartOfProperStudyProgram
     * @param studyProgramName the name of the study programme
     * @returns true or false
     */
    const IsStudentPartOfProperStudyProgram = (studyProgramName: string) => {
      switch (studyProgramName) {
        case "Nettilukio/yksityisopiskelu (aineopintoina)":
        case "Aineopiskelu/yo-tutkinto":
          return true;
        default:
          return false;
      }
    };

    const defaultEmailAddress =
      this.props.guider.currentStudent.emails &&
      this.props.guider.currentStudent.emails.find((e) => e.defaultAddress);

    const studentBasicHeader = this.props.guider.currentStudent.basic && (
      <ApplicationSubPanel.Header>
        <Avatar
          id={this.props.guider.currentStudent.basic.userEntityId}
          hasImage={this.props.guider.currentStudent.basic.hasImage}
          firstName={this.props.guider.currentStudent.basic.firstName}
        ></Avatar>
        <ApplicationSubPanelViewHeader
          title={getName(this.props.guider.currentStudent.basic, true)}
          titleDetail={
            (defaultEmailAddress && defaultEmailAddress.address) ||
            this.props.i18n.text.get(
              "plugin.guider.user.details.label.unknown.email"
            )
          }
        >
          {this.props.guider.currentStudent.basic &&
          IsStudentPartOfProperStudyProgram(
            this.props.guider.currentStudent.basic.studyProgrammeName
          ) ? (
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
          {/* Not implemented yet
          <GuidanceEvent>
            <ButtonPill
              icon="bubbles"
              buttonModifiers={["new-message", "guider-student"]}
            />
          </GuidanceEvent> */}
          <GuiderToolbarLabels />
        </ApplicationSubPanelViewHeader>
      </ApplicationSubPanel.Header>
    );

    const studentLabels =
      this.props.guider.currentStudent.labels &&
      this.props.guider.currentStudent.labels.map(
        (label: GuiderStudentUserProfileLabelType) => (
          <span className="label" key={label.id}>
            <span
              className="label__icon icon-flag"
              style={{ color: label.flagColor }}
            ></span>
            <span className="label__text">{label.flagName}</span>
          </span>
        )
      );

    const studentBasicInfo = this.props.guider.currentStudent.basic && (
      <div className="application-sub-panel__body">
        <ApplicationSubPanelItem
          title={this.props.i18n.text.get(
            "plugin.guider.user.details.label.studyStartDateTitle"
          )}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.studyStartDate
              ? this.props.i18n.time.format(
                  this.props.guider.currentStudent.basic.studyStartDate
                )
              : "-"}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        <ApplicationSubPanelItem
          title={this.props.i18n.text.get(
            "plugin.guider.user.details.label.studyEndDateTitle"
          )}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.studyEndDate
              ? this.props.i18n.time.format(
                  this.props.guider.currentStudent.basic.studyEndDate
                )
              : "-"}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        <ApplicationSubPanelItem
          title={this.props.i18n.text.get(
            "plugin.guider.user.details.label.studyTimeEndTitle"
          )}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.studyTimeEnd
              ? this.props.i18n.time.format(
                  this.props.guider.currentStudent.basic.studyTimeEnd
                )
              : "-"}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        {this.props.guider.currentStudent.emails && (
          <ApplicationSubPanelItem
            title={this.props.i18n.text.get(
              "plugin.guider.user.details.label.email"
            )}
          >
            <ApplicationSubPanelItem.Content>
              {this.props.guider.currentStudent.emails.length
                ? this.props.guider.currentStudent.emails.map(
                    (email, index) => (
                      <React.Fragment key={index}>
                        {email.defaultAddress ? `*` : null} {email.address} (
                        {email.type})
                      </React.Fragment>
                    )
                  )
                : this.props.i18n.text.get(
                    "plugin.guider.user.details.label.unknown.email"
                  )}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        )}
        {this.props.guider.currentStudent.phoneNumbers && (
          <ApplicationSubPanelItem
            title={this.props.i18n.text.get(
              "plugin.guider.user.details.label.phoneNumber"
            )}
          >
            <ApplicationSubPanelItem.Content>
              {this.props.guider.currentStudent.phoneNumbers.length
                ? this.props.guider.currentStudent.phoneNumbers.map(
                    (phone, index) => (
                      <React.Fragment key={index}>
                        {phone.defaultNumber ? `*` : null} {phone.number} (
                        {phone.type})
                      </React.Fragment>
                    )
                  )
                : this.props.i18n.text.get(
                    "plugin.guider.user.details.label.unknown.phoneNumber"
                  )}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        )}
        <ApplicationSubPanelItem
          title={this.props.i18n.text.get(
            "plugin.guider.user.details.label.school"
          )}
        >
          <ApplicationSubPanelItem.Content>
            {this.props.guider.currentStudent.basic.school ||
              this.props.i18n.text.get(
                "plugin.guider.user.details.label.unknown.school"
              )}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        {this.props.guider.currentStudent.usergroups && (
          <ApplicationSubPanelItem
            title={this.props.i18n.text.get(
              "plugin.guider.user.details.label.studentgroups"
            )}
          >
            <ApplicationSubPanelItem.Content>
              {this.props.guider.currentStudent.usergroups.length
                ? this.props.guider.currentStudent.usergroups.map(
                    (usergroup, index) => (
                      <React.Fragment key={index}>
                        {usergroup.name}{" "}
                      </React.Fragment>
                    )
                  )
                : this.props.i18n.text.get(
                    "plugin.guider.user.details.label.nostudentgroups"
                  )}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        )}
        {this.props.guider.currentStudent.basic && (
          <ApplicationSubPanelItem
            title={this.props.i18n.text.get(
              "plugin.guider.user.details.label.lastLogin"
            )}
          >
            <ApplicationSubPanelItem.Content>
              {this.props.guider.currentStudent.basic.lastLogin
                ? this.props.i18n.time.format(
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
                title={this.props.i18n.text.get(
                  "plugin.guider.user." + notification
                )}
                modifier="notification"
                key={notification}
              >
                <ApplicationSubPanelItem.Content>
                  {this.props.i18n.time.format(
                    this.props.guider.currentStudent.notifications[notification]
                  )}
                </ApplicationSubPanelItem.Content>
              </ApplicationSubPanelItem>;
            }
          )}
      </div>
    );

    const studentWorkspaces = (
      <Workspaces
        workspaces={
          this.props.guider.currentStudent.currentWorkspaces &&
          this.props.guider.currentStudent.currentWorkspaces
        }
      />
    );

    // const headerToolbar = {
    //   left: "today prev,next",
    //   center: "title",
    //   right: "resourceTimelineMonth,resourceTimelineYear",
    // };

    // const externalEvents: ExternalEventType[] =
    //   this.props.guider.currentStudent.currentWorkspaces &&
    //   this.props.guider.currentStudent.currentWorkspaces.map((workspace) => ({
    //     id: workspace.id,
    //     title: workspace.name,
    //     duration: "36:00:00",
    //   }));

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
                IsStudentPartOfProperStudyProgram(
                  this.props.guider.currentStudent.basic.studyProgrammeName
                ) ? (
                  <ApplicationSubPanel>
                    <ApplicationSubPanel.Header>
                      {this.props.i18n.text.get(
                        "plugin.guider.user.details.purchases"
                      )}
                    </ApplicationSubPanel.Header>
                    <ApplicationSubPanel.Body>
                      <Ceepos />
                    </ApplicationSubPanel.Body>
                  </ApplicationSubPanel>
                ) : null}

                <ApplicationSubPanel.Header>
                  {this.props.i18n.text.get(
                    "plugin.guider.user.details.workspaces"
                  )}
                </ApplicationSubPanel.Header>

                <ApplicationSubPanel.Body>
                  {studentWorkspaces}
                </ApplicationSubPanel.Body>
              </ApplicationSubPanel>
            </ApplicationSubPanel>
            {this.props.guider.currentStudent.hopsAvailable &&
            COMPULSORY_HOPS_VISIBLITY.includes(
              this.props.guider.currentStudent.basic.studyProgrammeName
            ) ? (
              <ApplicationSubPanel modifier="student-data-container">
                <ApplicationSubPanel>
                  <ApplicationSubPanel.Header>
                    {this.props.i18n.text.get(
                      "plugin.guider.user.details.progressOfStudies"
                    )}
                  </ApplicationSubPanel.Header>
                  <ApplicationSubPanel.Body>
                    <StudySuggestionMatrix
                      studentId={this.props.guider.currentStudent.basic.id}
                      studentUserEntityId={
                        this.props.guider.currentStudent.basic.userEntityId
                      }
                    />
                  </ApplicationSubPanel.Body>
                </ApplicationSubPanel>
              </ApplicationSubPanel>
            ) : null}

            <ApplicationSubPanel modifier="student-data-container">
              <ApplicationSubPanel>
                <ApplicationSubPanel.Header>
                  {this.props.i18n.text.get("plugin.guider.user.details.notes")}
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
    i18n: state.i18n,
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
    { displayNotification, updateCurrentStudentHopsPhase },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StateOfStudies);
