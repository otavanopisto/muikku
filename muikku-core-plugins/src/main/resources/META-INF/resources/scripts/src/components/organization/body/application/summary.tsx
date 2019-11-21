import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";
import ApplicationSubPanel, {ApplicationSubPanelItem}  from "~/components/general/application-sub-panel";


interface SummaryProps {
  i18n: i18nType
}

interface SummaryState {
}



class Summary extends React.Component<SummaryProps, SummaryState> {

  
  render(){
    return (
       <div>
        <ApplicationSubPanel i18n={this.props.i18n} modifier="workspace-users" bodyModifier="workspace-staff-members" title={this.props.i18n.text.get('plugin.organization.summary.billing.title')}>
          <ApplicationSubPanelItem i18n={this.props.i18n} title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle')} >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus enim libero, quis iaculis metus sollicitudin vel. In gravida facilisis felis, auctor commodo elit dignissim vel. Proin ac nisi faucibus, tincidunt turpis sed, interdum leo. Maecenas quis scelerisque dui. Sed scelerisque quam ut magna varius condimentum. Vivamus id venenatis neque. </ApplicationSubPanelItem>
          <ApplicationSubPanelItem i18n={this.props.i18n} title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle')} >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus enim libero, quis iaculis metus sollicitudin vel. In gravida facilisis felis, auctor commodo elit dignissim vel. Proin ac nisi faucibus, tincidunt turpis sed, interdum leo. Maecenas quis scelerisque dui. Sed scelerisque quam ut magna varius condimentum. Vivamus id venenatis neque. </ApplicationSubPanelItem>
          <ApplicationSubPanelItem i18n={this.props.i18n} title={this.props.i18n.text.get('plugin.organization.summary.billing.subtitle')} >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus enim libero, quis iaculis metus sollicitudin vel. In gravida facilisis felis, auctor commodo elit dignissim vel. Proin ac nisi faucibus, tincidunt turpis sed, interdum leo. Maecenas quis scelerisque dui. Sed scelerisque quam ut magna varius condimentum. Vivamus id venenatis neque. </ApplicationSubPanelItem>
        </ApplicationSubPanel>
        <ApplicationSubPanel i18n={this.props.i18n} modifier="workspace-users" bodyModifier="workspace-staff-members" title={this.props.i18n.text.get('plugin.organization.summary.contact.title')}>
          <ApplicationSubPanelItem i18n={this.props.i18n} title={this.props.i18n.text.get('plugin.organization.summary.contact.subtitle')} >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus enim libero, quis iaculis metus sollicitudin vel. In gravida facilisis felis, auctor commodo elit dignissim vel. Proin ac nisi faucibus, tincidunt turpis sed, interdum leo. Maecenas quis scelerisque dui. Sed scelerisque quam ut magna varius condimentum. Vivamus id venenatis neque. </ApplicationSubPanelItem>
          <ApplicationSubPanelItem i18n={this.props.i18n} title={this.props.i18n.text.get('plugin.organization.summary.contact.subtitle')} >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec cursus enim libero, quis iaculis metus sollicitudin vel. In gravida facilisis felis, auctor commodo elit dignissim vel. Proin ac nisi faucibus, tincidunt turpis sed, interdum leo. Maecenas quis scelerisque dui. Sed scelerisque quam ut magna varius condimentum. Vivamus id venenatis neque. </ApplicationSubPanelItem>
        </ApplicationSubPanel>
        <ApplicationSubPanel i18n={this.props.i18n} modifier="workspace-users" bodyModifier="workspace-staff-members" title={this.props.i18n.text.get('plugin.organization.summary.stats.title')}>
        </ApplicationSubPanel>
       </div>
    );
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Summary);
