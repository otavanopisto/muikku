
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { ButtonPill} from '~/components/general/button';
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/application-sub-panel.scss';
import '~/sass/elements/tabs.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/avatar.scss';
import { getName, filterMatch, filterHighlight } from "~/util/modifiers";
import {MobileOnlyTabs} from "~/components/general/tabs";
import ApplicationSubPanel from "~/components/general/application-sub-panel";

interface WorkspaceUsersProps {
  status: StatusType,
  i18n: i18nType
}

interface WorkspaceUsersState {
  activeTab: "ACTIVE" | "INACTIVE",
  currentSearch: string,
}

class OrganizationUsers extends React.Component<WorkspaceUsersProps, WorkspaceUsersState> {
  constructor(props: WorkspaceUsersProps){
    super(props);
    
    this.state = {
      activeTab: "ACTIVE",
      currentSearch: "",
    }
    this.onTabChange = this.onTabChange.bind(this);
    
  }
  
  
  onTabChange() {
    alert("TAB!");
  }
  
  render(){

    return (<div >
      <ApplicationSubPanel i18n={this.props.i18n} modifier="workspace-users" bodyModifier="workspace-staff-members" title="plugin.workspace.users.teachers.title">
        <MobileOnlyTabs onTabChange={this.onTabChange} renderAllComponents activeTab={this.state.activeTab} tabs={[
        {
          id: "ACTIVE",
          name: this.props.i18n.text.get('plugin.workspace.users.students.link.active'),
          type: "workspace-students",
          component: ()=>{
            return <div className="application-list application-list--workspace-users">
                <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.activeStudents.empty')}</div>
            </div>
          }
        },
        {
          id: "INACTIVE",
          name: this.props.i18n.text.get('plugin.workspace.users.students.link.inactive'),
          type: "workspace-students",
          component: ()=>{
            return <div className="application-list application-list--workspace-users">
              <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.inActiveStudents.empty')}</div>
            </div>
          }
        }
      ]}/>
      </ApplicationSubPanel>
      <ApplicationSubPanel i18n={this.props.i18n} modifier="workspace-users" bodyModifier="workspace-students" title="plugin.workspace.users.students.title">
        <MobileOnlyTabs onTabChange={this.onTabChange} renderAllComponents activeTab={this.state.activeTab} tabs={[
        {
          id: "ACTIVE",
          name: this.props.i18n.text.get('plugin.workspace.users.students.link.active'),
          type: "workspace-students",
          component: ()=>{
            return <div className="application-list application-list--workspace-users">
              <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.activeStudents.empty')}</div>
            </div>
          }
        },
        {
          id: "INACTIVE",
          name: this.props.i18n.text.get('plugin.workspace.users.students.link.inactive'),
          type: "workspace-students",
          component: ()=>{
            return <div className="application-list application-list--workspace-users">
              <div className="loaded-empty">{this.props.i18n.text.get('plugin.workspaces.users.inActiveStudents.empty')}</div>
            </div>
          }
        }
        ]}/>
      </ApplicationSubPanel>
      </div>)}}



function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(OrganizationUsers);
