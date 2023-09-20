import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import ApplicationSubPanel, {
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import { OrganizationSummaryType } from "~/reducers/organization/summary";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * SummaryProps
 */
interface SummaryProps extends WithTranslation {
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
    const { summary, t } = this.props;

    const organizationTypeTranslation: { [key: string]: string } = {
      ORGANIZATION_ADMINISTRATOR: t("labels.administrator", {
        ns: "organization",
      }),
      ORGANIZATION_REPORT: t("labels.certificates", {
        ns: "organization",
      }),
      ORGANIZATION_BILLING: t("labels.billing", {
        ns: "organization",
      }),
      ORGANIZATION_SIGNATORY: t("labels.signatory", {
        ns: "organization",
      }),
      ORGANIZATION_INFO: t("labels.information", {
        ns: "organization",
      }),
    };

    return (
      <div>
        {/* Commented for later use

        <ApplicationSubPanel
          modifier="organization-summary"
          title={this.props.i18n.t('plugin.organization.summary.billing.title')}>

          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.t('plugin.organization.summary.billing.subtitle.activeBillingPeriod')}>
            <ApplicationSubPanelItem.Content
              modifier="primary">
              DD.MM.YYYY - DD.MM.YYYY
            </ApplicationSubPanelItem.Content>
            <ApplicationSubPanelItem.Content
              modifier="organization-summary"
              label={this.props.i18n.t('plugin.organization.summary.billing.detail.nextBillingSeason')} >
              DD.MM.YYYY - DD.MM.YYYY
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.t('plugin.organization.summary.billing.subtitle.accumulatedBill')} >
            <ApplicationSubPanelItem.Content
              modifier="primary">1000€</ApplicationSubPanelItem.Content>
            <ApplicationSubPanelItem.Content
              modifier="organization-summary">
              {this.props.i18n.t('content.accumulated', 10, 5, 3)}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem
            modifier="organization-previous-bills"
            title={this.props.i18n.t('plugin.organization.summary.billing.subtitle.previousBills')} >
            <ApplicationSubPanelItem.SubItem
              modifier="organization-previous-bills">
              <ApplicationSubPanelItem.Content>
                DD.MM.YYYY - DD.MM.YYYY
              </ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content
                modifier="primary">1000€</ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content
                modifier="organization-summary">
                {this.props.i18n.t('content.accumulated', 10, 5, 3)}
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
                {this.props.i18n.t('content.accumulated', 10, 5, 3)}
              </ApplicationSubPanelItem.Content>
            </ApplicationSubPanelItem.SubItem>
          </ApplicationSubPanelItem>
        </ApplicationSubPanel> */}
        <ApplicationSubPanel modifier="organization-summary">
          <ApplicationSubPanel.Header modifier="organization-summary">
            {t("labels.info", { ns: "organization" })}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body modifier="organization-summary">
            <ApplicationSubPanelItem
              modifier="organization-summary"
              title={t("labels.workspacesAndStudents", { ns: "organization" })}
            >
              <ApplicationSubPanelItem.Content modifier="primary">
                {t("content.publishedUnpublished", {
                  ns: "organization",
                  publishedCount:
                    summary.workspaces && summary.workspaces.publishedCount,
                  unpublishedCount:
                    summary.workspaces && summary.workspaces.unpublishedCount,
                })}
              </ApplicationSubPanelItem.Content>
              <ApplicationSubPanelItem.Content modifier="primary">
                {t("content.activeInactive", {
                  ns: "organization",
                  activeCount:
                    summary.students && summary.students.activeStudents,
                  archivedCount:
                    summary.students && summary.students.inactiveStudents,
                })}
              </ApplicationSubPanelItem.Content>
            </ApplicationSubPanelItem>
          </ApplicationSubPanel.Body>
        </ApplicationSubPanel>
        <ApplicationSubPanel modifier="organization-summary">
          <ApplicationSubPanel.Header modifier="organization-summary">
            {t("labels.contactInfo")}
          </ApplicationSubPanel.Header>
          <ApplicationSubPanel.Body modifier="organization-summary">
            {this.props.summary.contacts.map((contact) => (
              <ApplicationSubPanelItem
                key={"contact-" + contact.id}
                modifier="organization-contact-information"
                title={organizationTypeTranslation[contact.type]}
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
 * @param state aplication state
 */
function mapStateToProps(state: StateType) {
  return {
    summary: state.organizationSummary,
  };
}

/**
 *
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["common", "users", "organization"])(
  connect(mapStateToProps, mapDispatchToProps)(Summary)
);
