import * as React from "react";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import { bindActionCreators } from "redux";
import Usergroup from "./usergroups/usergroup";
import { WorkspacesStateType } from "~/reducers/workspaces";
import {
  LoadMoreUserTriggerType,
  loadMoreUserGroups,
} from "~/actions/main-function/users";
import { UserGroupType } from "~/reducers/user-index";
import useInfinityScroll from "~/hooks/useInfinityScroll";

interface OrganizationUserGroupsProps {
  i18n: i18nType;
  userGroups: Array<UserGroupType>;
  userGroupsState: WorkspacesStateType;
  userGroupsHasMore: boolean;
  loadMoreUserGroups: LoadMoreUserTriggerType;
}

const OrganizationUserGroups: React.FC<OrganizationUserGroupsProps> = (props) => {

  const { i18n, userGroups, userGroupsState, userGroupsHasMore, loadMoreUserGroups } = props;
  const lastUserGroupRef = useInfinityScroll(userGroupsHasMore, userGroupsState, loadMoreUserGroups);

  if (userGroupsState === "LOADING") {
    return null;
  } else if (userGroupsState === "ERROR") {
    //TODO: put a translation here please! this happens when messages fail to load, a notification shows with the error
    //message but here we got to put something
    return (
      <div className="empty">
        <span>{"ERROR"}</span>
      </div>
    );
  } else if (userGroups.length === 0) {
    return (
      <div className="empty">
        <span>
          {i18n.text.get("plugin.coursepicker.searchResult.empty")}
        </span>
      </div>
    );
  }
  return (
    <div>
      <ApplicationList>
        {userGroups &&
          userGroups.map((userGroup: UserGroupType, index) => {
            if (userGroups.length === index + 1) {
              return <div key={userGroup.id} ref={lastUserGroupRef}><Usergroup key={userGroup.id} usergroup={userGroup} /></div>;
            } else {
              return <Usergroup key={userGroup.id} usergroup={userGroup} />
            }
          })}
        {userGroupsState === "LOADING_MORE" ? (
          <ApplicationListItem className="loader-empty" />
        ) : null}
      </ApplicationList>
    </div>
  );
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
  return bindActionCreators({ loadMoreUserGroups }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationUserGroups);
