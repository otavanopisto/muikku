import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form-elements.scss";

import ContentPanel, {
  ContentPanelItem
} from "~/components/general/content-panel";
import { WorkspaceType, WorkspacePermissionsType } from "~/reducers/workspaces";
import { bindActionCreators } from "redux";

interface PermissionsByUsergroupsProps {
  i18n: i18nType;
  workspace: WorkspaceType;
}

interface PermissionsByUsergroupsState {}

const PERMISSIONS_TO_EXTRACT = ["WORKSPACE_SIGNUP"];

class PermissionsByUsergroups extends React.Component<
  PermissionsByUsergroupsProps,
  PermissionsByUsergroupsState
> {
  constructor(props: PermissionsByUsergroupsProps) {
    super(props);

    this.togglePermissionIn = this.togglePermissionIn.bind(this);
  }
  togglePermissionIn(
    permission: WorkspacePermissionsType,
    valueToToggle: string
  ) {
    //this.props.updateCurrentWorkspaceUserGroupPermission(permission, valueToToggle);
  }
  render() {
    return (
      <ContentPanel
        modifier="permissions-by-usergroup"
        title={this.props.i18n.text.get(
          "plugin.workspace.permissions.viewTitle"
        )}
        ref="content-panel"
      >
        <div className="">
          <div>
            <div>
              {this.props.i18n.text.get(
                "plugin.workspace.permissions.usergroupsColumn.label"
              )}
            </div>
            {PERMISSIONS_TO_EXTRACT.map((pte, index) => (
              <div key={pte}>
                {this.props.i18n.text.get(
                  "plugin.workspace.permissions.label." + pte
                )}
              </div>
            ))}
          </div>
          {this.props.workspace &&
            this.props.workspace.permissions &&
            this.props.workspace.permissions.map((permission) => {
              return (
                <div key={permission.userGroupEntityId}>
                  <div>{permission.userGroupName}</div>
                  {PERMISSIONS_TO_EXTRACT.map((pte, index) => (
                    <div key={pte}>
                      <input
                        className="form-element"
                        type="checkbox"
                        checked={permission.canSignup}
                        onChange={this.togglePermissionIn.bind(
                          this,
                          permission,
                          pte
                        )}
                      />
                    </div>
                  ))}
                </div>
              );
            })}
        </div>
      </ContentPanel>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({}, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PermissionsByUsergroups);
