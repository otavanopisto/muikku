/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/form.scss";
import ContentPanel from "~/components/general/content-panel";
import { WorkspaceType } from "~/reducers/workspaces";
import { bindActionCreators } from "redux";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * PermissionsByUsergroupsProps
 */
interface PermissionsByUsergroupsProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  workspace: WorkspaceType;
}

const PERMISSIONS_TO_EXTRACT = ["WORKSPACE_SIGNUP"];

/**
 * PermissionsByUsergroups
 */
class PermissionsByUsergroups extends React.Component<
  PermissionsByUsergroupsProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: PermissionsByUsergroupsProps) {
    super(props);

    this.togglePermissionIn = this.togglePermissionIn.bind(this);
  }

  /**
   * togglePermissionIn
   */
  togglePermissionIn() {
    //this.props.updateCurrentWorkspaceUserGroupPermission(permission, valueToToggle);
  }

  /**
   * render
   */
  render() {
    return (
      <ContentPanel
        modifier="permissions-by-usergroup"
        title={this.props.t("labels.signUpRights", { ns: "workspace" })}
        ref="content-panel"
      >
        <div className="">
          <div>
            <div>{this.props.t("labels.userGroups", { ns: "users" })}</div>
            {PERMISSIONS_TO_EXTRACT.map((pte) => (
              <div key={pte}>
                {this.props.t("labels.permission", {
                  ns: "workspace",
                  context: pte,
                })}
              </div>
            ))}
          </div>
          {this.props.workspace &&
            this.props.workspace.permissions &&
            this.props.workspace.permissions.map((permission) => (
              <div key={permission.userGroupEntityId}>
                <div>{permission.userGroupName}</div>
                {PERMISSIONS_TO_EXTRACT.map((pte) => (
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
            ))}
        </div>
      </ContentPanel>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18nOLD: state.i18nOLD,
    workspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(PermissionsByUsergroups)
);
