import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";

import MaterialLoader from "~/components/base/material-loader";
import { StatusType } from "~/reducers/base/status";
import { MaterialContentNodeType, WorkspaceType, MaterialCompositeRepliesType } from "~/reducers/workspaces";
import { setCurrentWorkspace, SetCurrentWorkspaceTriggerType } from "~/actions/workspaces";
import { bindActionCreators } from "redux";

interface WorkspaceMaterialProps {
  i18n: i18nType,
  status: StatusType,
  materialContentNode: MaterialContentNodeType,
  compositeReplies: MaterialCompositeRepliesType,
  workspace: WorkspaceType,
  setCurrentWorkspace: SetCurrentWorkspaceTriggerType
}

interface WorkspaceMaterialState {
  
}

class WorkspaceMaterial extends React.Component<WorkspaceMaterialProps, WorkspaceMaterialState> {
  constructor(props: WorkspaceMaterialProps){
    super(props);
    this.updateWorkspaceActivity = this.updateWorkspaceActivity.bind(this);
  }
  updateWorkspaceActivity(){
    //This function is very efficient and reuses as much data as possible so it won't call anything from the server other than
    //to refresh the activity and that's because we are forcing it to do so
    this.props.setCurrentWorkspace({workspaceId: this.props.workspace.id, refreshActivity: true});
  }
  render(){
    return <MaterialLoader material={this.props.materialContentNode} workspace={this.props.workspace}
      compositeReplies={this.props.compositeReplies} answerable onAssignmentStateModified={this.updateWorkspaceActivity}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({setCurrentWorkspace}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WorkspaceMaterial);