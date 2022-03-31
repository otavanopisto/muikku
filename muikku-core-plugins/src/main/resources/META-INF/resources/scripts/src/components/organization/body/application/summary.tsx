import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import ApplicationSubPanel, {
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import { OrganizationSummaryType } from "~/reducers/organization/summary";
import Application from "../application";

/**
 * SummaryProps
 */
interface SummaryProps {
  i18n: i18nType;
  summary: OrganizationSummaryType;
}

/**
 * SummaryState
 */
interface SummaryState {}

/**
 * Summary
 */
class Summary extends React.Component<SummaryProps, SummaryState> {
  /**
   * render
   */
  render() {
    const { summary } = this.props;
    return (
      <div>
        {/* Commented for later use

        <ApplicationSubPanel
          i18n={this.props.i18n}
          modifier="organization-summary"
          title={this.props.i18n.text.get('plugin.organization.summary.billing.title')}>

          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle.activeBillingPeriod')}>
            <ApplicationSubPanelItem.Content
              modifier="primary">
              DD.MM.YYYY - DD.MM.YYYY
            </ApplicationSubPanelItem.Content>
            <ApplicationSubPanelItem.Content
              modifier="organization-summary"
              label={this.props.i18n.text.get('plugin.organization.summary.billing.detail.nextBillingSeason')} >
              DD.MM.YYYY - DD.MM.YYYY
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle.accumulatedBill')} >
            <ApplicationSubPanelItem.Content
              modifier="primary">1000€</ApplicationSubPanelItem.Content>
            <ApplicationSubPanelItem.Content
              modifier="organization-summary">
              {this.props.i18n.text.get('plugin.organization.summary.billing.detail.accumulated', 10, 5, 3)}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem
            modifier="organization-previous-bills"
            title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle.previousBills')} >
            <ApplicationSubPanelItem.SubItem
              modifier="organization-previous-bills">
              <ApplicationSubPanelItem.Content>
                DD.MM.YYYY - DD.MM.YYYY
              </ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content
                modifier="primary">1000€</ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content
                modifier="organization-summary">
                {this.props.i18n.text.get('plugin.organization.summary.billing.detail.accumulated', 10, 5, 3)}
              </ApplicationSubPanelItem.Content>
            </ApplicationSubPanelItem.SubItem>
            <ApplicationSubPanelItem.SubItem
              modifier="organization-previous-bills">
              <ApplicationSubPanelItem.Content>
                DD.MM.YYYY - DD.MM.YYYY
              </ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content
                modifier="primary">1000€</ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content
                modifier="organization-summary">
                {this.props.i18n.text.get('plugin.organization.summary.billing.detail.accumulated', 10, 5, 3)}
              </ApplicationSubPanelItem.Content>
            </ApplicationSubPanelItem.SubItem>
          </ApplicationSubPanelItem>
        </ApplicationSubPanel> */}
        <ApplicationSubPanel modifier="organization-summary">
          <ApplicationSubPanel.Header modifier="organization-summary">
            {this.props.i18n.text.get("plugin.organization.summary.info.title")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body modifier="organization-summary">
            <ApplicationSubPanelItem
              modifier="organization-summary"
              title={this.props.i18n.text.get(
                "plugin.organization.summary.info.subtitle.activeInactive"
              )}
            >
              <ApplicationSubPanelItem.Content modifier="primary">
                {this.props.i18n.text.get(
                  "plugin.organization.summary.info.workspaces.publishedUnpublished.text",
                  summary.workspaces && summary.workspaces.publishedCount,
                  summary.workspaces && summary.workspaces.unpublishedCount
                )}
              </ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content modifier="primary">
                {this.props.i18n.text.get(
                  "plugin.organization.summary.info.students.activeInactive.text",
                  summary.students && summary.students.activeStudents,
                  summary.students && summary.students.inactiveStudents
                )}
              </ApplicationSubPanelItem.Content>
            </ApplicationSubPanelItem>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
        <ApplicationSubPanel modifier="organization-summary">
          <ApplicationSubPanel.Header modifier="organization-summary">
            {this.props.i18n.text.get(
              "plugin.organization.summary.contact.title"
            )}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body modifier="organization-summary">
            {this.props.summary.contacts.map((contact) => (
              <ApplicationSubPanelItem
                key={"contact-" + contact.id}
                modifier="organization-contact-information"
                title={this.props.i18n.text.get(
                  "plugin.organization.summary.contact.subtitle." + contact.type
                )}
              >
                <ApplicationSubPanelItem.Content modifier="organization-contact-information">
                  <div>{contact.name}</div>
                  <div>{contact.phone}</div>
                  <div>{contact.email}</div>
                </ApplicationSubPanelItem.Content>
              </ApplicationSubPanelItem>
            ))}
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
      </div>
    );
  }
}

/**
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    summary: state.organizationSummary,
  };
}

/**
 *
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Summary);
