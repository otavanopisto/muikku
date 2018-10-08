import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import ProgressData from '../progressData';

interface WorkspaceHomeHeaderProps {
  workspace: WorkspaceType,
  i18n: i18nType
}

interface WorkspaceHomeHeaderState {
  
}

class WorkspaceHomeHeader extends React.Component<WorkspaceHomeHeaderProps, WorkspaceHomeHeaderState> {
  render(){
    //Remove the paddingTop style as you add proper classs names with proper styles
    return <div style={{paddingTop:"4.2rem"}}>
      <header className="flex-row workspace-header-wrapper" style={
          {backgroundImage:this.props.workspace && this.props.workspace.hasCustomImage ? 
            `url(/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-cropped)` : "url(/gfx/workspace-default-header.jpg)"}}>
        <div className="workspace-header-container lg-flex-cell-16 md-flex-cell-16 sm-flex-cell-16 no-margin-bottom">
          <h1 className="workspace-title">{this.props.workspace && this.props.workspace.name}</h1>
          {this.props.workspace && this.props.workspace.educationTypeName ? <div className="workspace-study-level-indicator indicator1">
            <div className="workspace-study-level-text">{this.props.workspace.educationTypeName}</div>
          </div> : null}
          {this.props.workspace && this.props.workspace.nameExtension ? 
            <div className="workspace-additional-info-wrapper"><span>{this.props.workspace.nameExtension}</span></div> : null}
          {this.props.workspace && this.props.workspace.studentActivity  ? <ProgressData i18n={this.props.i18n} activity={this.props.workspace.studentActivity}/> : null}
        </div>
      </header>
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceHomeHeader);