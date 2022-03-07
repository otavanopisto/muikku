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
import { getUserImageUrl, getName } from "~/util/modifiers";
import Hops from "~/components/base/hops_readable";
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
} from "~/reducers/main-function/guider";
import NewMessage from "~/components/communicator/dialogs/new-message";
import { ButtonPill } from "~/components/general/button";
import GuiderToolbarLabels from "./toolbar/labels";
import ApplicationSubPanel from "~/components/general/application-sub-panel";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";

// import GuidanceEvent from "../../dialogs/guidance-event";
// import { CalendarEvent } from "~/reducers/main-function/calendar";
// import { ResourceTimeline } from "../../../general/resource-timeline";
// import { ExternalEventType } from "../../../general/resource-timeline";

/**
 * StateOfStudiesProps
 */
interface StateOfStudiesProps {
  i18n: i18nType;
  guider: GuiderType;
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
     * @param studyProgramName
     * @returns true or false
     */
    const IsStudentPartOfProperStudyProgram = (studyProgramName: string) => {
      switch (studyProgramName) {
        case "Nettilukio/yksityisopiskelu (aineopintoina)":
        case "Nettilukio/yksityisopiskelu (tutkinto)":
        case "Aineopiskelu/lukio":
        case "Aineopiskelu/peruskoulu":
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
      <div className="application-sub-panel__header">
        <object
          className="avatar-container"
          data={getUserImageUrl(
            this.props.guider.currentStudent.basic.userEntityId
          )}
          type="image/jpeg"
        >
          <div className={`avatar avatar--category-1`}>
            {this.props.guider.currentStudent.basic.firstName[0]}
          </div>
        </object>
        <div className="application-sub-panel__header-main-container">
          <h2 className="application-sub-panel__header-main application-sub-panel__header-main--guider-profile-student-name">
            {getName(this.props.guider.currentStudent.basic, true)}
          </h2>
          <div className="application-sub-panel__header-main application-sub-panel__header-main--guider-profile-student-email">
            {(defaultEmailAddress && defaultEmailAddress.address) ||
              this.props.i18n.text.get(
                "plugin.guider.user.details.label.unknown.email"
              )}
          </div>
        </div>
        <div className="application-sub-panel__header-aside-container">
          {/* {this.props.guider.currentStudent.basic.studyProgrammeName} */}
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
        </div>
      </div>
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
        <div className="application-sub-panel__item">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.guider.user.details.label.studyStartDateTitle"
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.props.guider.currentStudent.basic.studyStartDate
                ? this.props.i18n.time.format(
                    this.props.guider.currentStudent.basic.studyStartDate
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.guider.user.details.label.studyEndDateTitle"
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.props.guider.currentStudent.basic.studyEndDate
                ? this.props.i18n.time.format(
                    this.props.guider.currentStudent.basic.studyEndDate
                  )
                : "-"}
            </span>
          </div>
        </div>
        <div className="application-sub-panel__item">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.guider.user.details.label.studyTimeEndTitle"
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.props.guider.currentStudent.basic.studyTimeEnd
                ? this.props.i18n.time.format(
                    this.props.guider.currentStudent.basic.studyTimeEnd
                  )
                : "-"}
            </span>
          </div>
        </div>
        {this.props.guider.currentStudent.emails && (
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.guider.user.details.label.email"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {this.props.guider.currentStudent.emails.length ? (
                this.props.guider.currentStudent.emails.map((email) => (
                  <span
                    className="application-sub-panel__single-entry"
                    key={email.address}
                  >
                    {email.defaultAddress ? `*` : null} {email.address} (
                    {email.type})
                  </span>
                ))
              ) : (
                <span className="application-sub-panel__single-entry">
                  {this.props.i18n.text.get(
                    "plugin.guider.user.details.label.unknown.email"
                  )}
                </span>
              )}
            </div>
          </div>
        )}
        {this.props.guider.currentStudent.phoneNumbers && (
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.guider.user.details.label.phoneNumber"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {this.props.guider.currentStudent.phoneNumbers.length ? (
                this.props.guider.currentStudent.phoneNumbers.map((phone) => (
                  <span
                    className="application-sub-panel__single-entry"
                    key={phone.number}
                  >
                    {phone.defaultNumber ? `*` : null} {phone.number} (
                    {phone.type})
                  </span>
                ))
              ) : (
                <span className="application-sub-panel__single-entry">
                  {this.props.i18n.text.get(
                    "plugin.guider.user.details.label.unknown.phoneNumber"
                  )}
                </span>
              )}
            </div>
          </div>
        )}
        <div className="application-sub-panel__item">
          <div className="application-sub-panel__item-title">
            {this.props.i18n.text.get(
              "plugin.guider.user.details.label.school"
            )}
          </div>
          <div className="application-sub-panel__item-data">
            <span className="application-sub-panel__single-entry">
              {this.props.guider.currentStudent.basic.school ||
                this.props.i18n.text.get(
                  "plugin.guider.user.details.label.unknown.school"
                )}
            </span>
          </div>
        </div>
        {this.props.guider.currentStudent.usergroups && (
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.guider.user.details.label.studentgroups"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              {this.props.guider.currentStudent.usergroups.length ? (
                this.props.guider.currentStudent.usergroups.map((usergroup) => (
                  <span
                    className="application-sub-panel__single-entry"
                    key={usergroup.id}
                  >
                    {usergroup.name}
                  </span>
                ))
              ) : (
                <span className="application-sub-panel__single-entry">
                  {this.props.i18n.text.get(
                    "plugin.guider.user.details.label.nostudentgroups"
                  )}
                </span>
              )}
            </div>
          </div>
        )}
        {this.props.guider.currentStudent.basic && (
          <div className="application-sub-panel__item">
            <div className="application-sub-panel__item-title">
              {this.props.i18n.text.get(
                "plugin.guider.user.details.label.lastLogin"
              )}
            </div>
            <div className="application-sub-panel__item-data">
              <span className="application-sub-panel__single-entry">
                {this.props.guider.currentStudent.basic.lastLogin
                  ? this.props.i18n.time.format(
                      this.props.guider.currentStudent.basic.lastLogin,
                      "LLL"
                    )
                  : "-"}
              </span>
            </div>
          </div>
        )}
        {this.props.guider.currentStudent.notifications &&
          Object.keys(this.props.guider.currentStudent.notifications).map(
            (notification) => {
              <div
                className="application-sub-panel__item application-sub-panel__item--notification"
                key={notification}
              >
                <div className="application-sub-panel__item-title ">
                  {this.props.i18n.text.get(
                    "plugin.guider.user." + notification
                  )}
                </div>
                <div className="application-sub-panel__item-data">
                  <span className="application-sub-panel__single-entry">
                    {this.props.i18n.time.format(
                      (this.props.guider.currentStudent.notifications as any)[
                        notification
                      ]
                    )}
                  </span>
                </div>
              </div>;
            }
          )}
      </div>
    );

    const studentWorkspaces = (
      <Workspaces
        workspaces={this.props.guider.currentStudent.currentWorkspaces}
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
        <div className="application-sub-panel application-sub-panel--guider-student-header">
          {studentBasicHeader}
          {this.props.guider.currentStudent.labels &&
          this.props.guider.currentStudent.labels.length ? (
            <div className="application-sub-panel__body application-sub-panel__body--labels labels">
              {studentLabels}
            </div>
          ) : null}
        </div>
        <div className="application-sub-panel application-sub-panel--student-data-container">
          <div className="application-sub-panel application-sub-panel--student-data-primary">
            {studentBasicInfo}
          </div>

          <div className="application-sub-panel application-sub-panel--student-data-secondary">
            {this.props.guider.currentStudent.basic &&
            IsStudentPartOfProperStudyProgram(
              this.props.guider.currentStudent.basic.studyProgrammeName
            ) ? (
              <div className="application-sub-panel">
                <h3 className="application-sub-panel__header">
                  {this.props.i18n.text.get(
                    "plugin.guider.user.details.purchases"
                  )}
                </h3>
                <div className="application-sub-panel__body">
                  <Ceepos />
                </div>
              </div>
            ) : null}

            <h3 className="application-sub-panel__header">
              {this.props.i18n.text.get(
                "plugin.guider.user.details.workspaces"
              )}
            </h3>

            <div className="application-sub-panel__body">
              {studentWorkspaces}
            </div>
          </div>
          {this.props.guider.currentState === "LOADING" ? (
            <div className="application-sub-panel loader-empty" />
          ) : null}
        </div>
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
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(StateOfStudies);
