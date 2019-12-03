import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";
import  OrganizationUserTabs from './users/usertabs';
import { ButtonPill} from '~/components/general/button';

interface OrganizationUsersProps {
  i18n: i18nType
}

interface OrganizationUsersState {

}

class OrganizationUsers extends React.Component<OrganizationUsersProps, OrganizationUsersState> {

  constructor(props: OrganizationUsersProps){
    super(props);
    
  }
  render(){
    let students = [
      {
        id: "ACTIVE",
        name: this.props.i18n.text.get('plugin.organization.users.students.link.active'),
        type: "organization-students",
        component: ()=>{
          return <div className="application-list application-list--workspace-users">
            <div className="loaded-empty">{this.props.i18n.text.get('plugin.organization.users.activeStudents.empty')}</div>
          </div>
        }
      },
      {
        id: "INACTIVE",
        name: this.props.i18n.text.get('plugin.organization.users.students.link.inactive'),
        type: "organization-students",
        component: ()=>{
          return <div className="application-list application-list--workspace-users">
            <div className="loaded-empty">{this.props.i18n.text.get('plugin.organization.users.inactiveStudents.empty')}</div>
          </div>
        }
      }
    ];
    
    let teachers = [
      {
        id: "ACTIVE",
        name: this.props.i18n.text.get('plugin.organization.users.teachers.link.active'),
        type: "organization-teachers",
        component: ()=>{
          return <div className="application-list application-list--workspace-users">
              <div className="loaded-empty">{this.props.i18n.text.get('plugin.organization.users.activeTeachers.empty')}</div>
          </div>
        }
      },
      {
        id: "INACTIVE",
        name: this.props.i18n.text.get('plugin.organization.users.teachers.link.inactive'),
        type: "organization-teachers",
        component: ()=>{
          return <div className="application-list application-list--workspace-users">
            <div className="loaded-empty">{this.props.i18n.text.get('plugin.organization.users.inactiveTeachers.empty')}</div>
          </div>
        }
      }
    ]
    
    return (<div>
        <OrganizationUserTabs users={students} i18n={this.props.i18n}/>
        <OrganizationUserTabs users={teachers} i18n={this.props.i18n}/>
      </div>)}}



function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganizationUsers);
