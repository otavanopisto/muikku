import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";
import {UsersType} from '~/reducers/main-function/users/index.ts';
import  UserPanel from '~/components/general/user-panel';
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
        <UserPanel i18n={this.props.i18n} title="plugin.organization.users.teachers.title" users={this.props.users.staff}/>
        <UserPanel i18n={this.props.i18n} title="plugin.organization.users.students.title" users={this.props.users.students}/>
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
