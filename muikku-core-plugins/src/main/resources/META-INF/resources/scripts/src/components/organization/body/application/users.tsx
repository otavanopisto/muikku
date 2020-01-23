import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";
import {UsersType} from '~/reducers/main-function/users/index.ts';
import  OrganizationUserPanel from './users/user-panel';
import { ButtonPill} from '~/components/general/button';

interface OrganizationUsersProps {
  i18n: i18nType
  users: UsersType
}

interface OrganizationUsersState {

}

class OrganizationUsers extends React.Component<OrganizationUsersProps, OrganizationUsersState> {

  constructor(props: OrganizationUsersProps){
    super(props);
    
  }
  render(){
    return (<div>
        <OrganizationUserPanel i18n={this.props.i18n} users={this.props.users.students}/>
        <OrganizationUserPanel i18n={this.props.i18n} users={this.props.users.staff}/>
      </div>)}}



function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    users: state.users
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganizationUsers);
