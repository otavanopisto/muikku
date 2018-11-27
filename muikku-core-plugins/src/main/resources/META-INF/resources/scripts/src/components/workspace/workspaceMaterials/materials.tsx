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
    [key: number]: {
      isAnimating: boolean,
      height: number
    }
  }
}

const DEFAULT_EMPTY_HEIGHT = 200;
const DEFAULT_OFFSET = 67;

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < window.innerHeight && elemBottom >= 0;
  return isVisible;
}

class WorkspaceMaterials extends React.Component<WorkspaceMaterialsProps, WorkspaceMaterialsState> {
  private disableHashRecalculation: boolean;
  private disableLoadedRecalculation: boolean;
  private flattenedMaterial: MaterialContentNodeListType;
  constructor(props: WorkspaceMaterialsProps){
    super(props);
    
    this.state = {
      loadedChapters: {}
    }
    
    this.recalculateLoaded = this.recalculateLoaded.bind(this);
    this.recalculateHash = this.recalculateHash.bind(this);
    this.onScroll = this.onScroll.bind(this);
    
    this.disableHashRecalculation = true;
    
    this.getFlattenedMaterials(props);
  }
  componentDidMount(){
    if (this.props.activeNodeId){
      (this.refs[this.props.activeNodeId] as HTMLElement).scrollIntoView(true);
      setTimeout(()=>{
        this.disableHashRecalculation = false;
      }, 100);
    }
    this.recalculateLoaded();
    window.document.addEventListener("scroll", this.onScroll);
  }
  componentWillUnmount(){
    this.disableHashRecalculation = true;
    window.document.removeEventListener("scroll", this.onScroll);
  }
  componentWillReceiveProps(nextProps: WorkspaceMaterialsProps){
    if (this.props.materials !== nextProps.materials){
      this.getFlattenedMaterials(nextProps);
    }
  }
  componentDidUpdate(prevProps: WorkspaceMaterialsProps, prevState: WorkspaceMaterialsState){
    console.log("component did update");
    if (this.props.activeNodeId !== prevProps.activeNodeId){
      let onActiveLoad = null;
      if (this.props.activeNodeId !== this.getActive()){
        let activeNodeChapter = this.getChapter(this.props.activeNodeId);
        let trigger = ()=>{
          //Only way to force trigger the event when the scrolling is so buggy
          //Do it as many times as possible with timeouts in order to trick the browser
          //to actually scroll there
          (this.refs[this.props.activeNodeId] as HTMLElement).scrollIntoView(true);
          setTimeout(()=>{
            (this.refs[this.props.activeNodeId] as HTMLElement).scrollIntoView(true);
            setTimeout(()=>{
              (this.refs[this.props.activeNodeId] as HTMLElement).scrollIntoView(true);
              setTimeout(()=>{
                this.disableHashRecalculation = false;
                this.disableLoadedRecalculation = false;
              }, 100);
            }, 100);
          }, 100);
        };
        if (!this.state.loadedChapters[activeNodeChapter.chapter.workspaceMaterialId]){
          onActiveLoad = trigger;
        } else {
          this.disableHashRecalculation = true;
          this.disableLoadedRecalculation = true;
          trigger();
        }
      } else {
        this.disableHashRecalculation = false;
      }
      
      if (onActiveLoad){
        this.disableHashRecalculation = true;
        console.log("loading using onactiveload");
        this.recalculateLoaded(true, onActiveLoad);
      } else {
        console.log("loading using default");
        this.recalculateLoaded();
      }
    }
  }
  animate(chapter: number){
    setTimeout(()=>{
      let newLoadedChapters = {...this.state.loadedChapters};
      let divElement:Element = document.querySelector("#section-" + chapter);
      let endHeight = 0;
      Array.from(divElement.childNodes).forEach((child)=>{
        if (child.nodeType === 0){
          endHeight += (child as HTMLElement).offsetHeight;
        }
      });
      newLoadedChapters[chapter] = {
        isAnimating: true,
        height: endHeight
      };
      
      this.setState({
        loadedChapters: newLoadedChapters
      });
      
      setTimeout(()=>{
        let newLoadedChapters2 = {...this.state.loadedChapters};
        newLoadedChapters2[chapter] = {
          isAnimating: false,
          height: null
        };
        
        this.setState({
          loadedChapters: newLoadedChapters2
        });
      }, 300);
    }, 50);
  }
  onScroll(){
    console.log("SCROLL EVENT");
    
    this.recalculateLoaded();
    this.recalculateHash();
  }
  getActive(){
    let winner:number = null;
    //TODO fix this to be relative because buggy scrolling doesn't give the truthful value
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
    return winner;
  }
  recalculateHash(){
    if (this.disableHashRecalculation){
      return;
    }
    
    let active = this.getActive();
    
    let newHash = ""
    if (active !== this.flattenedMaterial[0].workspaceMaterialId){
      newHash = "#" + active;
    }
    
    if (newHash !== location.hash){
      location.hash = newHash;
    }
  }
  getChapter(id: number){
    let index = this.props.materials.findIndex(m1=>{
      return !!m1.children.find((m)=>m.workspaceMaterialId === id);
    });
    let chapter = this.props.materials[index] || null;
    let size = this.props.materials[index].children.length;
    return {index, chapter, size};
  }
  recalculateLoaded(dontAnimate?: boolean, onDone?: ()=>any){
    if (!this.props.activeNodeId || this.disableLoadedRecalculation){
      return;
    }
    
    let newLoadedChapters = {...this.state.loadedChapters};
    Object.keys(this.refs).forEach((refKey:string)=>{
      if (isScrolledIntoView(this.refs[refKey] as HTMLElement)){
        let chapter = this.getChapter(parseInt(refKey));
        if (chapter.chapter && !newLoadedChapters[chapter.chapter.workspaceMaterialId]){
          newLoadedChapters[chapter.chapter.workspaceMaterialId] = {
            isAnimating: !dontAnimate,
            height: dontAnimate ? null : chapter.size * DEFAULT_EMPTY_HEIGHT
          };
          if (!dontAnimate){
            this.animate(chapter.chapter.workspaceMaterialId);
          }
        }
      }
    });
    let activeNodeChapter = this.getChapter(this.props.activeNodeId);
    if (activeNodeChapter.chapter && !newLoadedChapters[activeNodeChapter.chapter.workspaceMaterialId]){
      newLoadedChapters[activeNodeChapter.chapter.workspaceMaterialId] = {
        isAnimating: !dontAnimate,
        height: dontAnimate ? null : activeNodeChapter.size * DEFAULT_EMPTY_HEIGHT
      };
      if (!dontAnimate){
        this.animate(activeNodeChapter.chapter.workspaceMaterialId);
      }
    }
    
    if (JSON.stringify(newLoadedChapters) !== JSON.stringify(this.state.loadedChapters)){
      this.setState({
        loadedChapters: newLoadedChapters
      }, ()=>{
        onDone && onDone();
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
    if (!this.props.materials){
      return null;
    }
    
    //console.log("RENDERED WITH DATA");
    
    return <div style={{paddingTop: DEFAULT_OFFSET}}>{this.props.materials.map((node)=>{
    return <section key={node.workspaceMaterialId} id={"section-" + node.workspaceMaterialId} style={{
      height: this.state.loadedChapters[node.workspaceMaterialId] ?
      this.state.loadedChapters[node.workspaceMaterialId].height : node.children.length*DEFAULT_EMPTY_HEIGHT,
      transition: "height 3s ease"
    }}>
    <h1>{node.title}</h1>
    <div>
      {node.children.map((subnode)=>{
        let anchor = <div id={"anchor-" + subnode.workspaceMaterialId} style={{border: "solid 1px", transform: "translateY(" + (-DEFAULT_OFFSET) + "px)"}}/>;
        let material = !this.props.workspace ? null : <MaterialLoader material={subnode} workspace={this.props.workspace}
          i18n={this.props.i18n} status={this.props.status} />;
        if (this.state.loadedChapters[node.workspaceMaterialId]){
          return <div style={{border: "solid 1px red"}} ref={subnode.workspaceMaterialId + ""}
            key={subnode.workspaceMaterialId}>
            {anchor}
            {material}
          </div>
        }
        return <div key={subnode.workspaceMaterialId} style={{border: "solid 1px green", height: DEFAULT_EMPTY_HEIGHT}}
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