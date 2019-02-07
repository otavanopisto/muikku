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

interface WorkspaceMaterialsProps {
  i18n: i18nType,
  workspace: WorkspaceType,
  materials: MaterialContentNodeListType,
  materialReplies: MaterialCompositeRepliesListType,
  navigation: React.ReactElement<any>,
  activeNodeId: number,
  status: StatusType,
  onActiveNodeIdChange: (activeNodeId: number)=>any,
  onOpenNavigation: ()=>any
}

interface WorkspaceMaterialsState {
  loadedChapters: {
    [key: number]: {
      isExpanding: boolean,
      height: number
    }
  },
  defaultOffset: number
}

const DEFAULT_EMPTY_HEIGHT = 200;
const DEFAULT_OFFSET = 67;

function isScrolledIntoView(el: HTMLElement) {
  let rect = el.getBoundingClientRect();
  let elemTop = rect.top;
  let elemBottom = rect.bottom;

  let isVisible = elemTop < window.innerHeight && elemBottom >= (document.querySelector("#stick") as HTMLElement).offsetHeight;
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
    this.onOpenNavigation = this.onOpenNavigation.bind(this);
    
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
    } else if (this.props.activeNodeId !== nextProps.activeNodeId){
      this.refs["content-panel"] && (this.refs["content-panel"] as ContentPanel).close();
    }
  }
  
  //The please scroll into view basically begs the browser to scroll to the place where it should scroll
  //takes the element it wants to scroll to and a callback for when it is done
  pleaseScrollIntoView(elementOrPosition:Element | number = this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll,
      cb:()=>any = this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollCallback){
    //So we set the element or position we want to scroll to in a variable
    this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll = elementOrPosition;
    //we set the callback for when it's done
    this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollCallback = cb;
    //we set 300ms working time, we expect to scroll to that area
    this.restorePleaseScrollIntoViewTimer();
    
    //so we call the scroll
    if (elementOrPosition instanceof Element){
      elementOrPosition.scrollIntoView(true);
    } else {
      document.documentElement.scrollTo(0, elementOrPosition);
    }
  }
  
  //restores the timer for the scroll into view
  restorePleaseScrollIntoViewTimer(){
    clearTimeout(this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollTimeout);
    this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollTimeout = setTimeout(()=>{
      //when the timeout is done we remove the element or position and call the callback
      this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll = null;
      this.hackToMakeBrowserListenAndScrollWhereIWantItToScrollCallback();
    }, 300);
  }
  componentDidUpdate(prevProps: WorkspaceMaterialsProps, prevState: WorkspaceMaterialsState){
    //so this only matters if the new active is not the same as the previous active
    if (this.props.activeNodeId !== prevProps.activeNodeId){
      
      //we set an on active load function that will trigger once the new active is loaded
      //if necessary
      let onActiveLoad = null;
      
      //we get the chapter
      let activeNodeChapter = this.getChapter(this.props.activeNodeId);
      let isChapterLoaded = this.state.loadedChapters[activeNodeChapter.chapter.workspaceMaterialId];
      
      //if the active node is not the actual real active, or if the chapter itself is not loaded
      if (this.props.activeNodeId !== this.getActive() || !isChapterLoaded){
        
        //we diable the scroll interaction as there might be stuttering while all this happens
        this.disableScrollInteraction = true;
        
        //this function is what triggers once the chapter is loaded
        let trigger = ()=>{
          //this triggers once the loaded chapter is scrolled
          let onHasScrolled = ()=>{
            //we basically reenable the scroll interaction
            this.disableScrollInteraction = false;
            if (!isChapterLoaded){
              //And recalculate loaded just in case there are holes
              this.recalculateLoaded();
            }
          };
          
          let isFirstNode = this.props.materials[0].children[0].workspaceMaterialId === this.props.activeNodeId;
          //scroll is there already, eg in the first node and the scroll is all the way to the top
          if (isFirstNode && document.documentElement.scrollTop === 0){
            onHasScrolled();
            return;
          } else if (isFirstNode){
            //the scroll might not be all the way to the top when the first chapter is in 
            this.pleaseScrollIntoView(0, onHasScrolled);
            return;
          }
          
          //we beg the browser to scroll into the element that represents the active node id
          let element = document.querySelector("#p-" + this.props.activeNodeId);
          this.pleaseScrollIntoView(element, onHasScrolled);
        };
        
        //if the chapter is not loaded
        //then set the trigger as a callback
        if (!isChapterLoaded){
          onActiveLoad = trigger;
        } else {
          //otherwise trigger right away
          //this will be what will happen if the recalculate hash
          //is the one that preloads
          trigger();
        }
      } else {
        this.disableScrollInteraction = false;
      }
      
      if (onActiveLoad){
        //if we have an on active loade we disable scroll interaction
        //and recalculate loaded with a callback,
        //disabling animation and only loading the active
        this.disableScrollInteraction = true;
        this.recalculateLoaded(true, onActiveLoad, true);
      } else {
        //otherwise we just recalculate loaded
        this.recalculateLoaded();
      }
    }
  }
  onScroll(){
    //Now the scroll event might be called by these synthethic random
    //events that the browser triggers for no reason at all
    //if the hack is enabled and it hasn't been disabled
    if (this.hackToMakeBrowserListenAndScrollWhereIWantItToScroll){
      //basically we tell it to scroll again and restore its timer
      //forcing it to scroll all over again
      //it will keep its callback
      this.pleaseScrollIntoView();
      return;
    }
    
    //If the scroll interaction is diabled (note how it does not affect scroll into view)
    //then we don't run anything
    if (this.disableScrollInteraction){
      return;
    }
    
    //We recalculate the loaded
    //allowing animation
    //and once that is done we recalculate the hash
    this.recalculateLoaded(false, ()=>{
      this.recalculateHash();
    });
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
        let element = this.refs[refKey] as HTMLElement;
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
  recalculateHash(){
    //console.log("recalculating hash");
    
    //we get the currently active element as defined by the rules
    let active = this.getActive();
    
    //we set new active hash if it's necessary
    let newActive:number = null;
    let newHash = "";
    if (active !== this.flattenedMaterial[0].workspaceMaterialId){
      newActive = active;
      newHash = active + "";
    }
    
    //if we get a new hash that is not the same as the current hash
    if (newHash !== location.hash.replace("#","").replace("p-","")){
      //console.log("active node changed");
      
      //we get the chapter for that new active
      let newActiveChapter = this.getChapter(newActive || this.flattenedMaterial[0].workspaceMaterialId);
      
      //if it's not loaded
      if (!this.state.loadedChapters[newActiveChapter.chapter.workspaceMaterialId]){
        //console.log("couldn't find the chapter");
        
        //we recalculate the loaded
        //allowing animation
        //and only loading the active chapter
        //we override the active chapter to be the chapter that we just got as
        //the new active since the state is still stuck to the previous active
        this.recalculateLoaded(false, ()=>{
          //console.log("now it has been updated, chaging active");
          //After that is done we call the callback for the active node id change
          //this will end up triggering a change on the prop of the activeNodeId
          //but we will be ready for that then
          this.props.onActiveNodeIdChange(newActive);
        }, true, newActiveChapter);
      } else {
        //console.log("the chapter exists");
        //if the chapter then we just trigger the active node id change
        this.props.onActiveNodeIdChange(newActive);
      }
    }
  }
  getChapter(id: number){
    //get a chapter by the number of a node id
    //it just does a search and returns relevant data
    let index = this.props.materials.findIndex(m1=>{
      return !!m1.children.find((m)=>m.workspaceMaterialId === id);
    });
    let chapter = this.props.materials[index] || null;
    let size = this.props.materials[index].children.length;
    return {index, chapter, size};
  }
  expand(chapterIds: Array<number>){
    if (!chapterIds.length){
      return;
    }
    
    let currentNode:HTMLAnchorElement = document.querySelector("#p-" + this.props.activeNodeId) as HTMLAnchorElement;
    let currentNodeDistanceToScreenTop = currentNode.getBoundingClientRect().top;
    
    let oldDisableScrollInteraction = this.disableScrollInteraction;
    this.disableScrollInteraction = true;
    
    let newLoadedChapters = {...this.state.loadedChapters}
    chapterIds.forEach(id=>{
      newLoadedChapters[id] = {
        isExpanding: false,
        height: null
      }
    });
    
    this.setState({
      loadedChapters: newLoadedChapters
    }, ()=>{
      let newDistanceCurrentNodeToScreenTop = currentNode.getBoundingClientRect().top;
      let difference = newDistanceCurrentNodeToScreenTop - currentNodeDistanceToScreenTop;
      let newScrollTop = document.documentElement.scrollTop + difference;
      document.documentElement.scrollTo(0, newScrollTop);
      this.disableScrollInteraction = oldDisableScrollInteraction;
    });
  }
  recalculateLoaded(dontWaitForExpand?: boolean, onDone?: ()=>any, onlyActive?:boolean, activeNodeChapterDefault?: any){
    //if we don't have a active node id then cancel this
    if (!this.props.activeNodeId){
      return;
    }
    
    //console.log("recalculate loaded", dontWaitForExpand, onDone, onlyActive);
    
    //so we need to check which will be the new loaded chapters
    let newLoadedChapters = {...this.state.loadedChapters};
    let expandElements:Array<number> = [];
    
    //if its not only the active loaded we need to check all the chapters that
    //are into view as of the moment that this function is running
    if (!onlyActive){
      Object.keys(this.refs).forEach((refKey:string)=>{
        
        //We check that an int is available, we might have odd refs
        let refKeyInt = parseInt(refKey);
        if (!refKeyInt){
          return;
        }
        
        //we check that it's scrolled into view
        if (isScrolledIntoView(this.refs[refKey] as HTMLElement)){
          //we get the chapter of that element
          let chapter = this.getChapter(refKeyInt);
          
          //if we get a chapter for it and itäs not loaded
          if (chapter.chapter && !newLoadedChapters[chapter.chapter.workspaceMaterialId]){
            
            //We set it to load
            newLoadedChapters[chapter.chapter.workspaceMaterialId] = {
              isExpanding: !dontWaitForExpand,
              height: dontWaitForExpand ? null : chapter.size * DEFAULT_EMPTY_HEIGHT
            };
            
            //we check if we are allowed to expand and call the function for that
            if (!dontWaitForExpand){
              expandElements.push(chapter.chapter.workspaceMaterialId);
            }
          }
        }
      });
    }
    
    //We do the same we did before but with the active node chapter, whether the provided one
    //or the active chapter as defined
    let activeNodeChapter = activeNodeChapterDefault || this.getChapter(this.props.activeNodeId);
    if (activeNodeChapter.chapter && !newLoadedChapters[activeNodeChapter.chapter.workspaceMaterialId]){
      newLoadedChapters[activeNodeChapter.chapter.workspaceMaterialId] = {
        isExpanding: !dontWaitForExpand,
        height: dontWaitForExpand ? null : activeNodeChapter.size * DEFAULT_EMPTY_HEIGHT
      };
      if (!dontWaitForExpand){
        expandElements.push(activeNodeChapter.chapter.workspaceMaterialId);
      }
    }
    
    //If we actually get something new
    if (!equals(newLoadedChapters, this.state.loadedChapters)){
      
      //console.log("recalculate loaded, got new");
      
      //Then we update the UI and then call the callback
      this.setState({
        loadedChapters: newLoadedChapters
      }, ()=>{
        this.expand(expandElements);
        onDone && onDone();
      });
    } else {
      //Otherwise we call the callback immediately
      this.expand(expandElements);
      onDone && onDone();
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
  render(){
    if (!this.props.materials || !this.props.workspace){
      return null;
    }
    
    return <ContentPanel onOpen={this.onOpenNavigation} modifier="materials" navigation={this.props.navigation}
      title={this.props.workspace.name} ref="content-panel">
      {!this.props.materials.length ? this.props.i18n.text.get("!TODOERRMSG no material information") : null}
      {this.props.materials.map((chapter)=>{
        return <section key={chapter.workspaceMaterialId} id={"section-" + chapter.workspaceMaterialId} style={{
          height: this.state.loadedChapters[chapter.workspaceMaterialId] ?
            this.state.loadedChapters[chapter.workspaceMaterialId].height : chapter.children.length*DEFAULT_EMPTY_HEIGHT,
          overflow: "hidden"
        }}>
          <h1>{chapter.title}</h1>
          <div>
            {chapter.children.map((node)=>{
              let anchor = <div id={"p-" + node.workspaceMaterialId} style={{transform: "translateY(" + (-this.state.defaultOffset) + "px)"}}/>;
              if (this.state.loadedChapters[chapter.workspaceMaterialId]){
                let compositeReplies = this.props.workspace && this.props.materialReplies && this.props.materialReplies.find((reply)=>reply.workspaceMaterialId === node.workspaceMaterialId);
                let material = !this.props.workspace || !this.props.materialReplies  ? null : <ContentPanelItem>
                  <WorkspaceMaterial materialContentNode={node} workspace={this.props.workspace} compositeReplies={compositeReplies}/>
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
    materialReplies: state.workspaces.currentMaterialsReplies,
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