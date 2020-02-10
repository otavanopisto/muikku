import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceType, MaterialContentNodeListType, MaterialContentNodeType, MaterialCompositeRepliesListType, WorkspaceEditModeStateType } from "~/reducers/workspaces";

import ContentPanel, { ContentPanelItem } from '~/components/general/content-panel';
import equals = require("deep-equal");

import HelpMaterialPage from "./help-material-page";
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import { bindActionCreators } from "redux";
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType,
  createWorkspaceMaterialContentNode, CreateWorkspaceMaterialContentNodeTriggerType } from "~/actions/workspaces";

interface HelpProps {
  i18n: i18nType,
  workspace: WorkspaceType,
  materials: MaterialContentNodeListType,
  navigation: React.ReactElement<any>,
  activeNodeId: number,
  workspaceEditMode: WorkspaceEditModeStateType,
  onActiveNodeIdChange: (activeNodeId: number)=>any,
  onOpenNavigation: ()=>any,

  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  createWorkspaceMaterialContentNode: CreateWorkspaceMaterialContentNodeTriggerType,
}

interface HelpState {
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

class Help extends React.Component<HelpProps, HelpState> {
  constructor(props: HelpProps){
    super(props);

    this.state = {
      defaultOffset: DEFAULT_OFFSET
    }

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.createPage = this.createPage.bind(this);
    this.pastePage = this.pastePage.bind(this);
    this.createPageFromBinary = this.createPageFromBinary.bind(this);
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
  getMaterialsOptionListDropdown(nextSibling: MaterialContentNodeType) {
    const materialManagementItemsOptions: Array<any> = [
      {
        icon: "plus",
        text: 'plugin.workspace.materialsManagement.createPageTooltip',
        onClick: this.createPage.bind(this, nextSibling),
        file: false,
      },
      {
        icon: "paste",
        text: 'plugin.workspace.materialsManagement.pastePageTooltip',
        onClick: this.pastePage.bind(this, nextSibling),
        file: false,
      },
      {
        icon: "attachment",
        text: 'plugin.workspace.materialsManagement.attachFileTooltip',
        onChange: this.createPageFromBinary.bind(this, nextSibling),
        file: true,
      }
    ]

    return materialManagementItemsOptions;
  }
  createPage(nextSibling: MaterialContentNodeType) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      rootParentId: this.props.workspace.details.helpFolderId,
      nextSibling,
      title: this.props.i18n.text.get("plugin.workspace.materialsManagement.newPageTitle"),
      makeFolder: false,
    });
  }
  createPageFromBinary(
      nextSibling: MaterialContentNodeType,
      e: React.ChangeEvent<HTMLInputElement>
  ) {
    this.props.createWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      nextSibling,
      rootParentId: this.props.workspace.details.helpFolderId,
      title: e.target.files[0].name,
      file: e.target.files[0],
      makeFolder: false,
    });
  }
  pastePage(nextSibling: MaterialContentNodeType) {
    const workspaceMaterialCopiedId = localStorage.getItem("workspace-material-copied-id") || null;
    const workspaceCopiedId = localStorage.getItem("workspace-copied-id") || null;

    if (workspaceMaterialCopiedId) {
      this.props.createWorkspaceMaterialContentNode({
        workspace: this.props.workspace,
        nextSibling,
        rootParentId: this.props.workspace.details.helpFolderId,
        copyMaterialId: parseInt(workspaceMaterialCopiedId),
        copyWorkspaceId: parseInt(workspaceCopiedId),
        makeFolder: false,
      })
    }
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
      winner = this.props.materials[this.props.materials.length - 1].workspaceMaterialId;
    }

    winner = winner || this.props.materials[0].workspaceMaterialId;
    return winner;
  }
  render(){
    if (!this.props.materials || !this.props.workspace){
      return null;
    }

    const isEditable = this.props.workspaceEditMode.active;

    const lastCreatePageElement = isEditable ? (
      <div className="material-admin-panel material-admin-panel--master-functions">
        <Dropdown modifier="material-management" items={this.getMaterialsOptionListDropdown(null).map((item)=>{
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

    const emptyMessage = this.props.materials.length === 0 ? (
      <div className="material-page material-page--empty">{this.props.i18n.text.get("plugin.workspace.helpPage.empty")}</div>
    ) : null;

    const results: any = [];
    this.props.materials.forEach((node, index)=>{
      // this is the next sibling for the content node that is to be added, aka the current
      const nextSibling = node;
      if (isEditable) {
        results.push(<div key={node.workspaceMaterialId + "-dropdown"} className="material-admin-panel material-admin-panel--master-functions">
          <Dropdown modifier="material-management" items={this.getMaterialsOptionListDropdown(nextSibling).map((item)=>{
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

      let material = !this.props.workspace ? null :
        <ContentPanelItem ref={node.workspaceMaterialId + ""} key={node.workspaceMaterialId + ""}>
          <div id={"p-" + node.workspaceMaterialId} style={{transform: "translateY(" + (-this.state.defaultOffset) + "px)"}}/>
          <HelpMaterialPage
            materialContentNode={node}
            workspace={this.props.workspace}
           />
        </ContentPanelItem>;

      if (node.hidden && !isEditable) {
        return;
      }

      results.push(material);
    });

    return <ContentPanel onOpenNavigation={this.onOpenNavigation} modifier="materials" navigation={this.props.navigation} title={this.props.i18n.text.get("plugin.workspace.helpPage.title")} ref="content-panel">
      {results}
      {emptyMessage}
      {lastCreatePageElement}
    </ContentPanel>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    materials: state.workspaces.currentHelp,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    workspaceEditMode: state.workspaces.editMode,
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
)(Help);