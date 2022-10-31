import * as React from "react";
import { connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceMaterialReferenceType } from "~/reducers/workspaces";
import { StateType } from "~/reducers";
import { Panel } from "~/components/general/panel";
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
    <Panel
      header={props.i18n.text.get("plugin.frontPage.latestWorkspace.title")}
      modifier="continue-studies"
      icon="icon-forward"
    >
      <Panel.BodyTitle>{props.lastWorkspace.workspaceName}</Panel.BodyTitle>
      <Panel.BodyContent>
        {props.i18n.text.get("plugin.frontPage.latestWorkspace.material.part1")}{" "}
        <span className="panel__body-highlight">
          {props.lastWorkspace.materialName}
        </span>{" "}
        <Link className="link" href={props.lastWorkspace.url}>
          {props.i18n.text.get(
            "plugin.frontPage.latestWorkspace.continueStudiesLink"
          )}
        </Link>
      </Panel.BodyContent>
    </Panel>
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
