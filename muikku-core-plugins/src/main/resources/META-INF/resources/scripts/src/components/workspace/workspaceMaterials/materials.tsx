import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { WorkspaceType, MaterialContentNodeListType, MaterialContentNodeType } from "~/reducers/workspaces";

import ContentPanel, { ContentPanelItem } from '~/components/general/content-panel';
import MaterialLoader from "~/components/base/material-loader";
import { StatusType } from "~/reducers/base/status";

interface WorkspaceMaterialsProps {
  i18n: i18nType,
  workspace: WorkspaceType,
  materials: MaterialContentNodeListType,
  navigation: React.ReactElement<any>,
  activeNodeId: number,
  status: StatusType,
  onActiveNodeIdChange: (activeNodeId: number)=>any
}

interface WorkspaceMaterialsState {
  loadedChapters: {
    [key: number]: {
      isAnimating: boolean,
      height: number
    }
  },
  defaultOffset: number
}

const DEFAULT_EMPTY_HEIGHT = 200;
const DEFAULT_OFFSET = 67;
const ANIMATION_SECONDS = 3;

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < window.innerHeight && elemBottom >= ((document.querySelector("#stick") as HTMLElement).offsetHeight/2);
  return isVisible;
}

class WorkspaceMaterials extends React.Component<WorkspaceMaterialsProps, WorkspaceMaterialsState> {
  private disableScrollInteraction: boolean;
  private flattenedMaterial: MaterialContentNodeListType;
  private hackToMakeBrowserListenAndScrollWhereIWantItToScroll: Element | number;
  private hackToMakeBrowserListenAndScrollWhereIWantItToScrollTimeout: NodeJS.Timer;
  private hackToMakeBrowserListenAndScrollWhereIWantItToScrollCallback: ()=>any;
  constructor(props: WorkspaceMaterialsProps){
    super(props);
    
    this.state = {
      loadedChapters: {},
      defaultOffset: (document.querySelector("#stick") as HTMLElement || {} as any).offsetHeight || DEFAULT_OFFSET
    }
    
    this.recalculateLoaded = this.recalculateLoaded.bind(this);
    this.recalculateHash = this.recalculateHash.bind(this);
    this.onScroll = this.onScroll.bind(this);
    
    this.disableScrollInteraction = true;
    
    this.getFlattenedMaterials(props);
  }
  componentDidMount(){
    let defaultOffset = (document.querySelector("#stick") as HTMLElement || {} as any).offsetHeight || DEFAULT_OFFSET;
    if (defaultOffset !== this.state.defaultOffset){
      this.setState({
        defaultOffset
      })
    }
    if (this.props.activeNodeId){
      this.pleaseScrollIntoView(document.querySelector("#p-" + this.props.activeNodeId), ()=>{
        this.disableScrollInteraction = false;
      });
    }
    this.recalculateLoaded();
    window.document.addEventListener("scroll", this.onScroll);
    window.document.addEventListener("beforeunload", this.cancelScrollTop);
  }
  componentWillUnmount(){
    this.disableScrollInteraction = true;
    window.document.removeEventListener("scroll", this.onScroll);
    
    this.cancelScrollTop();
    window.document.removeEventListener("beforeunload", this.cancelScrollTop);
  }
  cancelScrollTop(){
    window.scrollTo(0, 0);
  }
  componentWillReceiveProps(nextProps: WorkspaceMaterialsProps){
    if (this.props.materials !== nextProps.materials){
      this.getFlattenedMaterials(nextProps);
    }
  }
  pleaseScrollIntoView(element:Element | number, cb:()=>any){
    this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll = element;
    this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollCallback = cb;
    this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollTimeout = setTimeout(()=>{
      this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll = null;
      this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollCallback();
    }, 300);
    if (element instanceof Element){
      element.scrollIntoView(true);
    } else {
      document.documentElement.scrollTo(0, element);
    }
  }
  componentDidUpdate(prevProps: WorkspaceMaterialsProps, prevState: WorkspaceMaterialsState){
    if (this.props.activeNodeId !== prevProps.activeNodeId){
      let onActiveLoad = null;
      let activeNodeChapter = this.getChapter(this.props.activeNodeId);
      let isChapterLoaded = this.state.loadedChapters[activeNodeChapter.chapter.workspaceMaterialId];
      if (this.props.activeNodeId !== this.getActive() || !isChapterLoaded){
        this.disableScrollInteraction = true;
        
        let trigger = ()=>{
          let onHasScrolled = ()=>{
            this.disableScrollInteraction = false;
            if (!isChapterLoaded){
              this.recalculateLoaded();
            }
          };
          
          //scroll is there already
          if (activeNodeChapter.index === 0 && document.documentElement.scrollTop === 0){
            onHasScrolled();
            return;
          } else if (activeNodeChapter.index === 0){
            this.pleaseScrollIntoView(0, onHasScrolled);
            return;
          }
          //Only way to force trigger the event when the scrolling is so buggy
          //Do it as many times as possible with timeouts in order to trick the browser
          //to actually scroll there
          let element = document.querySelector("#p-" + this.props.activeNodeId);
          this.pleaseScrollIntoView(element, onHasScrolled);
        };
        if (!isChapterLoaded){
          onActiveLoad = trigger;
        } else {
          trigger();
        }
      } else {
        this.disableScrollInteraction = false;
      }
      
      if (onActiveLoad){
        this.disableScrollInteraction = true;
        this.recalculateLoaded(true, onActiveLoad, true);
      } else {
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
        if (child.nodeType === 1){
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
      }, ANIMATION_SECONDS * 1000);
    }, 50);
  }
  onScroll(){
    if (this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll){
      if (this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll instanceof Element){
        this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll.scrollIntoView(true);
      } else {
        document.documentElement.scrollTo(0, this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll);
      }
      clearTimeout(this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollTimeout);
      this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollTimeout = setTimeout(()=>{
        this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll = null;
        this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollCallback();
      }, 300);
      return;
    }
    if (this.disableScrollInteraction){
      return;
    }
    
    this.recalculateLoaded();
    this.recalculateHash();
  }
  getActive(){
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
      if (elementTop <= this.state.defaultOffset && (elementTop > winnerTop || !winner)){
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
    let active = this.getActive();
    
    let newActive:number = null;
    let newHash = "";
    if (active !== this.flattenedMaterial[0].workspaceMaterialId){
      newActive = active;
      newHash = active + "";
    }
    
    if (newHash !== location.hash.replace("#","").replace("p-","")){
      this.props.onActiveNodeIdChange(newActive);
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
  recalculateLoaded(dontAnimate?: boolean, onDone?: ()=>any, onlyActive?:boolean){
    if (!this.props.activeNodeId){
      return;
    }
    
    let newLoadedChapters = {...this.state.loadedChapters};
    
    if (!onlyActive){
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
    }
    
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
    
    //NOTE because of fancy loading and all this scrolling mess, the height that you set of the h1 chapter title should be at least
    //more than half the height of the navigation bar otherwise you'd get a bunch of scrolling bugs
    return <ContentPanel modifier="materials" navigation={this.props.navigation} title={this.props.workspace.name}>
      {this.props.materials.map((chapter)=>{
        return <section key={chapter.workspaceMaterialId} id={"section-" + chapter.workspaceMaterialId} style={{
          height: this.state.loadedChapters[chapter.workspaceMaterialId] ?
          this.state.loadedChapters[chapter.workspaceMaterialId].height : chapter.children.length*DEFAULT_EMPTY_HEIGHT,
          transition: "height " + ANIMATION_SECONDS + "s ease",
          overflow: "hidden"
        }}>
          {this.state.loadedChapters[chapter.workspaceMaterialId] ? <h1>{chapter.title}</h1> : null}
          <div>
            {chapter.children.map((node)=>{
              let anchor = <div id={"p-" + node.workspaceMaterialId} style={{transform: "translateY(" + (-this.state.defaultOffset) + "px)"}}/>;
              if (this.state.loadedChapters[chapter.workspaceMaterialId]){
                let material = !this.props.workspace ? null : <ContentPanelItem>
                  <MaterialLoader material={node} workspace={this.props.workspace}
                    i18n={this.props.i18n} status={this.props.status}/>
                </ContentPanelItem>;
                return <div ref={node.workspaceMaterialId + ""}
                  key={node.workspaceMaterialId}>
                  {anchor}
                  {material}
                </div>
              }
              return <div key={node.workspaceMaterialId} style={{height: DEFAULT_EMPTY_HEIGHT}}
                ref={node.workspaceMaterialId + ""}>{anchor}</div>
             })}
           </div>
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