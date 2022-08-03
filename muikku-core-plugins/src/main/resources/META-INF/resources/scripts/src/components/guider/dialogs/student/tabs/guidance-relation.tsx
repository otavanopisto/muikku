import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import { GuiderStudentUserProfileType } from "~/reducers/main-function/guider";
import ContactEvent from "./contact-events/contact-event";
import NewContactEvent from "./contact-events/editors/new-event";
import { ButtonPill } from "~/components/general/button";

/**
 * GuidanceRelationProps
 */
interface GuidanceRelationProps {
  i18n: i18nType;
  currentStudent: GuiderStudentUserProfileType;
}

/**
 * GuidanceReleation
 * @param props GuidanceRelationProps
 * @returns JSX.element
 */
const GuidanceRelation: React.FC<GuidanceRelationProps> = (props) => {
  const { i18n, currentStudent } = props;

  if (!currentStudent) {
    return null;
  }

  const { contactLogs, contactLogState, basic } = props.currentStudent;

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
        {basic && basic.email ? (
          <ApplicationSubPanel modifier="guidance-relation-contact-info">
            <ApplicationSubPanelItem
              title={i18n.text.get(
                "plugin.guider.user.details.contactInfo.student.label"
              )}
            >
              <ApplicationSubPanelItem.Content>
                <div>{basic.email}</div>
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
        ) : null}
        <ApplicationSubPanel modifier="guidance-relation-contact-events">
          <ApplicationSubPanel.Header>
            {i18n.text.get("plugin.guider.user.contactLog.title")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
            {contactLogState && contactLogState === "LOADING" ? (
              <div className="loader-empty" />
            ) : contactLogs && contactLogs.results.length > 0 ? (
              contactLogs.results.map((contactEvent) => (
                <ContactEvent
                  key={"contact-event-" + contactEvent.id}
                  studentId={basic.userEntityId}
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
    currentStudent: state.guider.currentStudent,
  };
}

export default connect(mapStateToProps)(GuidanceRelation);
