import * as React from 'react';
import { StateType } from '~/reducers';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";
import ApplicationSubPanel, { ApplicationSubPanelItem } from "~/components/general/application-sub-panel";


interface SummaryProps {
  i18n: i18nType
}

interface SummaryState {
}



class Summary extends React.Component<SummaryProps, SummaryState> {


  render() {
    return (
      <div>
        <ApplicationSubPanel
          i18n={this.props.i18n}
          modifier="organization-summary"
          bodyModifier="workspace-staff-members"
          title={this.props.i18n.text.get('plugin.organization.summary.billing.title')}>
          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle.activeBillingPeriod')}>
            <ApplicationSubPanelItem.Content>
              DD.MM.YYYY - DD.MM.YYYY
            </ApplicationSubPanelItem.Content>
            <ApplicationSubPanelItem.Content
              label={this.props.i18n.text.get('plugin.organization.summary.billing.detail.nextBillingSeason')} >
              DD.MM.YYYY - DD.MM.YYYY
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle.accumulatedBill')} >
            <ApplicationSubPanelItem.Content>1000€</ApplicationSubPanelItem.Content>
            <ApplicationSubPanelItem.Content>
              {this.props.i18n.text.get('plugin.organization.summary.billing.detail.accumulated', 10, 5, 3)}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle.previousBills')} >
            <ApplicationSubPanelItem.Content>1000€</ApplicationSubPanelItem.Content>
            <ApplicationSubPanelItem.Content>
              {this.props.i18n.text.get('plugin.organization.summary.billing.detail.accumulated', 10, 5, 3)}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        </ApplicationSubPanel>
        <ApplicationSubPanel
          i18n={this.props.i18n}
          modifier="organization-summary"
          title={this.props.i18n.text.get('plugin.organization.summary.contact.title')}>
          <ApplicationSubPanelItem
            modifier="organization-summary"
            title={this.props.i18n.text.get('plugin.organization.summary.contact.subtitle')} >
            <ApplicationSubPanelItem.Content>
              <div>Musta kaapu</div>
              <div>2043i2340i12430</div>
              <div>qwqweqweqwe@asdas.net</div>
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
          <ApplicationSubPanelItem
            title={this.props.i18n.text.get('plugin.organization.summary.contact.subtitle')} >
            <ApplicationSubPanelItem.Content>
              <div>Musta kaapu</div>
              <div>2043i2340i12430</div>
              <div>qwqweqweqwe@asdas.net</div>
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        </ApplicationSubPanel>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
