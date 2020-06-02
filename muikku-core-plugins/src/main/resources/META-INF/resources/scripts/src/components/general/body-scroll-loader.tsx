import * as React from "react";

export default class BodyScrollLoader<T, S> extends React.Component<T, S> {
  public statePropertyLocation:string;
  public hasMorePropertyLocation:string;
  public loadMoreTriggerFunctionLocation:string;
  public cancellingLoadingPropertyLocation: string;
  private lastTimeCalledLoadMore: number;

  constructor(props: T){
    super(props);    
    this.lastTimeCalledLoadMore = 0;
    this.checkCanLoadMore = this.checkCanLoadMore.bind(this);
    this.onScroll = this.onScroll.bind(this);
  }
  checkCanLoadMore(){
    if (this.cancellingLoadingPropertyLocation && (this.props as any)[this.cancellingLoadingPropertyLocation]){
      return;
    }
    if ((this.props as any)[this.statePropertyLocation] as string === "READY" &&
        (this.props as any)[this.hasMorePropertyLocation] as boolean){
      
      let scrollBottomRemaining = document.documentElement.scrollHeight -
        ((document.body.scrollTop || document.documentElement.scrollTop) + document.documentElement.offsetHeight)
      if (scrollBottomRemaining <= 100){
        let currentlyCalled = (new Date()).getTime();
        if (currentlyCalled - this.lastTimeCalledLoadMore < 300){
          return;
        }
        this.lastTimeCalledLoadMore = currentlyCalled;
        (this.props as any)[this.loadMoreTriggerFunctionLocation]();
      }
    }
  }
  componentDidUpdate(){
    if (this.cancellingLoadingPropertyLocation && (this.props as any)[this.cancellingLoadingPropertyLocation]){
      return;
    }
    if ((this.props as any)[this.statePropertyLocation] as string === "READY" && 
        (this.props as any)[this.hasMorePropertyLocation] as boolean){
      let doesNotHaveScrollBar = document.documentElement.scrollHeight === document.documentElement.offsetHeight;
      if (doesNotHaveScrollBar){
        (this.props as any)[this.loadMoreTriggerFunctionLocation]();
      }
    }
    this.checkCanLoadMore();
  }
  onScroll(e: Event){
    this.checkCanLoadMore();
  }
  componentDidMount(){
    if (!(this.props as any)[this.loadMoreTriggerFunctionLocation]){
      throw new Error("Undefined loadMoreTriggerFunctionLocation at " + this.loadMoreTriggerFunctionLocation);
    }
    window.addEventListener("scroll", this.onScroll);
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.onScroll);
  }
}