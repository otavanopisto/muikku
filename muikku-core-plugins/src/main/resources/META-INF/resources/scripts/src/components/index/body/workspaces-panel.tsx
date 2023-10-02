import * as React from "react";
import { connect } from "react-redux";
import Link from "~/components/general/link";
import { WorkspaceType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * WorkspacesPanelProps
 */
interface WorkspacesPanelProps extends WithTranslation {
  workspaces: WorkspaceType[];
}

/**
 * Workspace panel
 * @param props WorkspacesPanelProps
 * @returns  JSX.element
 */
const WorkspacesPanel: React.FC<WorkspacesPanelProps> = (props) => {
  const { workspaces, t } = props;

  return (
    <Panel
      icon="icon-books"
      modifier="workspaces"
      header={t("labels.workspaces", { ns: "workspace" })}
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
          {t("content.noWorkspaces", { ns: "frontPage" })}
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
    workspaces: state.workspaces.userWorkspaces,
  };
}

export default withTranslation(["frontPage", "workspace"])(
  connect(mapStateToProps)(WorkspacesPanel)
);
