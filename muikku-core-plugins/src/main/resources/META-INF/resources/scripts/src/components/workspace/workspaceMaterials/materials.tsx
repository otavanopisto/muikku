import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceType, MaterialContentNodeListType, MaterialContentNodeType } from "~/reducers/workspaces";
import ProgressData from '../progressData';

import ApplicationPanel from '~/components/general/application-panel';
import MaterialLoader from "~/components/base/material-loader";
import { StatusType } from "~/reducers/base/status";

interface WorkspaceMaterialsProps {
  i18n: i18nType,
  workspace: WorkspaceType,
  materials: MaterialContentNodeListType,
  aside: React.ReactElement<any>,
  activeNodeId: number,
  status: StatusType
}

interface WorkspaceMaterialsState {
  loadedChapters: {
    [key: number]: boolean
  }
}

const DEFAULT_EMPTY_HEIGHT = 600;
const DEFAULT_OFFSET = 67;

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < window.innerHeight && elemBottom >= 0;
  return isVisible;
}

class WorkspaceMaterials extends React.Component<WorkspaceMaterialsProps, WorkspaceMaterialsState> {
  private previousPassChanged: boolean;
  private previousPassOffsetTop: number;
  private previousPassTarget: string;
  private previousPassLoadedContentOnTop: boolean;
  private disableHashRecalculation: boolean;
  private lastHashWasSetByScroll: boolean;
private flattenedMaterial: MaterialContentNodeListType;
  constructor(props: WorkspaceMaterialsProps){
    super(props);
    
    this.state = {
      loadedChapters: {}
    }
    
    this.recalculateLoaded = this.recalculateLoaded.bind(this);
    this.recalculateHash = this.recalculateHash.bind(this);
    this.onScroll = this.onScroll.bind(this);
    
    this.getFlattenedMaterials(props);
    
    this.disableHashRecalculation = true;
    this.lastHashWasSetByScroll = false;
  }
  componentDidMount(){
    if (this.props.activeNodeId){
      document.getElementById(this.props.activeNodeId + "").scrollIntoView(true);
    }
    this.recalculateLoaded(this.props, null);
    window.document.addEventListener("scroll", this.onScroll);
    window.addEventListener("beforeunload", this.cancelScrollTop);
  }
  componentWillUnmount(){
    this.disableHashRecalculation = true;
    window.document.removeEventListener("scroll", this.onScroll);
    window.removeEventListener("beforeunload", this.cancelScrollTop);
  }
  cancelScrollTop(){
    window.scrollTo(0, 0);
  }
  componentWillReceiveProps(nextProps: WorkspaceMaterialsProps){
    if (this.props.materials !== nextProps.materials){
      this.getFlattenedMaterials(nextProps);
    }
  }
  componentDidUpdate(prevProps: WorkspaceMaterialsProps, prevState: WorkspaceMaterialsState){
    console.log("component did update");
    if (this.props.activeNodeId !== prevProps.activeNodeId){
      if (!this.lastHashWasSetByScroll){
        document.getElementById(this.props.activeNodeId + "").scrollIntoView(true);
      }
      this.recalculateLoaded(this.props, prevProps.activeNodeId);
      this.lastHashWasSetByScroll = false;
    } else if (this.previousPassChanged && this.previousPassLoadedContentOnTop) {
      document.getElementById(this.previousPassTarget).scrollIntoView(true);
      window.scrollBy(0, -this.previousPassOffsetTop);
      document.body.style.overflow = "";
      this.disableHashRecalculation = false;
    }
  }
  onScroll(){
    console.log("SCROLL EVENT");
    
    this.recalculateLoaded(this.props, this.props.activeNodeId);
    this.recalculateHash();
  }
  recalculateHash(){
    if (this.disableHashRecalculation){
      return;
    }
    let winner:number = null;
    let isAllTheWayToTheBottom = document.documentElement.scrollHeight - document.documentElement.scrollTop === document.documentElement.clientHeight;
    if (!isAllTheWayToTheBottom){
      let winnerTop:number = null;
      for (let refKey of Object.keys(this.refs)){
        let refKeyInt = parseInt(refKey);
        if (!refKeyInt){
          continue;
        }
        let element = this.refs[refKey] as HTMLElement;
        let elementTop = element.getBoundingClientRect().top;
        if (elementTop <= DEFAULT_OFFSET && (elementTop > winnerTop || !winner)){
          winner = refKeyInt;
          winnerTop = elementTop;
        }
      }
    } else {
      winner = this.flattenedMaterial[this.flattenedMaterial.length - 1].workspaceMaterialId;
    }
    
    winner = winner || this.flattenedMaterial[0].workspaceMaterialId;
    
    let newHash = ""
    if (winner !== this.flattenedMaterial[0].workspaceMaterialId){
      newHash = "#" + winner;
    }
    
    if (newHash !== location.hash){
      this.lastHashWasSetByScroll = true;
      location.hash = newHash;
    }
  }
  getChapter(id: number, props: WorkspaceMaterialsProps = this.props){
    let index = props.materials.findIndex(m1=>{
      return !!m1.children.find((m)=>m.workspaceMaterialId === id);
    });
    let chapter = props.materials[index] || null;
    return {index, chapter};
  }
  recalculateLoaded(props: WorkspaceMaterialsProps = this.props, prevActiveNodeId: number){
    this.previousPassChanged = false;
    if (!props.activeNodeId){
      return;
    }
    
    let newLoadedChapters = {...this.state.loadedChapters};
    let clearLoadedChapters:Array<{
      index: number,
      chapter: MaterialContentNodeType
    }> = [];
    Object.keys(this.refs).forEach((refKey:string)=>{
      if (isScrolledIntoView(this.refs[refKey] as HTMLElement)){
        let chapter = this.getChapter(parseInt(refKey), props);
        if (chapter.chapter){
          newLoadedChapters[chapter.chapter.workspaceMaterialId] = true;
          clearLoadedChapters.push(chapter);
        }
      }
    });
    let activeNodeChapter = this.getChapter(props.activeNodeId, props);
    if (activeNodeChapter.chapter){
      newLoadedChapters[activeNodeChapter.chapter.workspaceMaterialId] = true;
      clearLoadedChapters.push(activeNodeChapter);
    }
    
    if (JSON.stringify(newLoadedChapters) !== JSON.stringify(this.state.loadedChapters)){
      this.previousPassLoadedContentOnTop = false;
      this.disableHashRecalculation = false;
      
      if (prevActiveNodeId){
        let chapter = this.getChapter(prevActiveNodeId, props);
        let minNewChapter = clearLoadedChapters.length >= 2 ? clearLoadedChapters.reduce((m1, m2)=>{
          if (m1.index > m2.index){
            return m2;
          }
          return m1;
        }) : clearLoadedChapters[0];
        if (chapter.chapter && chapter.index > minNewChapter.index){
          this.previousPassLoadedContentOnTop = true;
          this.disableHashRecalculation = true;
          
          this.previousPassTarget = prevActiveNodeId + "";
          this.previousPassOffsetTop = document.getElementById(this.previousPassTarget).getBoundingClientRect().top;
          
          document.body.style.overflow = "hidden";
        }
      }
      
      this.previousPassChanged = true;
      
      this.setState({
        loadedChapters: newLoadedChapters
      });
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
  render(){
    if (!this.props.workspace || !this.props.materials){
      return null;
    }
    
    console.log("RENDERED WITH DATA");
    
    return <div>{this.props.materials.map((node)=>{
    return <section key={node.workspaceMaterialId}>
    <h1>{node.title}</h1>
    <div>
      {node.children.map((subnode)=>{
        let anchor = <div id={"" + subnode.workspaceMaterialId} style={{border: "solid 1px", transform: "translateY(" + (-DEFAULT_OFFSET) + "px)"}}/>;
        
        if (this.state.loadedChapters[node.workspaceMaterialId]){
          return <div style={{border: "solid 1px red"}} ref={subnode.workspaceMaterialId + ""} key={subnode.workspaceMaterialId} data-id={subnode.workspaceMaterialId}>
            {anchor}
            <MaterialLoader material={subnode} workspace={this.props.workspace}
              i18n={this.props.i18n} status={this.props.status} />
          </div>
        }
        return <div key={subnode.workspaceMaterialId} style={{height: DEFAULT_EMPTY_HEIGHT}}
          ref={subnode.workspaceMaterialId + ""}>{anchor}{subnode.workspaceMaterialId}</div>
      })}
    </div>
  </section>
  })
}</div>
    
    //<ProgressData i18n={this.props.i18n} activity={this.props.workspace.studentActivity}/>
//    return <ApplicationPanel ref="application-panel" modifier="materials"
//      toolbar={<div><h2>{this.props.workspace.name}</h2></div>}
//      asideAfter={this.props.aside}>
//        {this.props.materials.map((node)=>{
//          return <section key={node.workspaceMaterialId}>
//            <h1>{node.title}</h1>
//            <div>
//              {node.children.map((subnode)=>{
//                if (this.state.loadedMaterialIds[subnode.workspaceMaterialId]){
//                  return <div style={{border: "solid 1px red", height: DEFAULT_EMPTY_HEIGHT}} ref={subnode.workspaceMaterialId + ""} key={subnode.workspaceMaterialId} data-id={subnode.workspaceMaterialId}>
//                    <MaterialLoader material={subnode} workspace={this.props.workspace}
//                      i18n={this.props.i18n} status={this.props.status} />
//                  </div>
//                }
//                return <div key={subnode.workspaceMaterialId} data-id={subnode.workspaceMaterialId + ""} style={{height: DEFAULT_EMPTY_HEIGHT}}
//                  ref={subnode.workspaceMaterialId + ""}>{subnode.workspaceMaterialId}</div>
//              })}
//            </div>
//          </section>
//          })
//        }
//    </ApplicationPanel>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    materials: state.workspaces.currentMaterials,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    status: state.status
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
)(WorkspaceMaterials);