import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import useInfinityScroll from "~/hooks/useInfinityScroll";
import Workspace from "./workspaces/workspace";
import "~/sass/elements/ref-wrapper.scss";
import { LoadMoreWorkspacesFromServerTriggerType } from "~/actions/workspaces";
import { loadMoreOrganizationWorkspacesFromServer } from "~/actions/workspaces/organization";
import { WorkspacesStateType, WorkspaceDataType } from "~/reducers/workspaces";
import { AnyActionType } from "~/actions";
import { useTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * OrganizationWorkspacesProps
 */
interface OrganizationWorkspacesProps {
  workspacesState: WorkspacesStateType;
  workspacesHasMore: boolean;
  loadMoreOrganizationWorkspacesFromServer: LoadMoreWorkspacesFromServerTriggerType;
  workspaces: WorkspaceDataType[];
}

/**
 * OrganizationWorkspaces
 * @param props props
 */
const OrganizationWorkspaces: React.FC<OrganizationWorkspacesProps> = (
  props
) => {
  const { t } = useTranslation(["common", "organization", "workspace"]);

  const {
    workspacesState,
    workspacesHasMore,
    loadMoreOrganizationWorkspacesFromServer,
    workspaces,
  } = props;

  const loadMoreWorkspacesRef = useInfinityScroll(
    workspacesHasMore,
    workspacesState,
    loadMoreOrganizationWorkspacesFromServer
  );

  if (workspacesState === "LOADING") {
    return null;
  } else if (workspacesState === "ERROR") {
    return (
      <div className="empty">
        <span>
          {t("notifications.loadError", {
            ns: "workspace",
            context: "workspace",
          })}
        </span>
      </div>
    );
  } else if (workspaces.length === 0) {
    return (
      <div className="empty">
        <span>{t("content.empty", { ns: "workspace" })}</span>
      </div>
    );
  }
  return (
    <ApplicationList>
      {workspaces.map((workspace: WorkspaceDataType, index) => {
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspacesState: state.organizationWorkspaces.state,
    workspacesHasMore: state.organizationWorkspaces.hasMore,
    workspaces: state.organizationWorkspaces.availableWorkspaces,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { loadMoreOrganizationWorkspacesFromServer },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(OrganizationWorkspaces);
