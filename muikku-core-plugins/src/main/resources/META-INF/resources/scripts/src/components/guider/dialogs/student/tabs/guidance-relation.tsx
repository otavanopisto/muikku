import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
  ApplicationSubPanelSection,
} from "~/components/general/application-sub-panel";
import { GuiderStudentType } from "~/reducers/main-function/guider";
import ContactEvent from "./contact-events/contact-event";
import { StatusType } from "~/reducers/base/status";
import { IContactEvent } from "~/reducers/main-function/guider/";
import NewContactEvent from "../../contact-event-new-event";

/**
 * GuidanceRelationProps
 */
interface GuidanceRelationProps {
  i18n: i18nType;
  contactLogs: IContactEvent[];
  studentBasicInfo: GuiderStudentType;
}

/**
 * GuidanceReleation
 * @param props GuidanceRelationProps
 * @returns JSX.element
 */
const GuidanceRelation: React.FC<GuidanceRelationProps> = (props) => {
  const { i18n, contactLogs, studentBasicInfo } = props;
  return (
    <ApplicationSubPanel>
      <ApplicationSubPanelViewHeader title="Ohjaussuhde">
        <NewContactEvent>
          <div>Luo uusi yhteydenotto</div>
        </NewContactEvent>
      </ApplicationSubPanelViewHeader>
      <ApplicationSubPanel.Body modifier="guidance-relation">
        <ApplicationSubPanelSection modifier="guidance-relation-contact-info">
          <ApplicationSubPanelItem title="Opiskelijan yhteystiedot">
            <ApplicationSubPanelItem.Content>
              <div>{studentBasicInfo.email}</div>
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem title="Yhteyshenkilö / huoltaja">
            <ApplicationSubPanelItem.Content>
              <div>Puhelinnumero</div>
              <div>Sähköposti</div>
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        </ApplicationSubPanelSection>
        <ApplicationSubPanelSection modifier="guidance-relation-contact-events">
          <ApplicationSubPanelSection.Header>
            Yhteydenotot
          </ApplicationSubPanelSection.Header>
          <ApplicationSubPanelSection.Body>
            {contactLogs && contactLogs.length > 0 ? (
              contactLogs.map((contactEvent) => (
                <ContactEvent
                  key={contactEvent.id}
                  studentId={studentBasicInfo.userEntityId}
                  event={contactEvent}
                  i18n={i18n}
                />
              ))
            ) : (
              <div>No logs</div>
            )}
          </ApplicationSubPanelSection.Body>
        </ApplicationSubPanelSection>
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guidanceEvents: state.calendar.guidanceEvents,
    studentBasicInfo: state.guider.currentStudent.basic,
    contactLogs: state.guider.currentStudent.contactLogs,
  };
}

export default connect(mapStateToProps)(GuidanceRelation);
