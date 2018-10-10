import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import ProgressData from '../progressData';
import { StatusType } from "~/reducers/base/status";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import { updateWorkspace, UpdateWorkspaceTriggerType } from "~/actions/workspaces";

interface WorkspaceHomeHeaderProps {
  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType,
  updateWorkspace: UpdateWorkspaceTriggerType
}

interface WorkspaceHomeHeaderState {
}

class WorkspaceHomeHeader extends React.Component<WorkspaceHomeHeaderProps, WorkspaceHomeHeaderState> {
  constructor(props: WorkspaceHomeHeaderProps){
    super(props);

    this.toggleWorkspacePublished = this.toggleWorkspacePublished.bind(this);
  }
  toggleWorkspacePublished(){
    this.props.updateWorkspace(this.props.workspace, {published: !this.props.workspace.published})
  }
  render(){
    //Remove the paddingTop style as you add proper class names with proper styles
    return <div style={{paddingTop:"4.2rem"}}>
      <header className="workspace-header-wrapper" style={
          {backgroundImage:this.props.workspace && this.props.workspace.hasCustomImage ? 
            `url(/rest/workspace/workspaces/${this.props.workspace.id}/workspacefile/workspace-frontpage-image-cropped)` : "url(/gfx/workspace-default-header.jpg)"}}>
        <div className="workspace-header-container">
          <h1 className="workspace-title">{this.props.workspace && this.props.workspace.name}</h1>
          {this.props.workspace && this.props.workspace.educationTypeName ? <div className="workspace-study-level-indicator indicator1">
            <div className="workspace-study-level-text">{this.props.workspace.educationTypeName}</div>
          </div> : null}
          {this.props.workspace && this.props.workspace.nameExtension ? 
            <div className="workspace-additional-info-wrapper"><span>{this.props.workspace.nameExtension}</span></div> : null}
          {this.props.workspace && this.props.workspace.studentActivity  ? <ProgressData i18n={this.props.i18n} activity={this.props.workspace.studentActivity}/> : null}
        </div>
      </header>
      <section className="">
        <div className="workspace-meta-item-wrapper">
          <span className="workspace-meta-title">{this.props.i18n.text.get('plugin.workspace.index.courseLengthLabel')}</span>
          <span className="workspace-meta-desc">
            {this.props.workspace ? this.props.i18n.text.get('plugin.workspace.index.courseLength',
                this.props.workspace.additionalInfo.courseLength,
                this.props.workspace.additionalInfo.courseLengthSymbol.symbol) : null}
          </span>
          </div>
          <div className="workspace-meta-item-wrapper">
            <span className="workspace-meta-title">{this.props.i18n.text.get('plugin.workspace.index.courseSubjectLabel')}</span>
            <span className="workspace-meta-desc">{this.props.workspace ? this.props.workspace.additionalInfo.subject.name : null}</span>
          </div>
          {this.props.workspace && this.props.workspace.additionalInfo.workspaceType ? 
            <div className="workspace-meta-item-wrapper">
              <span className="workspace-meta-title">{this.props.i18n.text.get('plugin.workspace.index.courseTypeLabel')}</span>
              <span className="workspace-meta-desc">{this.props.workspace.additionalInfo.workspaceType}</span>
            </div>
          : null}
          {this.props.workspace && this.props.workspace.additionalInfo.beginDate && this.props.workspace.additionalInfo.endDate ? 
            <div className="workspace-meta-item-wrapper">
              <span className="workspace-meta-title">{this.props.i18n.text.get('plugin.workspace.index.courseDatesLabel')}</span>
              <span className="workspace-meta-desc workspace-duration">
                {this.props.i18n.text.get('plugin.workspace.index.courseDates',
                    this.props.i18n.time.format(this.props.workspace.additionalInfo.beginDate),
                    this.props.i18n.time.format(this.props.workspace.additionalInfo.endDate))}
              </span>
            </div>
          : null}
          {this.props.workspace && this.props.status.permissions.WORKSPACE_CAN_PUBLISH ? 
            <div className="workspace-publication-container" onClick={this.toggleWorkspacePublished}>
              <Button buttonModifiers={this.props.workspace.published ? "workspace-unpublish" : "workspace-publish"}>
                {this.props.i18n.text.get(this.props.workspace.published ? 'plugin.workspace.index.unpublish' : 'plugin.workspace.index.publish')}
              </Button>
            </div>
          : null}
        </section>
    </div>
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
  return bindActionCreators({updateWorkspace}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceHomeHeader);