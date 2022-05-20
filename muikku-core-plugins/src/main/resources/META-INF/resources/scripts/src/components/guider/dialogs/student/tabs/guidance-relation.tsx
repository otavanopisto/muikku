import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import {
  GuiderStudentType,
  GuiderStudentUserProfileType,
} from "~/reducers/main-function/guider";
import ContactEvent from "./contact-events/contact-event";
import { IContactLogEvent } from "~/reducers/main-function/guider/";
import NewContactEvent from "./contact-events/editors/new-event";
import { ButtonPill } from "~/components/general/button";

/**
 * GuidanceRelationProps
 */
interface GuidanceRelationProps {
  i18n: i18nType;
  currentStudent: GuiderStudentUserProfileType;
  contactLogs: IContactLogEvent[];
  studentBasicInfo: GuiderStudentType;
}

/**
 * GuidanceReleation
 * @param props GuidanceRelationProps
 * @returns JSX.element
 */
const GuidanceRelation: React.FC<GuidanceRelationProps> = (props) => {
  const { i18n, studentBasicInfo } = props;
  const { contactLogs, contactLogState } = props.currentStudent;
  return (
    <ApplicationSubPanel>
      <ApplicationSubPanelViewHeader
        title={i18n.text.get("plugin.guider.user.tabs.title.guidanceRelations")}
      >
        <NewContactEvent>
          <ButtonPill
            icon="bubbles"
            buttonModifiers="create-contact-log-entry"
          ></ButtonPill>
        </NewContactEvent>
      </ApplicationSubPanelViewHeader>
      <ApplicationSubPanel.Body modifier="guidance-relation">
        <ApplicationSubPanel modifier="guidance-relation-contact-info">
          <ApplicationSubPanelItem
            title={i18n.text.get(
              "plugin.guider.user.details.contactInfo.student.label"
            )}
          >
            <ApplicationSubPanelItem.Content>
              <div>{studentBasicInfo.email}</div>
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          {/* Removed for later

          <ApplicationSubPanelItem
            title={i18n.text.get(
              "plugin.guider.user.details.contactInfo.guardian.label"
            )}
          >
            <ApplicationSubPanelItem.Content>
              <div>
                {i18n.text.get("plugin.guider.user.details.label.phoneNumber")}
              </div>
              <div>
                {i18n.text.get("plugin.guider.user.details.label.email")}
              </div>
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem> */}
        </ApplicationSubPanel>
        <ApplicationSubPanel modifier="guidance-relation-contact-events">
          <ApplicationSubPanel.Header>
            {i18n.text.get("plugin.guider.user.contactLog.title")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
            {contactLogState && contactLogState === "LOADING" ? (
              <div className="loader-empty" />
            ) : contactLogs && contactLogs.length > 0 ? (
              contactLogs.map((contactEvent) => (
                <ContactEvent
                  key={"contact-event-" + contactEvent.id}
                  studentId={studentBasicInfo.userEntityId}
                  event={contactEvent}
                />
              ))
            ) : (
              <div className="empty">
                {i18n.text.get("plugin.guider.user.contactLog.empty")}
              </div>
            )}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

/**
 * mapStateToProps
 * @param state state
 * @returns state from props
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guidanceEvents: state.calendar.guidanceEvents,
    currentStudent: state.guider.currentStudent,
    studentBasicInfo: state.guider.currentStudent.basic,
    contactLogs: state.guider.currentStudent.contactLogs,
  };
}

export default connect(mapStateToProps)(GuidanceRelation);
