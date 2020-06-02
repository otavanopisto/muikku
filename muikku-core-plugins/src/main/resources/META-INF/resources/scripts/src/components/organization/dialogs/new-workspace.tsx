import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import EnvironmentDialog from '~/components/general/environment-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';
import { StatusType } from '~/reducers/base/status';


interface OrganizationNewWorkspaceProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType
}

interface OrganizationNewWorkspaceState {
}


class OrganizationNewWorkspace extends React.Component<OrganizationNewWorkspaceProps, OrganizationNewWorkspaceState> {
  render(){

    let content = (closePortal: ()=> any) => <div></div>;
    let footer = (closePortal: ()=> any) => <div></div>;
    
    return(<EnvironmentDialog modifier="new-message"
        title={this.props.i18n.text.get('plugin.organization.workspaces.addWorkspace.title')}
        content={content} footer={footer}>
        {this.props.children}
      </EnvironmentDialog>
    )
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationNewWorkspace);
