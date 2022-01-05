import * as React from "react";
import { StateType } from "~/reducers";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import useInfinityScroll from "~/hooks/useInfinityScroll";
import Workspace from "./workspaces/workspace";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/ref-wrapper.scss";
import {
  loadMoreOrganizationWorkspacesFromServer,
  LoadMoreWorkspacesFromServerTriggerType,
} from "~/actions/workspaces";

import {
  WorkspacesStateType,
  WorkspaceType,
  WorkspaceListType,
} from "~/reducers/workspaces";

interface OrganizationWorkspacesProps {
  i18n: i18nType;
  workspacesState: WorkspacesStateType;
  workspacesHasMore: boolean;
  loadMoreOrganizationWorkspacesFromServer: LoadMoreWorkspacesFromServerTriggerType;
  workspaces: WorkspaceListType;
}

const OrganizationWorkspaces: React.FC<OrganizationWorkspacesProps> = (
  props,
) => {
  const {
    workspacesState,
    workspacesHasMore,
    loadMoreOrganizationWorkspacesFromServer,
    workspaces,
  } = props;
  const loadMoreWorkspacesRef = useInfinityScroll(
    workspacesHasMore,
    workspacesState,
    loadMoreOrganizationWorkspacesFromServer,
  );
  if (workspacesState === "LOADING") {
    return null;
  } else if (workspacesState === "ERROR") {
    return (
      <div className="empty">
        <span>
          {props.i18n.text.get(
            "plugin.organization.workspaces.error.loadError",
          )}
        </span>
      </div>
    );
  } else if (workspaces.length === 0) {
    return (
      <div className="empty">
        <span>
          {props.i18n.text.get(
            "plugin.organization.workspaces.searchResult.empty",
          )}
        </span>
      </div>
    );
  }
  return (
    <ApplicationList>
      {workspaces.map((workspace: WorkspaceType, index) => {
        if (workspaces.length === index + 1) {
          // This div wrapper exists because callback ref must return
          // an element and a class component returns a mounted instance
          return (
            <div
              className="ref-wrapper ref-wrapper--last-organization-item"
              key={workspace.id}
              ref={loadMoreWorkspacesRef}
            >
              <Workspace workspace={workspace} />
            </div>
          );
        } else {
          return <Workspace key={workspace.id} workspace={workspace} />;
        }
      })}
      {workspacesState === "LOADING_MORE" ? (
        <ApplicationListItem className="loader-empty" />
      ) : null}
    </ApplicationList>
  );
};

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspacesState: state.organizationWorkspaces.state,
    workspacesHasMore: state.organizationWorkspaces.hasMore,
    workspaces: state.organizationWorkspaces.availableWorkspaces,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { loadMoreOrganizationWorkspacesFromServer },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(OrganizationWorkspaces);
