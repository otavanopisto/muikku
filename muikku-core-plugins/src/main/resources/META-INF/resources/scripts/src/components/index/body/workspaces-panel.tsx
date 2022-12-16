import * as React from "react";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18nOLD";
import { WorkspaceListType, WorkspaceType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";

/**
 * WorkspacesPanelProps
 */
interface WorkspacesPanelProps {
  i18nOLD: i18nType;
  workspaces: WorkspaceListType;
}

/**
 * Workspace panel
 * @param props WorkspacesPanelProps
 * @returns  JSX.element
 */
const WorkspacesPanel: React.FC<WorkspacesPanelProps> = (props) => {
  const { i18nOLD, workspaces } = props;

  return (
    <Panel
      icon="icon-books"
      modifier="workspaces"
      header={i18nOLD.text.get("plugin.frontPage.workspaces.title")}
    >
      {workspaces.length ? (
        <div className="item-list item-list--panel-workspaces">
          {workspaces
            .sort((workspaceA: WorkspaceType, workspaceB: WorkspaceType) => {
              if (
                workspaceA.name.toLocaleLowerCase() <
                workspaceB.name.toLocaleLowerCase()
              ) {
                return -1;
              }
              if (workspaceA.name > workspaceB.name) {
                return 1;
              }
              return 0;
            })
            .map((workspace: WorkspaceType) => (
              <Link
                key={workspace.id}
                className="item-list__item item-list__item--workspaces"
                href={`/workspace/${workspace.urlName}`}
              >
                <span className="item-list__icon item-list__icon--workspaces icon-books"></span>
                <span className="item-list__text-body">
                  {`${workspace.name} ${
                    workspace.nameExtension
                      ? "(" + workspace.nameExtension + ")"
                      : ""
                  }`}
                </span>
              </Link>
            ))}
        </div>
      ) : (
        <Panel.BodyContent modifier="empty">
          {i18nOLD.text.get("plugin.frontPage.workspaces.noWorkspaces.teacher")}
        </Panel.BodyContent>
      )}
    </Panel>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    workspaces: state.workspaces.userWorkspaces,
  };
}

export default connect(mapStateToProps)(WorkspacesPanel);
