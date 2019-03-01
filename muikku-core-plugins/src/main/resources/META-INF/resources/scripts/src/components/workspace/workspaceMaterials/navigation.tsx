import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialContentNodeListType, WorkspaceType, MaterialCompositeRepliesListType } from "~/reducers/workspaces";
import ProgressData from '../progressData';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import { ButtonPill } from '~/components/general/button';
import Navigation, { NavigationTopic, NavigationElement } from '~/components/general/navigation';

interface NavigationProps {
  i18n: i18nType,
  materials: MaterialContentNodeListType,
  materialReplies: MaterialCompositeRepliesListType,
  activeNodeId: number,
  workspace: WorkspaceType
}

interface NavigationState {
  
}

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < (window.innerHeight - 100) && elemBottom >= (document.querySelector(".content-panel__navigation") as HTMLElement).offsetTop + 50;
  return isVisible;
}

class NavigationComponent extends React.Component<NavigationProps, NavigationState> {
  componentDidUpdate(prevProps: NavigationProps){
    if (prevProps.activeNodeId !== this.props.activeNodeId){
      this.refresh();
    }
  }
  refresh(props:NavigationProps = this.props){
    let element = (this.refs[props.activeNodeId] as NavigationElement).getElement();
    if (!isScrolledIntoView(element)){
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
    }
  }
  render(){
    if (!this.props.materials || !this.props.materials.length){
      return null;
    }
    
    return <Navigation>
      {/*{this.props.workspace ? <ProgressData activity={this.props.workspace.studentActivity} i18n={this.props.i18n}/> : null}*/}
      {
        this.props.materials.map((node)=>{
          return <NavigationTopic name={node.title} key={node.workspaceMaterialId}>
            {node.children.map((subnode)=>{
              let isAssignment = subnode.assignmentType === "EVALUATED";
              let isExercise = subnode.assignmentType === "EXERCISE";
              let isNormalPage = subnode.assignmentType === null;
              
              //this modifier will add the --assignment or --exercise to the list so you can add the border style with it
              let modifier = isAssignment ? "assignment" : (isExercise ? "exercise" : null);
              let icon:string = null;
              let iconTitle:string = null;
              
              let compositeReplies = this.props.materialReplies && this.props.materialReplies.find((reply)=>reply.workspaceMaterialId === subnode.workspaceMaterialId);
              if (compositeReplies){
                switch (compositeReplies.state){
                  case "PASSED":
                    icon = "guides"
                    iconTitle = this.props.i18n.text.get("PASSED");
                    break;
                  case "ANSWERED":
                    icon = "guides"
                    iconTitle = this.props.i18n.text.get("ANSWERED");
                    break;
                  case "SUBMITTED":
                    icon = "guides"
                    iconTitle = this.props.i18n.text.get("SUBMITTED");
                    break;
                  case "WITHDRAWN":
                    icon = "guides"
                    iconTitle = this.props.i18n.text.get("WITHDRAWN");
                    break;
                  case "FAILED":
                    icon = "guides"
                    iconTitle = this.props.i18n.text.get("FAILED");
                    break;
                  case "INCOMPLETE":
                    icon = "guides"
                    iconTitle = this.props.i18n.text.get("INCOMPLETE");
                    break;
                  case "UNANSWERED":
                  default:
                    break;
                }
              }
              
              return <NavigationElement modifier={modifier} ref={subnode.workspaceMaterialId + ""} iconColor={null} icon={null} key={subnode.workspaceMaterialId}
                isActive={this.props.activeNodeId === subnode.workspaceMaterialId} disableScroll iconAfter={icon} iconAfterTitle={iconTitle}
                hash={"p-" + subnode.workspaceMaterialId}>{subnode.title}</NavigationElement>
            })}
          </NavigationTopic>
        })
      }
    </Navigation>
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
)(NavigationComponent);