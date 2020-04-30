import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import EnvironmentDialog, {EnvironmentDialogRow, EnvironmentDialogFormElement, EnvironmentDialogActionsElement} from '~/components/general/environment-dialog';
import {AnyActionType} from '~/actions';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';
import Button from '~/components/general/button';
import { StatusType } from '~/reducers/base/status';
import { throws } from 'assert';



interface OrganizationNewUserProps {
  children?: React.ReactElement<any>,
  i18n: i18nType,
  status: StatusType
}

interface OrganizationNewUserState {
}




class OrganizationNewUser extends React.Component<OrganizationNewUserProps, OrganizationNewUserState> {
  
  saveUser() {
    alert("Saved");
  }
  
  render(){

    let content = (closePortal: ()=> any) => 
      <EnvironmentDialogRow>
        <EnvironmentDialogFormElement label="TODO Label" i18n={this.props.i18n}>
         Duudiduud
        </EnvironmentDialogFormElement>
      </EnvironmentDialogRow>;

    let footer = (closePortal: ()=> any) => <EnvironmentDialogActionsElement i18n={this.props.i18n} executeLabel="TODO: execute" cancelLabel="TODO: cancel" executeClick={this.saveUser}
    cancelClick={closePortal} />;
    
    return(<EnvironmentDialog modifier="new-message"
        title={this.props.i18n.text.get('plugin.organization.users.addUser.title')}
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
)(OrganizationNewUser);