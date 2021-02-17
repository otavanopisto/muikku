import * as React from 'react';
import { StateType } from '~/reducers';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import { bindActionCreators } from 'redux';
import { UserPanelUsersType } from '~/reducers/main-function/users';
import Usergroup from './userGroups/usergroup';
import { WorkspacesStateType } from '~/reducers/workspaces';
import { LoadUsersTriggerType, loadUsergroups, loadStaff } from '~/actions/main-function/users';
import { UserGroupType } from '~/reducers/user-index';
interface OrganizationUserGroupsProps {
  i18n: i18nType,
  userGroups: Array<UserGroupType>,
  userGroupsState: WorkspacesStateType,
  userGroupsHasMore: boolean,
  loadUsergroups: LoadUsersTriggerType
}

interface OrganizationUserGroupsState {
}

class OrganizationUserGroups extends React.Component<OrganizationUserGroupsProps, OrganizationUserGroupsState> {
  constructor(props: OrganizationUserGroupsProps) {
    super(props);
    this.userGroupSearch = this.userGroupSearch.bind(this);
  }

  userGroupSearch(query: string) {
    this.props.loadUsergroups(query);
  }



  render() {
    let test = this.props.userGroups;
    return (<div>
      <ApplicationList>
        {this.props.userGroups && this.props.userGroups.map((userGroup: UserGroupType) => {
          return <Usergroup key={userGroup.id} usergroup={userGroup} />
        })}
        {this.props.userGroupsState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty" /> : null}
      </ApplicationList>
    </div>)
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    userGroups: state.organizationUsers.userGroups,
    userGroupsState: state.organizationWorkspaces.state,
    userGroupsHasMore: state.organizationWorkspaces.hasMore,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({loadUsergroups }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationUserGroups);
