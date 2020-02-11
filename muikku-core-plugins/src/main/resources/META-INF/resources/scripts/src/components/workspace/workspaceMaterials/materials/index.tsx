import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceType, MaterialContentNodeListType, MaterialContentNodeType, MaterialCompositeRepliesListType, WorkspaceEditModeStateType } from "~/reducers/workspaces";

import ContentPanel, { ContentPanelItem } from '~/components/general/content-panel';
import equals = require("deep-equal");

import WorkspaceMaterial from './material';
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import { bindActionCreators } from "redux";
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType,
  createWorkspaceMaterialContentNode, CreateWorkspaceMaterialContentNodeTriggerType, updateWorkspaceMaterialContentNode, UpdateWorkspaceMaterialContentNodeTriggerType } from "~/actions/workspaces";

interface WorkspaceMaterialsProps {
  i18n: i18nType,
  workspace: WorkspaceType,
  materials: MaterialContentNodeListType,
  materialReplies: MaterialCompositeRepliesListType,
  navigation: React.ReactElement<any>,
  activeNodeId: number,
  workspaceEditMode: WorkspaceEditModeStateType,
  onActiveNodeIdChange: (activeNodeId: number)=>any,
  onOpenNavigation: ()=>any,

  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  createWorkspaceMaterialContentNode: CreateWorkspaceMaterialContentNodeTriggerType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType,
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
    this.createSection = this.createSection.bind(this);
    this.pastePage = this.pastePage.bind(this);
    this.createPageFromBinary = this.createPageFromBinary.bind(this);
    this.toggleSectionHiddenStatus = this.toggleSectionHiddenStatus.bind(this);

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
  toggleSectionHiddenStatus(section: MaterialContentNodeType) {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      material: section,
      update: {
        hidden: !section.hidden,
      },
      isDraft: false
    });
  }
  getMaterialsOptionListDropdown(section: MaterialContentNodeType,
      nextSection: MaterialContentNodeType, nextSibling: MaterialContentNodeType, includesSection: boolean) {
    const materialManagementItemsOptions: Array<any> = [
      {
        icon: "plus",
        text: 'plugin.workspace.materialsManagement.createChapterTooltip',
        onClick: this.createSection.bind( this, nextSection ),
        file: false,
      },
      {
        icon: "plus",
        text: 'plugin.workspace.materialsManagement.createPageTooltip',
        onClick: this.createPage.bind( this, section, nextSibling),
        file: false,
      },
      {
        icon: "paste",
        text: 'plugin.workspace.materialsManagement.pastePageTooltip',
        onClick: this.pastePage.bind( this, section, nextSibling),
        file: false,
      },
      {
        icon: "attachment",
        text: 'plugin.workspace.materialsManagement.attachFileTooltip',
        onChange: this.createPageFromBinary.bind( this, section, nextSibling),
        file: true,
      }
    ]

    if (!includesSection) {
      materialManagementItemsOptions.shift();
    }

    return materialManagementItemsOptions;
  }
  startupEditor(section: MaterialContentNodeType) {
    this.props.setWorkspaceMaterialEditorState({
      currentNodeWorkspace: this.props.workspace,
      currentNodeValue: section,
      currentDraftNodeValue: {...section},
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
      canSetTitle: true,
    });
  }
  createPage(section: MaterialContentNodeType, nextSibling: MaterialContentNodeType) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      rootParentId: this.props.workspace.details.rootFolderId,
      parentMaterial: section,
      nextSibling,
      title: this.props.i18n.text.get("plugin.workspace.materialsManagement.newPageTitle"),
      makeFolder: false,
    });
  }
  createPageFromBinary(
      section: MaterialContentNodeType,
      nextSibling: MaterialContentNodeType,
      e: React.ChangeEvent<HTMLInputElement>
  ) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      rootParentId: this.props.workspace.details.rootFolderId,
      parentMaterial: section,
      nextSibling,
      title: e.target.files[0].name,
      file: e.target.files[0],
      makeFolder: false,
    });
  }
  createSection(nextSibling: MaterialContentNodeType) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      rootParentId: this.props.workspace.details.rootFolderId,
      nextSibling,
      title: this.props.i18n.text.get("plugin.workspace.materialsManagement.newPageTitle"),
      makeFolder: true,
    });
  }
  pastePage(section: MaterialContentNodeType, nextSibling: MaterialContentNodeType) {
    const workspaceMaterialCopiedId = localStorage.getItem("workspace-material-copied-id") || null;
    const workspaceCopiedId = localStorage.getItem("workspace-copied-id") || null;

    if (workspaceMaterialCopiedId) {
      this.props.createWorkspaceMaterialContentNode({
        workspace: this.props.workspace,
        parentMaterial: section,
        rootParentId: this.props.workspace.details.rootFolderId,
        nextSibling,
        copyMaterialId: parseInt(workspaceMaterialCopiedId),
        copyWorkspaceId: parseInt(workspaceCopiedId),
        makeFolder: false,
      })
    }
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
      let winnerVisibleWeight:number = null;
      for (let refKey of Object.keys(this.refs)){
        let refKeyInt = parseInt(refKey);
        if (!refKeyInt){
          continue;
        }
        let element = (this.refs[refKey] as ContentPanelItem).getComponent();
        let elementTop = element.getBoundingClientRect().top;
        let elementBottom = element.getBoundingClientRect().bottom;
        let isVisible = elementTop < window.innerHeight && elementBottom >= (document.querySelector("#stick") as HTMLElement).offsetHeight;
        if (isVisible){
          let cropBottom = window.innerHeight - elementBottom;
          if (cropBottom > 0) {
            cropBottom = 0;
          }
          let cropTop = elementTop;
          if (cropTop > 0) {
            cropTop = 0;
          }
          const cropTotal = -cropTop-cropBottom;

          const visibleFraction = (element.offsetHeight - cropTotal) / element.offsetHeight;
          let weight = visibleFraction;
          if (!winner || elementTop < winnerTop) {
            weight += 0.4;
          }
          if (!winnerVisibleWeight || weight >= winnerVisibleWeight) {
            winner = refKeyInt;
            winnerTop = elementTop;
            winnerVisibleWeight = weight;
          }
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

    const isEditable = this.props.workspaceEditMode.active;

    const createSectionElementWhenEmpty = this.props.materials.length === 0 && isEditable ? (
      <div className="material-admin-panel material-admin-panel--master-functions">
        <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.createChapterTooltip")}>
          <ButtonPill buttonModifiers="material-management-master" icon="plus" onClick={this.createSection.bind(this, null)}/>
        </Dropdown>
      </div>
    ) : null;

    const emptyMessage = this.props.materials.length === 0 ? (
      <div className="material-page material-page--empty">{this.props.i18n.text.get("plugin.workspace.materialsManagement.empty")}</div>
    ) : null;

    const results: any = [];
    this.props.materials.forEach((section, index)=>{

      if (index === 0 && isEditable) {
        results.push(<div key={"sectionfunctions-" + section.workspaceMaterialId} className="material-admin-panel material-admin-panel--master-functions">
          <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.createChapterTooltip")}>
            <ButtonPill buttonModifiers="material-management-master" icon="plus" onClick={this.createSection.bind(this, section)}/>
          </Dropdown>
        </div>);
      }

      const nextSection = this.props.materials[index + 1] || null;

      const lastManagementOptionsWithinSectionItem = isEditable ? (
        <div className="material-admin-panel material-admin-panel--master-functions">
          <Dropdown modifier="material-management" items={this.getMaterialsOptionListDropdown(section, nextSection, null, true).map((item)=>{
            return (closeDropdown: ()=>any)=>{
              if (item.file) {
                return <label htmlFor="base-file-input" className={`link link--full link--material-management-dropdown`}>
                    <input type="file" id="base-file-input" onChange={(e)=>{closeDropdown(); item.onChange && item.onChange(e)}}/>
                    <span className={`link__icon icon-${item.icon}`}></span>
                    <span>{this.props.i18n.text.get(item.text)}</span>
                 </label>
              }
              return <Link className={`link link--full link--material-management-dropdown`}
                onClick={()=>{closeDropdown(); item.onClick && item.onClick()}}>
                 <span className={`link__icon icon-${item.icon}`}></span>
                 <span>{this.props.i18n.text.get(item.text)}</span>
               </Link>}
             })}>
            <ButtonPill buttonModifiers="material-management-master" icon="plus"/>
          </Dropdown>
        </div>
      ) : null;

      const sectionSpecificContentData: any = [];

      section.children.forEach((node, index)=>{
        // this is the next sibling for the content node that is to be added, aka the current
        const nextSibling = node;
        if (isEditable) {
          sectionSpecificContentData.push(<div key={node.workspaceMaterialId + "-dropdown"} className="material-admin-panel material-admin-panel--master-functions">
            <Dropdown modifier="material-management" items={this.getMaterialsOptionListDropdown(section, nextSection, nextSibling, false).map((item)=>{
              return (closeDropdown: ()=>any)=>{
                if (item.file) {
                  return <label htmlFor={node.workspaceMaterialId + "-input"} className={`link link--full link--material-management-dropdown`}>
                      <input type="file" id={node.workspaceMaterialId + "-input"} onChange={(e)=>{closeDropdown(); item.onChange && item.onChange(e)}}/>
                      <span className={`link__icon icon-${item.icon}`}></span>
                      <span>{this.props.i18n.text.get(item.text)}</span>
                   </label>
                }
                return <Link className={`link link--full link--material-management-dropdown`}
                  onClick={()=>{closeDropdown(); item.onClick && item.onClick()}}>
                   <span className={`link__icon icon-${item.icon}`}></span>
                   <span>{this.props.i18n.text.get(item.text)}</span>
                 </Link>}
              })}>
              <ButtonPill buttonModifiers="material-management-master" icon="plus"/>
            </Dropdown>
          </div>);
        }

        let compositeReplies = this.props.workspace && this.props.materialReplies && this.props.materialReplies.find((reply)=>reply.workspaceMaterialId === node.workspaceMaterialId);
        let material = !this.props.workspace || !this.props.materialReplies || (!isEditable && node.hidden) ? null :
          <ContentPanelItem ref={node.workspaceMaterialId + ""} key={node.workspaceMaterialId + ""}>
            <div id={"p-" + node.workspaceMaterialId} style={{transform: "translateY(" + (-this.state.defaultOffset) + "px)"}}/>
            {/*TOP OF THE PAGE*/}
            <WorkspaceMaterial
              folder={section}
              materialContentNode={node}
              workspace={this.props.workspace}
              compositeReplies={compositeReplies}
             />
          </ContentPanelItem>;
        sectionSpecificContentData.push(material);
      });

      if (!isEditable && section.hidden) {
        return;
      }

      results.push(<section key={"section-" + section.workspaceMaterialId} className="content-panel__chapter" id={"section-" + section.workspaceMaterialId}>
        {/*TOP OF THE CHAPTER*/}
        <h2 className={`content-panel__chapter-title ${section.hidden ? "content-panel__chapter-title--hidden" : ""}`}>
          {isEditable ?
            <div className="material-admin-panel material-admin-panel--chapter-functions">
              <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.editChapterTooltip")}>
                <ButtonPill buttonModifiers="material-management-chapter" icon="pencil" onClick={this.startupEditor.bind(this, section)}/>
              </Dropdown>
              <Dropdown openByHover modifier="material-management-tooltip" content={
                section.hidden ? this.props.i18n.text.get("plugin.workspace.materialsManagement.showChapterTooltip") :
                this.props.i18n.text.get("plugin.workspace.materialsManagement.hideChapterTooltip")
              }>
                <ButtonPill buttonModifiers="material-management-chapter" icon="eye" onClick={this.toggleSectionHiddenStatus.bind(this, section)}/>
              </Dropdown>
            </div>
          : null}
          <div className="content-panel__chapter-title-text">{section.title}</div>
        </h2>
        {sectionSpecificContentData}
        {lastManagementOptionsWithinSectionItem}
       </section>);
     });

    return <ContentPanel onOpenNavigation={this.onOpenNavigation} modifier="materials" navigation={this.props.navigation} title={this.props.i18n.text.get("plugin.workspace.materials.pageTitle")} ref="content-panel">
      {results}
      {emptyMessage}
      {createSectionElementWhenEmpty}
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
    workspaceEditMode: state.workspaces.editMode,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({setWorkspaceMaterialEditorState, createWorkspaceMaterialContentNode, updateWorkspaceMaterialContentNode}, dispatch);
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
    null,
    { withRef: true }
)(WorkspaceMaterials);