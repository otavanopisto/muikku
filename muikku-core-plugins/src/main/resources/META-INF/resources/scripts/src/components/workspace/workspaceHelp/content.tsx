import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { MaterialContentNodeListType, WorkspaceType, MaterialCompositeRepliesListType, MaterialContentNodeType, WorkspaceEditModeStateType } from "~/reducers/workspaces";
import ProgressData from '../progressData';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';
import '~/sass/elements/material-page.scss';
import '~/sass/elements/material-admin.scss';
import { ButtonPill } from '~/components/general/button';
import Toc, { TocTopic, TocElement } from '~/components/general/toc';
import Draggable, { Droppable } from "~/components/general/draggable";
import { bindActionCreators } from "redux";
import { updateWorkspaceMaterialContentNode, UpdateWorkspaceMaterialContentNodeTriggerType,
  setWholeWorkspaceHelp, SetWholeWorkspaceMaterialsTriggerType } from "~/actions/workspaces";
import { repairContentNodes } from "~/util/modifiers";

interface ContentProps {
  i18n: i18nType,
  materials: MaterialContentNodeListType,
  activeNodeId: number,
  workspace: WorkspaceType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType,
  setWholeWorkspaceHelp: SetWholeWorkspaceMaterialsTriggerType,
  workspaceEditMode: WorkspaceEditModeStateType,
}

interface ContentState {
  materials: MaterialContentNodeListType,
}

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < (window.innerHeight - 100) && elemBottom >= (document.querySelector(".content-panel__navigation") as HTMLElement).offsetTop + 50;
  return isVisible;
}

class ContentComponent extends React.Component<ContentProps, ContentState> {
  constructor(props: ContentProps) {
    super(props);
    
    this.state = {
      materials: props.materials
    };
    
    this.hotInsertBefore = this.hotInsertBefore.bind(this);
    this.onInteractionBetweenNodes = this.onInteractionBetweenNodes.bind(this);
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
  hotInsertBefore(baseIndex: number, targetBeforeIndex: number) {
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
          this.props.setWholeWorkspaceHelp(contentNodesRepaired);
        },
        dontTriggerReducerActions: true,
      });
    });
  }
  onInteractionBetweenNodes(base: MaterialContentNodeType, target: MaterialContentNodeType) {
    this.hotInsertBefore(
      this.state.materials.findIndex(m => m.workspaceMaterialId === base.workspaceMaterialId),
      this.state.materials.findIndex(m => m.workspaceMaterialId === target.workspaceMaterialId),
    );
  }
  render(){
    if (!this.props.materials || !this.props.materials.length){
      return null;
    }
    
    const isEditable = this.props.workspaceEditMode.active;

    return <Toc tocTitle={this.props.i18n.text.get("plugin.workspace.materials.tocTitle")}>
      {this.state.materials.map((node, nodeIndex)=>{
        let modifier:string = "";
        let icon:string = null;
        let iconTitle:string = null;
        let className:string = null;

        const pageElement = <TocElement modifier={modifier} ref={node.workspaceMaterialId + ""} key={node.workspaceMaterialId}
          isActive={this.props.activeNodeId === node.workspaceMaterialId} className={className} isHidden={node.hidden}  disableScroll iconAfter={icon} iconAfterTitle={iconTitle}
          hash={"p-" + node.workspaceMaterialId}>{node.title}</TocElement>;

        if (!isEditable) {
          if (node.hidden) {
            return null;
          }
          return pageElement;
        } else {
          return <Draggable
            interactionData={node}
            interactionGroup="TOC_SUBNODE"
            key={node.workspaceMaterialId}
            className="toc__item--drag-container"
            handleSelector=".toc__item--drag-handle"
            onInteractionWith={this.onInteractionBetweenNodes.bind(this, node)}
            ref={`draggable-${nodeIndex}-${node.workspaceMaterialId}`}
          >
            <div className="toc__item--drag-handle icon-move"></div>
            {pageElement}
          </Draggable>
        }
      })}
    </Toc>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    materials: state.workspaces.currentHelp,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    workspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({updateWorkspaceMaterialContentNode, setWholeWorkspaceHelp}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { withRef: true }
)(ContentComponent);