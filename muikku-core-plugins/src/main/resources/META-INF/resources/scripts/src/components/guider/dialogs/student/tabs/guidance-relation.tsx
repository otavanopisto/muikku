import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import { GuiderStudentUserProfileType } from "~/reducers/main-function/guider";
import ContactEvent from "./contact-events/contact-event";
import NewContactEvent from "./contact-events/editors/new-event";
import { ButtonPill } from "~/components/general/button";
import PagerV2 from "~/components/general/pagerV2";
import {
  loadStudentGuiderRelations,
  LoadStudentDataTriggerType,
  loadStudentContactLogs,
  LoadContactLogsTriggerType,
} from "~/actions/main-function/guider";

/**
 * GuidanceRelationProps
 */
interface GuidanceRelationProps {
  i18n: i18nType;
  currentStudent: GuiderStudentUserProfileType;
  contactLogsPerPage: number;
  loadStudentGuiderRelations: LoadStudentDataTriggerType;
  loadStudentContactLogs: LoadContactLogsTriggerType;
}
/**
 * Context for the contactLogsPerPage
 */
export const ContactLogsContext = React.createContext(10);
/**
 * GuidanceReleation
 * @param props GuidanceRelationProps
 * @returns JSX.element
 */
const GuidanceRelation: React.FC<GuidanceRelationProps> = (props) => {
  const { i18n, currentStudent, contactLogsPerPage } = props;

  if (!currentStudent) {
    return null;
  }

  /**
   * HandlePageChange handles page change
   * @param selectedItem selected item
   * @param selectedItem.selected selected paging item number
   */
  const handlePageChange = (selectedItem: { selected: number }) => {
    props.loadStudentContactLogs(
      currentStudent.basic.userEntityId,
      contactLogsPerPage,
      selectedItem.selected,
      true
    );
  };

  const { contactLogs, contactLogState, basic } = props.currentStudent;

  const pages = contactLogs
    ? Math.ceil(contactLogs.totalHitCount / contactLogsPerPage)
    : 0;
  const currentPage = contactLogs
    ? contactLogs.firstResult / contactLogsPerPage
    : 0;

  return (
    <ApplicationSubPanel>
      <ApplicationSubPanelViewHeader
        title={i18n.text.get("plugin.guider.user.tabs.title.guidanceRelations")}
      >
        <NewContactEvent logsPerPage={contactLogsPerPage}>
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
            <ContactLogsContext.Provider value={contactLogsPerPage}>
              {contactLogState && contactLogState === "LOADING" ? (
                <div className="loader-empty" />
              ) : contactLogs && contactLogs.results.length > 0 ? (
                <>
                  {contactLogs.results.map((contactEvent) => (
                    <ContactEvent
                      key={"contact-event-" + contactEvent.id}
                      studentId={basic.userEntityId}
                      event={contactEvent}
                    />
                  ))}
                  <PagerV2
                    previousLabel=""
                    nextLabel=""
                    breakLabel="..."
                    forcePage={currentPage}
                    pageCount={pages}
                    onPageChange={handlePageChange}
                    marginPagesDisplayed={1}
                    pageRangeDisplayed={2}
                  />
                </>
              ) : (
                <div className="empty">
                  {i18n.text.get("plugin.guider.user.contactLog.empty")}
                </div>
              )}
            </ContactLogsContext.Provider>
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

/**
 * mapDispatchToProps
 * @param dispatch action dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadStudentGuiderRelations,
      loadStudentContactLogs,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GuidanceRelation);
