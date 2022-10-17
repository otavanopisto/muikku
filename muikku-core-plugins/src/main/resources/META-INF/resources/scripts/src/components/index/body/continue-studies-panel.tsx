import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceMaterialReferenceType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import Link from "../../general/link";
import "~/sass/elements/panel.scss";
import "~/sass/elements/item-list.scss";

/**
 * ContinueStudiesPanelProps
 */
interface ContinueStudiesPanelProps {
  i18n: i18nType;
  status: StatusType;
  lastWorkspace: WorkspaceMaterialReferenceType;
}

/**
 * ContinueStudiesPanel
 * @param props ContinueStudiesPanelProps
 * @returns JSX.Element
 */
const ContinueStudiesPanel: React.FC<ContinueStudiesPanelProps> = (props) => {
  if (!props.lastWorkspace) {
    return null;
  }
  return (
    <div className="panel panel--continue-studies">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--continue-studies icon-forward"></div>
        <h2 className="panel__header-title">
          {props.i18n.text.get("plugin.frontPage.latestWorkspace.title")}
        </h2>
      </div>
      <div className="panel__body">
        <div className="panel__body-title">
          {props.lastWorkspace.workspaceName}
        </div>
        <div className="panel__body-content panel__body-content--continue-studies">
          {props.i18n.text.get(
            "plugin.frontPage.latestWorkspace.material.part1"
          )}{" "}
          <span className="panel__body-highlight">
            {props.lastWorkspace.materialName}.
          </span>{" "}
          <Link className="link" href={props.lastWorkspace.url}>
            {props.i18n.text.get(
              "plugin.frontPage.latestWorkspace.continueStudiesLink"
            )}
          </Link>
        </div>
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    i18n: state.i18n,
    lastWorkspace: state.workspaces.lastWorkspace,
  };
}

export default connect(mapStateToProps)(ContinueStudiesPanel);
