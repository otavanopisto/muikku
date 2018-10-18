import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { getUserImageUrl } from "~/util/modifiers";
import Button from "~/components/general/button";
import CommunicatorNewMessage from '~/components/communicator/dialogs/new-message';
import { StatusType } from "~/reducers/base/status";

import '~/sass/elements/panel.scss';
import '~/sass/elements/item-list.scss';

interface DescriptionPanelProps {
  status: StatusType,
  workspace: WorkspaceType,
  i18n: i18nType
}

interface DescriptionPanelState {

}

class DescriptionPanel extends React.Component<DescriptionPanelProps, DescriptionPanelState> {
  render(){
    return (<div className="panel panel--workspace-description">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--description icon-books"></div>
        <div className="panel__header-title">{this.props.i18n.text.get('plugin.workspace.index.descriptionTitle')}</div>
      </div>
      <div className="panel__content">

      </div>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DescriptionPanel);