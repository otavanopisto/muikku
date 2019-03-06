import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialContentNodeListType, WorkspaceType, MaterialCompositeRepliesListType } from "~/reducers/workspaces";
import ProgressData from '../progressData';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { ButtonPill } from '~/components/general/button';
import Toc, { TocTopic, TocElement } from '~/components/general/toc';

interface ContentProps {
  i18n: i18nType,
  materials: MaterialContentNodeListType,
  materialReplies: MaterialCompositeRepliesListType,
  activeNodeId: number,
  workspace: WorkspaceType
}

interface ContentState {
  
}

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < (window.innerHeight - 100) && elemBottom >= (document.querySelector(".content-panel__navigation") as HTMLElement).offsetTop + 50;
  return isVisible;
}

class ContentComponent extends React.Component<ContentProps, ContentState> {
  componentDidUpdate(prevProps: ContentProps){
    if (prevProps.activeNodeId !== this.props.activeNodeId){
      this.refresh();
    }
  }
  refresh(props:ContentProps = this.props){
    let element = (this.refs[props.activeNodeId] as TocElement).getElement();
    if (!isScrolledIntoView(element)){
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
  render(){
    if (!this.props.materials || !this.props.materials.length){
      return null;
    }

    return <Toc>
      {/*{this.props.workspace ? <ProgressData activity={this.props.workspace.studentActivity} i18n={this.props.i18n}/> : null}*/}
      {
        this.props.materials.map((node)=>{
          return <TocTopic name={node.title} key={node.workspaceMaterialId}>
            {node.children.map((subnode)=>{
              let isAssignment = subnode.assignmentType === "EVALUATED";
              let isExercise = subnode.assignmentType === "EXERCISE";
              let isNormalPage = subnode.assignmentType === null;

              //this modifier will add the --assignment or --exercise to the list so you can add the border style with it
              let modifier = isAssignment ? "assignment" : (isExercise ? "exercise" : null);
              let icon:string = null;
              let iconTitle:string = null;
              let className:string = null;

              let compositeReplies = this.props.materialReplies && this.props.materialReplies.find((reply)=>reply.workspaceMaterialId === subnode.workspaceMaterialId);
              if (compositeReplies){
                switch (compositeReplies.state){
                  case "ANSWERED":
                    icon = "checkmark"
                    className = "toc__item--answered"
                    iconTitle = this.props.i18n.text.get("plugin.workspace.materials.exerciseDoneTooltip");
                    break;
                  case "SUBMITTED":
                    icon = "checkmark"
                    className = "toc__item--submitted"
                    iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentDoneTooltip");
                    break;
                  case "WITHDRAWN":
                    icon = "checkmark"
                    className = "toc__item--withdrawn"
                    iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentWithdrawnTooltip");
                    break;
                  case "INCOMPLETE":
                    icon = "thumb-down-alt"
                    className = "toc__item--incomplete"
                    iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentIncompleteTooltip");
                    break;
                  case "FAILED":
                    icon = "thumb-down-alt"
                    className = "toc__item--failed"
                    iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentFailedTooltip");
                    break;
                  case "PASSED":
                    icon = "thumb-up-alt"
                    className = "toc__item--passed"
                    iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentPassedTooltip");
                    break;
                  case "UNANSWERED":
                  default:
                    break;
                }
              }

              return <TocElement modifier={modifier} ref={subnode.workspaceMaterialId + ""} key={subnode.workspaceMaterialId}
                isActive={this.props.activeNodeId === subnode.workspaceMaterialId} className={className} disableScroll iconAfter={icon} iconAfterTitle={iconTitle}
                hash={"p-" + subnode.workspaceMaterialId}>{subnode.title}</TocElement>
            })}
          </TocTopic>
        })
      }
    </Toc>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    materials: state.workspaces.currentMaterials,
    materialReplies: state.workspaces.currentMaterialsReplies,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    workspace: state.workspaces.currentWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ContentComponent);