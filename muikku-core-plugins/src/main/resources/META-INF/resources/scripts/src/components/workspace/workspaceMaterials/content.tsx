import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialContentNodeListType, WorkspaceType, MaterialCompositeRepliesListType, MaterialContentNodeType, WorkspaceEditModeStateType } from "~/reducers/workspaces";
import ProgressData from '../progressData';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import '~/sass/elements/material-admin.scss';

import Toc, { TocTopic, TocElement } from '~/components/general/toc';
import Draggable, { Droppable } from "~/components/general/draggable";
import { bindActionCreators } from "redux";
import { updateWorkspaceMaterialContentNode, UpdateWorkspaceMaterialContentNodeTriggerType,
  setWholeWorkspaceMaterials, SetWholeWorkspaceMaterialsTriggerType } from "~/actions/workspaces";
import { repairContentNodes } from "~/util/modifiers";

interface ContentProps {
  i18n: i18nType,
  materials: MaterialContentNodeListType,
  materialReplies: MaterialCompositeRepliesListType,
  activeNodeId: number,
  workspace: WorkspaceType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType,
  setWholeWorkspaceMaterials: SetWholeWorkspaceMaterialsTriggerType,
  workspaceEditMode: WorkspaceEditModeStateType,
  doNotSetHashes?: boolean,
  enableTouch?: boolean,
  isLoggedIn: boolean,
  isStudent: boolean,
}

interface ContentState {
  materials: MaterialContentNodeListType,
}

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  const element = (document.querySelector(".content-panel__navigation") as HTMLElement);

  if (element) {
    let isVisible = elemTop < (window.innerHeight - 100) && elemBottom >= element.offsetTop + 50;
    return isVisible;
  } else {
    return true;
  }
}

class ContentComponent extends React.Component<ContentProps, ContentState> {
  constructor(props: ContentProps) {
    super(props);

    this.state = {
      materials: props.materials
    };

    this.hotInsertBeforeSection = this.hotInsertBeforeSection.bind(this);
    this.hotInsertBeforeSubnode = this.hotInsertBeforeSubnode.bind(this);
    this.onInteractionBetweenSections = this.onInteractionBetweenSections.bind(this);
    this.onInteractionBetweenSubnodes = this.onInteractionBetweenSubnodes.bind(this);
  }
  componentDidUpdate(prevProps: ContentProps){
    if (prevProps.activeNodeId !== this.props.activeNodeId){
      this.refresh();
    }
  }
  componentWillReceiveProps(nextProps: ContentProps) {
    this.setState({
      materials: nextProps.materials,
    });
  }
  refresh(props:ContentProps = this.props){
    const tocElement = (this.refs[props.activeNodeId] as TocElement);
    if (tocElement) {
      const element = tocElement.getElement();
      if (!isScrolledIntoView(element)){
        element.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' });
      }
    }
  }
  hotInsertBeforeSection(baseIndex: number, targetBeforeIndex: number) {
    const newMaterialState = [...this.state.materials]
    newMaterialState.splice(baseIndex, 1);
    newMaterialState.splice(targetBeforeIndex, 0, this.state.materials[baseIndex]);
    const contentNodesRepaired = repairContentNodes(newMaterialState);

    const material = this.state.materials[baseIndex];
    const update = contentNodesRepaired.find((cn) => cn.workspaceMaterialId === material.workspaceMaterialId);

    this.setState({
      materials: contentNodesRepaired,
    }, () => {
      this.props.updateWorkspaceMaterialContentNode({
        workspace: this.props.workspace,
        material,
        update: {
          parentId: update.parentId,
          nextSiblingId: update.nextSiblingId,
        },
        success: () => {
          this.props.setWholeWorkspaceMaterials(contentNodesRepaired);
        },
        dontTriggerReducerActions: true,
      })
    });
  }
  hotInsertBeforeSubnode(parentBaseIndex: number, baseIndex: number, parentTargetBeforeIndex: number, targetBeforeIndex: number) {
    // TODO do the action update here for server side update
    const newMaterialState = [...this.state.materials]
    newMaterialState[parentBaseIndex] = {
      ...newMaterialState[parentBaseIndex],
      children: [...newMaterialState[parentBaseIndex].children],
    }
    newMaterialState[parentBaseIndex].children.splice(baseIndex, 1);
    newMaterialState[parentTargetBeforeIndex] = {
      ...newMaterialState[parentTargetBeforeIndex],
      children: [...newMaterialState[parentTargetBeforeIndex].children],
    }
    if (targetBeforeIndex === null) {
      newMaterialState[parentTargetBeforeIndex].children.push(this.state.materials[parentBaseIndex].children[baseIndex]);
    } else if (parentBaseIndex === parentTargetBeforeIndex) {
      newMaterialState[parentTargetBeforeIndex].children.splice(targetBeforeIndex, 0, this.state.materials[parentBaseIndex].children[baseIndex]);
    } else {
      newMaterialState[parentTargetBeforeIndex].children.splice(targetBeforeIndex, 0, this.state.materials[parentBaseIndex].children[baseIndex]);
    }

    const repariedNodes = repairContentNodes(newMaterialState);
    const workspaceId = this.state.materials[parentBaseIndex].children[baseIndex].workspaceMaterialId;

    const material = this.state.materials[parentBaseIndex].children[baseIndex];
    const update = repariedNodes[parentTargetBeforeIndex].children.find((cn: MaterialContentNodeType) => cn.workspaceMaterialId === material.workspaceMaterialId);

    this.setState({
      materials: repariedNodes,
    }, ()=>{
      if (parentBaseIndex !== parentTargetBeforeIndex) {
        (this.refs[`draggable-${parentTargetBeforeIndex}-${workspaceId}`] as Draggable).onRootSelectStart(null, true);
      }

      this.props.updateWorkspaceMaterialContentNode({
        workspace: this.props.workspace,
        material,
        update: {
          parentId: update.parentId,
          nextSiblingId: update.nextSiblingId,
        },
        success: () => {
          this.props.setWholeWorkspaceMaterials(repariedNodes);
        },
        dontTriggerReducerActions: true,
      });
    });
  }
  onInteractionBetweenSections(base: MaterialContentNodeType, target: MaterialContentNodeType) {
    this.hotInsertBeforeSection(
      this.state.materials.findIndex(m => m.workspaceMaterialId === base.workspaceMaterialId),
      this.state.materials.findIndex(m => m.workspaceMaterialId === target.workspaceMaterialId),
    );
  }
  onInteractionBetweenSubnodes(base: MaterialContentNodeType, target: MaterialContentNodeType | number) {
    const parentBaseIndex = this.state.materials.findIndex(m => m.workspaceMaterialId === base.parentId);
    const baseIndex = this.state.materials[parentBaseIndex].children.findIndex(m => m.workspaceMaterialId === base.workspaceMaterialId);
    if (typeof target === "number") {
      this.hotInsertBeforeSubnode(parentBaseIndex, baseIndex,
        this.state.materials.findIndex(m => m.workspaceMaterialId === target), null);
      return;
    }
    const parentTargetBeforeIndex = this.state.materials.findIndex(m => m.workspaceMaterialId === target.parentId);
    const targetBeforeIndex = this.state.materials[parentTargetBeforeIndex].children.findIndex(m => m.workspaceMaterialId === target.workspaceMaterialId);
    this.hotInsertBeforeSubnode(parentBaseIndex, baseIndex,
      parentTargetBeforeIndex, targetBeforeIndex);
  }
  render(){
    if (!this.props.materials || !this.props.materials.length){
      return null;
    }

    const isEditable = this.props.workspaceEditMode.active;

    return <Toc tocTitle={this.props.i18n.text.get("plugin.workspace.materials.tocTitle")}>
      {/*{this.props.workspace ? <ProgressData activity={this.props.workspace.studentActivity} i18n={this.props.i18n}/> : null}*/}
      {this.state.materials.map((node, nodeIndex)=>{
        const isSectionViewRestricted = (node.viewRestrict === "LOGGED_IN" && !this.props.isLoggedIn);
        const isSectionViewRestrictedVisible = node.viewRestrict === "LOGGED_IN" && !this.props.isStudent;
        let icon: string = isSectionViewRestrictedVisible ? "restriction" : null;
        let iconTitle:string = isSectionViewRestrictedVisible ? this.props.i18n.text.get("plugin.workspace.materialViewRestricted") : null;
        let className: string = isSectionViewRestrictedVisible ? "toc__section-container--view-restricted" : "toc__section-container";

        const topic = <TocTopic
          name={node.title}
          isHidden={node.hidden}
          key={node.workspaceMaterialId}
          hash={this.props.doNotSetHashes ? null : "s-" + node.workspaceMaterialId}
          className={className}
          iconAfter={icon}
          iconAfterTitle={iconTitle}
        >
          {node.children.map((subnode)=>{
            if (isSectionViewRestricted) {
              return null;
            }
            const isViewRestrictedVisible = (subnode.viewRestrict === "LOGGED_IN" && !this.props.isStudent);

            let isAssignment = subnode.assignmentType === "EVALUATED";
            let isExercise = subnode.assignmentType === "EXERCISE";

            //this modifier will add the --assignment or --exercise to the list so you can add the border style with it
            let modifier = isAssignment ? "assignment" : (isExercise ? "exercise" : null);
            let icon: string = isViewRestrictedVisible ? "restriction" : null;
            let iconTitle:string = isViewRestrictedVisible ? this.props.i18n.text.get("plugin.workspace.materialViewRestricted") : null;
            let className:string = isViewRestrictedVisible ? "toc__item--view-restricted" : null;

            let compositeReplies = this.props.materialReplies && this.props.materialReplies.find((reply)=>reply.workspaceMaterialId === subnode.workspaceMaterialId);
            if (compositeReplies){
              switch (compositeReplies.state){
                case "ANSWERED":
                  icon = "check"
                  className = "toc__item--answered"
                  iconTitle = this.props.i18n.text.get("plugin.workspace.materials.exerciseDoneTooltip");
                  break;
                case "SUBMITTED":
                  icon = "check"
                  className = "toc__item--submitted"
                  iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentDoneTooltip");
                  break;
                case "WITHDRAWN":
                  icon = "check"
                  className = "toc__item--withdrawn"
                  iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentWithdrawnTooltip");
                  break;
                case "INCOMPLETE":
                  icon = "thumb-down"
                  className = "toc__item--incomplete"
                  iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentIncompleteTooltip");
                  break;
                case "FAILED":
                  icon = "thumb-down"
                  className = "toc__item--failed"
                  iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentFailedTooltip");
                  break;
                case "PASSED":
                  icon = "thumb-up"
                  className = "toc__item--passed"
                  iconTitle = this.props.i18n.text.get("plugin.workspace.materials.assignmentPassedTooltip");
                  break;
                case "UNANSWERED":
                default:
                  break;
              }
            }

            const pageElement = <TocElement modifier={modifier} ref={subnode.workspaceMaterialId + ""} key={subnode.workspaceMaterialId}
              isActive={this.props.activeNodeId === subnode.workspaceMaterialId} className={className} isHidden={subnode.hidden || node.hidden}
              disableScroll iconAfter={icon} iconAfterTitle={iconTitle}
              hash={this.props.doNotSetHashes ? null : "p-" + subnode.workspaceMaterialId}>{subnode.title}</TocElement>;

            if (!isEditable) {
              if (subnode.hidden) {
                return null;
              }
              return pageElement;
            } else {
              return <Draggable
                interactionData={subnode}
                interactionGroup="TOC_SUBNODE"
                key={subnode.workspaceMaterialId}
                className="toc__item--drag-container"
                handleSelector=".toc__item--drag-handle"
                onInteractionWith={this.onInteractionBetweenSubnodes.bind(this, subnode)}
                ref={`draggable-${nodeIndex}-${subnode.workspaceMaterialId}`}
                enableTouch={this.props.enableTouch}
              >
                <div className="toc__item--drag-handle icon-move"></div>
                {pageElement}
              </Draggable>
            }
          }).concat(isEditable ? <Droppable
            key="LAST" interactionData={node.workspaceMaterialId}
            interactionGroup="TOC_SUBNODE"
            className="toc__element--drag-placeholder-container"></Droppable> : [])}
        </TocTopic>

        if (!isEditable) {
          if (node.hidden) {
            return null;
          }
          return topic;
        } else {
          return <Draggable
            interactionData={node}
            interactionGroup="TOC"
            key={node.workspaceMaterialId}
            className="toc__section--drag-container"
            handleSelector=".toc__section--drag-handle"
            onInteractionWith={this.onInteractionBetweenSections.bind(this, node)}
            enableTouch={this.props.enableTouch}
          >
          <div className="toc__section--drag-handle icon-move"></div>
            {topic}
          </Draggable>
        }
      })}
    </Toc>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    materials: state.workspaces.currentMaterials,
    materialReplies: state.workspaces.currentMaterialsReplies,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    workspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
    isLoggedIn: state.status.loggedIn,
    isStudent: state.status.loggedIn && state.status.isStudent,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({updateWorkspaceMaterialContentNode, setWholeWorkspaceMaterials}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ContentComponent);
