import * as React from "react";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import { bindActionCreators } from "redux";
import BodyScrollLoader from "~/components/general/body-scroll-loader";
import Usergroup from "./usergroups/usergroup";
import { WorkspacesStateType } from "~/reducers/workspaces";
import {
  LoadUsersTriggerType,
  LoadMoreUserTriggerType,
  loadUserGroups,
  loadMoreUserGroups,
} from "~/actions/main-function/users";
import { UserGroupType } from "~/reducers/user-index";
import Button from '~/components/general/button';

interface OrganizationUserGroupsProps {
  i18n: i18nType;
  userGroups: Array<UserGroupType>;
  userGroupsState: WorkspacesStateType;
  userGroupsHasMore: boolean;
  loadUserGroups: LoadUsersTriggerType;
  loadMoreUserGroups: LoadMoreUserTriggerType;
}

interface OrganizationUserGroupsState { }

class OrganizationUserGroups extends React.Component<
  OrganizationUserGroupsProps,
  OrganizationUserGroupsState
> {
  constructor(props: OrganizationUserGroupsProps) {
    super(props);
    // //once this is in state READY only then a loading more event can be triggered
    // this.statePropertyLocation = "userGroupsState";
    // //it will only call the function if this is true
    // this.hasMorePropertyLocation = "userGroupsHasMore";
    // //this is the function that will be called
    // this.loadMoreTriggerFunctionLocation = "loadMoreUserGroups";
    // this.userGroupSearch = this.userGroupSearch.bind(this);
  }

  userGroupSearch(q: string) {
    this.props.loadUserGroups({ payload: { q } });
  }

  render() {
    if (this.props.userGroupsState === "LOADING") {
      return null;
    } else if (this.props.userGroupsState === "ERROR") {
      //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return (
        <div className="empty">
          <span>{this.props.i18n.text.get("plugin.organization.userGroups.error.loadError")}</span>
        </div>
      );
    } else if (this.props.userGroups.length === 0) {
      return (
        <div className="empty">
          <span>
            {this.props.i18n.text.get("plugin.organization.userGroups.searchResult.empty")}
          </span>
        </div>
      );
    }
    return (
      <div>
        <ApplicationList modifiers="organization" footer={this.props.userGroupsHasMore === true ? <Button buttonModifiers="load-further" onClick={this.props.loadMoreUserGroups}>{this.props.i18n.text.get("plugin.organization.userGroups.loadMore")}</Button> : null}>
          {this.props.userGroups &&
            this.props.userGroups.map((userGroup: UserGroupType) => {
              return <Usergroup key={userGroup.id} usergroup={userGroup} />;
            })}
          {this.props.userGroupsState === "LOADING_MORE" ? (
            <ApplicationListItem className="loader-empty" />
          ) : null}
        </ApplicationList>
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    userGroups: state.userGroups.list,
    userGroupsState: state.userGroups.state,
    userGroupsHasMore: state.userGroups.hasMore,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ loadUserGroups, loadMoreUserGroups }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationUserGroups);
