import * as React from "react";

import '~/sass/elements/touch-pager.scss';

interface TouchPagerProps {
  children: any,
  prev?: any,
  next?: any,
  modifier?: string,
  hasNext: boolean,
  hasPrev: boolean,
  goForward: ()=>any,
  goBackwards: ()=>any
}

interface TouchPagerState {
  drag: number
}

export default class TouchPager extends React.Component<TouchPagerProps, TouchPagerState> {
  private initialXPos: number;
  private initialYPos: number;
  private closeInterval: NodeJS.Timer;

  constructor(props: TouchPagerProps){
    super(props);
    
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.initialXPos = null;
    this.initialYPos = null;
    this.closeInterval = null;
    
    this.state = {
      drag: 0
    }
  }
  onTouchStart(e: React.TouchEvent<any>){
    this.initialXPos = e.touches[0].pageX;
    this.initialYPos = e.touches[0].pageY;
    clearInterval(this.closeInterval);
  }
  onTouchMove(e: React.TouchEvent<any>){
    let diff = this.initialXPos - e.touches[0].pageX;
    if (!this.props.hasNext && diff > 0){
      diff = 0;
    } else if (!this.props.hasPrev && diff < 0){
      diff = 0;
    } else if ((this.refs["centerContainer"] as HTMLElement).offsetWidth < Math.abs(diff)){
      diff = Math.sign(diff)*(this.refs["centerContainer"] as HTMLElement).offsetWidth;
    }
    this.setState({
      drag: -diff
    });
  }
  onTouchEnd(e: React.TouchEvent<any>){
    let allDrag = Math.abs(this.state.drag);
    let totalDrag = (this.refs["centerContainer"] as HTMLElement).offsetWidth;
    let sign = Math.sign(this.state.drag);
    
    let closeToNext = allDrag >= totalDrag/3;
    this.closeInterval = setInterval(()=>{
      let absoluteDrag = Math.abs(this.state.drag);
      if (absoluteDrag === (closeToNext ? totalDrag : 0)){
        clearTimeout(this.closeInterval);
        if (closeToNext){
          if (sign === -1){
            this.props.goForward();
          } else {
            this.props.goBackwards();
          }
        }
        
      }
      let newValue = closeToNext ? (absoluteDrag + (absoluteDrag/10)) : (absoluteDrag - (allDrag/10));
      if (!closeToNext && newValue < 0){
        newValue = 0;
      } else if (closeToNext && newValue > totalDrag){
        newValue = totalDrag;
      }
      this.setState({
        drag: sign*newValue
      });
    }, 10);
  }
  componentWillReceiveProps(){
    this.setState({drag: 0});
  }
  render(){
    return <div className={`touch-pager ${this.props.modifier ? 'touch-pager--' + this.props.modifier : ''}`}
     ref="main" onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd}>
      <div className="touch-pager__current-page" ref="centerContainer">{this.props.children}</div>
      <div className="touch-pager__prev-page" style={{position: "absolute", top: 0, height: "100%", right: "100%", width: "100%", transform: `translateX(${this.state.drag}px)`}}>{this.props.prev}</div>
      <div className="touch-pager__next-page" style={{position: "absolute", top: 0, height: "100%", left: "100%", width: "100%", transform: `translateX(${this.state.drag}px)`}}>{this.props.next}</div>
    </div>
  }
  
}