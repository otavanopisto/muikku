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

/**
 * OrganizationUserGroupsProps
 */
interface OrganizationUserGroupsProps {
  i18n: i18nType;
  userGroups: Array<UserGroupType>;
  userGroupsState: WorkspacesStateType;
  userGroupsHasMore: boolean;
  loadMoreUserGroups: LoadMoreUserTriggerType;
}

/**
 * OrganizationUserGroups
 * @param props props
 */
const OrganizationUserGroups: React.FC<OrganizationUserGroupsProps> = (
  props
) => {
  const { userGroups, userGroupsState, userGroupsHasMore, loadMoreUserGroups } =
    props;
  const lastUserGroupRef = useInfinityScroll(
    userGroupsHasMore,
    userGroupsState,
    loadMoreUserGroups
  );

  if (userGroupsState === "LOADING") {
    return null;
  } else if (userGroupsState === "ERROR") {
    return (
      <div className="empty">
        <span>
          {props.i18n.text.get(
            "plugin.organization.userGroups.error.loadError"
          )}
        </span>
      </div>
    );
  } else if (userGroups.length === 0) {
    return (
      <div className="empty">
        <span>
          {props.i18n.text.get(
            "plugin.organization.userGroups.searchResult.empty"
          )}
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
              // This div wrapper exists because callback ref must return
              // an element and a class component returns a mounted instance
              return (
                <div
                  className="ref-wrapper ref-wrapper--last-organization-item"
                  key={userGroup.id}
                  ref={lastUserGroupRef}
                >
                  <Usergroup usergroup={userGroup} />
                </div>
              );
            } else {
              return <Usergroup key={userGroup.id} usergroup={userGroup} />;
            }
          })}
        {userGroupsState === "LOADING_MORE" ? (
          <ApplicationListItem className="loader-empty" />
        ) : null}
      </ApplicationList>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    userGroups: state.userGroups.list,
    userGroupsState: state.userGroups.state,
    userGroupsHasMore: state.userGroups.hasMore,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ loadMoreUserGroups }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationUserGroups);
