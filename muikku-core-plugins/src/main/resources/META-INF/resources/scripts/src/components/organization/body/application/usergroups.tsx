import * as React from 'react';
import { StateType } from '~/reducers';
import { connect, Dispatch } from 'react-redux';
import { i18nType } from "~/reducers/base/i18n";
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import { bindActionCreators } from 'redux';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import Usergroup from './usergroups/usergroup';
import { WorkspacesStateType } from '~/reducers/workspaces';
import { LoadUsersTriggerType, loadUsergroups} from '~/actions/main-function/users';
import { UserGroupType } from '~/reducers/user-index';

interface OrganizationUserGroupsProps {
  i18n: i18nType,
  usergroups: Array<UserGroupType>,
  usergroupsState: WorkspacesStateType,
  usergroupsHasMore: boolean,
  loadUsergroups: LoadUsersTriggerType
}

interface OrganizationUserGroupsState {
}

class OrganizationUserGroups extends BodyScrollLoader<OrganizationUserGroupsProps, OrganizationUserGroupsState> {
  constructor(props: OrganizationUserGroupsProps) {
    super(props);
      //once this is in state READY only then a loading more event can be triggered
      this.statePropertyLocation = "usergroupsState";
      //it will only call the function if this is true
      this.hasMorePropertyLocation = "usergroupsHasMore";
      //this is the function that will be called
      this.loadMoreTriggerFunctionLocation = "loadMoreOrganizationWorkspacesFromServer";
    this.userGroupSearch = this.userGroupSearch.bind(this);
  }

  userGroupSearch(q: string) {
    this.props.loadUsergroups({payload:{q}});
  }

  render() {
    if (this.props.usergroupsState === "LOADING") {
      return null;
    } else if (this.props.usergroupsState === "ERROR") {
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.usergroups.length === 0) {
      return <div className="empty"><span>{this.props.i18n.text.get("plugin.coursepicker.searchResult.empty")}</span></div>
    }
    return (<div>
      <ApplicationList>
        {this.props.usergroups && this.props.usergroups.map((userGroup: UserGroupType) => {
          return <Usergroup key={userGroup.id} usergroup={userGroup} />
        })}
        {this.props.usergroupsState === "LOADING_MORE" ? <ApplicationListItem className="loader-empty" /> : null}
      </ApplicationList>
    </div>)
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    usergroups: state.userGroups.list,
    usergroupsState: state.userGroups.state,
    usergroupsHasMore: state.userGroups.hasMore,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({loadUsergroups }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationUserGroups);
