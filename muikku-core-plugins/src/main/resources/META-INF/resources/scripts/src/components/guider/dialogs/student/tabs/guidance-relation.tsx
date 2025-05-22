import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import ApplicationSubPanel, {
  ApplicationSubPanelViewHeader,
} from "~/components/general/application-sub-panel";
import { GuiderStudentUserProfileType } from "~/reducers/main-function/guider";
import ContactEvent from "./contact-events/contact-event";
import NewContactEvent from "./contact-events/editors/new-event";
import { ButtonPill } from "~/components/general/button";
import PagerV2 from "~/components/general/pagerV2";
import {
  loadStudentContactLogs,
  LoadContactLogsTriggerType,
} from "~/actions/main-function/guider";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * GuidanceRelationProps
 */
interface GuidanceRelationProps {
  currentStudent: GuiderStudentUserProfileType;
  contactLogsPerPage: number;
  loadStudentContactLogs: LoadContactLogsTriggerType;
}
/**
 * Context for the contactLogsPerPage
 * This is so that the child components can have the same
 * information about how many contactlogs per page there will be from single source
 */
export const ContactLogsContext = React.createContext(10);
/**
 * GuidanceReleation
 * @param props GuidanceRelationProps
 * @returns JSX.element
 */
const GuidanceRelation: React.FC<GuidanceRelationProps> = (props) => {
  const { currentStudent, contactLogsPerPage } = props;
  const { t } = useTranslation("guider");

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
      <ApplicationSubPanelViewHeader title={t("labels.relations")}>
        <NewContactEvent logsPerPage={contactLogsPerPage}>
          <ButtonPill
            icon="bubbles"
            buttonModifiers="create-contact-log-entry"
          ></ButtonPill>
        </NewContactEvent>
      </ApplicationSubPanelViewHeader>

      <ApplicationSubPanel.Body modifier="guidance-relation">
        {/* Removed for later - this needs to be thought through with the contact persons and so
        {basic && basic.email ? (
          <ApplicationSubPanel modifier="guidance-relation-contact-info">
            <ApplicationSubPanelItem
              title={i18n.t(
                "plugin.guider.user.details.contactInfo.student.label"
              )}
            >
              <ApplicationSubPanelItem.Content>
                <div>{basic.email}</div>
              </ApplicationSubPanelItem.Content>
            </ApplicationSubPanelItem>


          <ApplicationSubPanelItem
            title={i18n.t(
              "plugin.guider.user.details.contactInfo.guardian.label"
            )}
          >
            <ApplicationSubPanelItem.Content>
              <div>
                {i18n.t("plugin.guider.user.details.label.phoneNumber")}
              </div>
              <div>
                {i18n.t("plugin.guider.user.details.label.email")}
              </div>
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          </ApplicationSubPanel>
        ) : null}*/}
        <ApplicationSubPanel modifier="guidance-relation-contact-events">
          <ApplicationSubPanel.Header>
            {t("labels.contactLog")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body>
            <ContactLogsContext.Provider value={contactLogsPerPage}>
              {contactLogState && contactLogState === "LOADING" ? (
                <div className="loader-empty" />
              ) : contactLogs && contactLogs.results.length > 0 ? (
                <>
                  {contactLogs.results.map((contactEvent) => (
                    <ContactEvent
                      allPrivileges={contactLogs.allPrivileges}
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
                  {t("content.empty", {
                    ns: "messaging",
                    context: "contactLog",
                  })}
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
    currentStudent: state.guider.currentStudent,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch action dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    {
      loadStudentContactLogs,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GuidanceRelation);
