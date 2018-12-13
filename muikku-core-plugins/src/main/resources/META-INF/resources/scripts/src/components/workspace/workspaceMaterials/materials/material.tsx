import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";

import MaterialLoader from "~/components/base/material-loader";
import { StatusType } from "~/reducers/base/status";
import { MaterialContentNodeType, WorkspaceType } from "~/reducers/workspaces";

interface WorkspaceMaterialProps {
  i18n: i18nType,
  status: StatusType,
  materialContentNode: MaterialContentNodeType,
  workspace: WorkspaceType
}

interface WorkspaceMaterialState {
  
}

class WorkspaceMaterial extends React.Component<WorkspaceMaterialProps, WorkspaceMaterialState> {
  render(){
    return <MaterialLoader material={this.props.materialContentNode} workspace={this.props.workspace}
      i18n={this.props.i18n} status={this.props.status}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkspaceMaterial);