import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceType, MaterialContentNodeListType, MaterialContentNodeType, MaterialCompositeRepliesListType } from "~/reducers/workspaces";

import ContentPanel, { ContentPanelItem } from '~/components/general/content-panel';
import MaterialLoader from "~/components/base/material-loader";
import { StatusType } from "~/reducers/base/status";
import equals = require("deep-equal");

import WorkspaceMaterial from './material';
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown"; 
import { bindActionCreators } from "redux";
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType,
  createWorkspaceMaterialContentNode, CreateWorkspaceMaterialContentNodeTriggerType } from "~/actions/workspaces";

interface WorkspaceMaterialsProps {
  i18n: i18nType,
  workspace: WorkspaceType,
  materials: MaterialContentNodeListType,
  materialReplies: MaterialCompositeRepliesListType,
  navigation: React.ReactElement<any>,
  activeNodeId: number,
  status: StatusType,
  onActiveNodeIdChange: (activeNodeId: number)=>any,
  onOpenNavigation: ()=>any,
  
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  createWorkspaceMaterialContentNode: CreateWorkspaceMaterialContentNodeTriggerType,
}

interface WorkspaceMaterialsState {
  defaultOffset: number
}

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < window.innerHeight && elemBottom >= (document.querySelector("#stick") as HTMLElement).offsetHeight;
  return isVisible;
}

const DEFAULT_OFFSET = 67;

class WorkspaceMaterials extends React.Component<WorkspaceMaterialsProps, WorkspaceMaterialsState> {
  private flattenedMaterial: MaterialContentNodeListType;
  constructor(props: WorkspaceMaterialsProps){
    super(props);
    
    this.state = {
      defaultOffset: DEFAULT_OFFSET
    }
    
    this.onOpenNavigation = this.onOpenNavigation.bind(this);
    this.getFlattenedMaterials = this.getFlattenedMaterials.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.startupEditor = this.startupEditor.bind(this);
    this.createPage = this.createPage.bind(this);
    this.createChapter = this.createChapter.bind(this);
    this.pastePage = this.pastePage.bind(this);
    this.attachFile = this.attachFile.bind(this);
    this.createPageFromBinary = this.createPageFromBinary.bind(this);
    
    this.getFlattenedMaterials(props);
  }
  componentDidMount(){
    let defaultOffset = (document.querySelector("#stick") as HTMLElement || {} as any).offsetHeight || DEFAULT_OFFSET;
    if (defaultOffset !== this.state.defaultOffset){
      this.setState({
        defaultOffset
      })
    }
    
    window.addEventListener("scroll", this.onScroll);
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.onScroll);
  }
  componentWillReceiveProps(nextProps: WorkspaceMaterialsProps){
    if (this.props.materials !== nextProps.materials){
      this.getFlattenedMaterials(nextProps);
    }
  }
  startupEditor(chapter: MaterialContentNodeType) {
    this.props.setWorkspaceMaterialEditorState({
      currentNodeWorkspace: this.props.workspace,
      currentNodeValue: chapter,
      currentDraftNodeValue: {...chapter},
      parentNodeValue: null,
      section: true,
      opened: true,
      canHide: true,
      canDelete: true,
      disablePlugins: false,
      canPublish: true,
      canRevert: true,
      canRestrictView: true,
      canCopy: false,
      canChangePageType: false,
      canChangeExerciseType: false,
      canSetLicense: false,
      canSetProducers: false,
      canAddAttachments: false,
      canEditContent: false,
      showRemoveAnswersDialogForPublish: false,
      showRemoveAnswersDialogForDelete: false,
    });
  }
  createPage(chapter: MaterialContentNodeType, nextSibling: MaterialContentNodeType) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      parentMaterial: chapter,
      nextSibling,
      title: this.props.i18n.text.get("plugin.workspace.materialsManagement.newPageTitle"),
    });
  }
  createPageFromBinary(
      chapter: MaterialContentNodeType,
      nextSibling: MaterialContentNodeType,
      e: React.ChangeEvent<HTMLInputElement>
  ) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      parentMaterial: chapter,
      nextSibling,
      title: e.target.files[0].name,
      file: e.target.files[0],
    });
  }
  createChapter(nextSibling: MaterialContentNodeType) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      nextSibling,
      title: this.props.i18n.text.get("plugin.workspace.materialsManagement.newPageTitle"),
    });
  }
  pastePage(chapter: MaterialContentNodeType, nextSibling: MaterialContentNodeType) {
    const workspaceMaterialCopiedId = localStorage.getItem("workspace-material-copied-id") || null;
    const workspaceCopiedId = localStorage.getItem("workspace-copied-id") || null;
    
    if (workspaceMaterialCopiedId) {
      this.props.createWorkspaceMaterialContentNode({
        workspace: this.props.workspace,
        parentMaterial: chapter,
        nextSibling,
        copyMaterialId: parseInt(workspaceMaterialCopiedId),
        copyWorkspaceId: parseInt(workspaceCopiedId),
      })
    }
  }
  attachFile(chapter: MaterialContentNodeType, nextSibling: MaterialContentNodeType) {
    
  }
  getFlattenedMaterials(props: WorkspaceMaterialsProps = this.props){
    this.flattenedMaterial = [];
    if (!props.materials){
      return;
    }
    props.materials.forEach((node)=>{
      node.children.forEach((subnode)=>{
        this.flattenedMaterial.push(subnode);
      });
    });
  }
  onOpenNavigation(){
    this.props.onOpenNavigation();
  }
  onScroll(){
    let newActive:number = this.getActive();
    if (newActive !== this.props.activeNodeId){
      this.props.onActiveNodeIdChange(newActive);
    }
  }
  getActive(){
    //gets the current active node
    let winner:number = null;
  
    //when you are at the bottom the active is the last one
    let isAllTheWayToTheBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight;
    if (!isAllTheWayToTheBottom){
      let winnerTop:number = null;
      for (let refKey of Object.keys(this.refs)){
        let refKeyInt = parseInt(refKey);
        if (!refKeyInt){
          continue;
        }
        let element = (this.refs[refKey] as ContentPanelItem).getComponent();
        let elementTop = element.getBoundingClientRect().top;
        let elementBottom = element.getBoundingClientRect().bottom;
        let isVisible = elementTop < window.innerHeight && elementBottom >= (document.querySelector("#stick") as HTMLElement).offsetHeight;
        if (isVisible && (elementTop < winnerTop || !winner)){
          winner = refKeyInt;
          winnerTop = elementTop;
        }
      }
    } else {
      winner = this.flattenedMaterial[this.flattenedMaterial.length - 1].workspaceMaterialId;
    }
  
    winner = winner || this.flattenedMaterial[0].workspaceMaterialId;
    return winner;
  }
  render(){
    if (!this.props.materials || !this.props.workspace){
      return null;
    }

    const titlesAreEditable = this.props.status.permissions.WORKSPACE_MANAGE_WORKSPACE;

    return <ContentPanel onOpenNavigation={this.onOpenNavigation} modifier="materials" navigation={this.props.navigation}
      title={this.props.workspace.name} ref="content-panel">
      {!this.props.materials.length ? this.props.i18n.text.get("!TODOERRMSG no material information") : null}
      {this.props.materials.map((chapter, index)=>{
        return <section className="content-panel__chapter" key={chapter.workspaceMaterialId} id={"section-" + chapter.workspaceMaterialId}>
          {/*TOP OF THE CHAPTER*/}
          <div className="material-admin-panel material-admin-panel--master-functions">
            <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.createChapterTooltip")}>
              <ButtonPill buttonModifiers="material-management-master" icon="add" onClick={this.createChapter.bind(this, chapter)}/>
            </Dropdown>
            {index !== 0 ?
              <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.createPageTooltip")}>
                <ButtonPill buttonModifiers="material-management-master" icon="add" onClick={this.createPage.bind(this, this.props.materials[index - 1], null)}/>
              </Dropdown>
            : null}
            {index !== 0 ?
              <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.pastePageTooltip")}>
                <ButtonPill buttonModifiers="material-management-master" icon="content_paste" onClick={this.pastePage.bind(this, this.props.materials[index - 1], null)}/>
              </Dropdown>
            : null}
            {index !== 0 ?
              <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.attachFileTooltip")}>
                <ButtonPill buttonAs="div" buttonModifiers="material-management-master" icon="attachment">
                  <input type="file" onChange={this.createPageFromBinary.bind(this, this.props.materials[index - 1], null)}/>
                </ButtonPill>
              </Dropdown>
            : null}
          </div>

            
          <h2 className={`content-panel__chapter-title ${chapter.hidden ? "content-panel__chapter-title--hidden" : ""}`}>
            {chapter.title}
            {titlesAreEditable ? 
              <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.editChapterTooltip")}>
                <ButtonPill buttonModifiers="material-management-chapter" icon="edit" onClick={this.startupEditor.bind(this, chapter)}/>
              </Dropdown>
            : null}
          </h2>
            
          {chapter.children.map((node)=>{
            let compositeReplies = this.props.workspace && this.props.materialReplies && this.props.materialReplies.find((reply)=>reply.workspaceMaterialId === node.workspaceMaterialId);
            let material = !this.props.workspace || !this.props.materialReplies  ? null :
              <ContentPanelItem ref={node.workspaceMaterialId + ""} key={node.workspaceMaterialId + ""}>
                <div id={"p-" + node.workspaceMaterialId} style={{transform: "translateY(" + (-this.state.defaultOffset) + "px)"}}/>
                {/*TOP OF THE PAGE*/}
                <div className="material-admin-panel material-admin-panel--master-functions">
                  <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.createPageTooltip")}>
                    <ButtonPill buttonModifiers="material-management-master"icon="add" onClick={this.createPage.bind(this, chapter, node)}/>
                  </Dropdown>
                  <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.pastePageTooltip")}>
                    <ButtonPill buttonModifiers="material-management-master"icon="content_paste" onClick={this.pastePage.bind(this, chapter, node)}/>
                  </Dropdown>
                  <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.attachFileTooltip")}>
                    <ButtonPill buttonModifiers="material-management-master" icon="attachment">
                      <input type="file" onChange={this.createPageFromBinary.bind(this, chapter, node)}/>
                    </ButtonPill>
                  </Dropdown>
                </div>
                <WorkspaceMaterial page={chapter} materialContentNode={node} workspace={this.props.workspace} compositeReplies={compositeReplies}/>
              </ContentPanelItem>;
            return material;
           })}
         </section>
       })
      }
    </ContentPanel>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    materials: state.workspaces.currentMaterials,
    materialReplies: state.workspaces.currentMaterialsReplies,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({setWorkspaceMaterialEditorState, createWorkspaceMaterialContentNode}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
)(WorkspaceMaterials);