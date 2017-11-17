import * as React from "react";

export default class BodyScrollLoader<T, S> extends React.Component<T, S> {
  public statePropertyLocation:string;
  public hasMorePropertyLocation:string;
  public loadMoreTriggerFunctionLocation:string;
  public cancellingLoadingPropertyLocation: string;
  constructor(props: T){
    super(props);
    
    this.checkCanLoadMore = this.checkCanLoadMore.bind(this);
  }
  checkCanLoadMore(){
    if (this.cancellingLoadingPropertyLocation && (this.props as any)[this.cancellingLoadingPropertyLocation]){
      return;
    }
    if ((this.props as any)[this.statePropertyLocation] as string === "READY" &&
        (this.props as any)[this.hasMorePropertyLocation] as boolean){
      let scrollBottomRemaining = (document.body.scrollHeight || document.documentElement.scrollHeight) -
        ((document.body.scrollTop || document.documentElement.scrollTop) +
         (document.body.offsetHeight || document.documentElement.offsetHeight))
      if (scrollBottomRemaining <= 100){
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
      let doesNotHaveScrollBar = (document.body.scrollHeight || document.documentElement.scrollHeight) === 
        (document.body.offsetHeight || document.documentElement.offsetHeight);
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
    window.addEventListener("scroll", this.onScroll);
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.onScroll);
  }
}