import * as React from 'react';

import '~/sass/elements/reading-panel.scss';
import '~/sass/elements/loaders.scss';

interface ReadingPanelProps {
  modifier: string,
  title?: React.ReactElement<any> | string,
  icon?: React.ReactElement<any> | string,
  primaryOption?: React.ReactElement<any>,
  toolbar?: React.ReactElement<any>,
  asideBefore?: React.ReactElement<any>,   
  asideAfter?: React.ReactElement<any>,
  aside?: React.ReactElement<any>,      
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>,
}

//{this.props.asideBefore ? <div className="reading-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.aside}</div> : null}
//{this.props.asideAfter ? <div className="reading-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.aside}</div> : null}

interface ReadingPanelState {
  sticky: boolean,
  remainingHeight: number
}

export default class ReadingPanel extends React.Component<ReadingPanelProps, ReadingPanelState> {
  private maxTop:number;
  private stickyHeight:number;
  
  constructor(props: ReadingPanelProps){
    super(props);
    
    this.state = {
      sticky: false,
      remainingHeight: null
    }
    
    this.maxTop = null;
    this.stickyHeight = null;
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount(){
    window.addEventListener("scroll", this.onScroll);
    this.maxTop = (this.refs["top-reference"] as HTMLElement).offsetTop;
    
//    let computedStyle = document.defaultView.getComputedStyle(this.refs["sticky"] as HTMLElement);
//    this.stickyHeight = (this.refs["sticky"] as HTMLElement).offsetTop +
//        parseInt(computedStyle.getPropertyValue("border-top")) + parseInt(computedStyle.getPropertyValue("border-top"))
//    this.setRemainingHeight();
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.onScroll);
  }
  setRemainingHeight(){
//    if (!this.props.aside){
//      return;
//    }
//    let top = (document.documentElement.scrollTop || document.body.scrollTop);
//    let height = (document.documentElement.offsetHeight || document.body.offsetHeight);
//    
//    if (top > 70){
//      let height = (document.documentElement.offsetHeight || document.body.offsetHeight);
//      //sticky thing height 55
//      //navbar height 70
//      //other tooblar thingy height 54
//      let nRemainingHeight = height - 55 - 70 - 54 + top;
//      console.log(nRemainingHeight);
//      this.setState({remainingHeight: nRemainingHeight});
//    } else {
//      this.setState({remainingHeight: null});
//    }
  }
  onScroll(e: Event){
//    let top = (document.documentElement.scrollTop || document.body.scrollTop);
//    let diff = this.offsetTop - top;
//    let nDiff = (diff < 70);
//    if (nDiff !== this.state.sticky){
//      this.setState({sticky: nDiff});
//    }
//    this.setRemainingHeight();
  }
  render(){
    return (        
    <div className={`reading-panel reading-panel--${this.props.modifier}`} ref="top-reference">
      <div className="reading-panel__container">                
        
        <div className="reading-panel__header">
        {this.props.title ? 
          <div className="reading-panel__header-title">{this.props.title}</div>
        : null}
        {this.props.icon ? 
          <div className="reading-panel__header-actions">{this.props.icon}</div>
        : null}
        </div>
        <div className="reading-panel__body">
          <div style={{display: this.state.sticky ? "block" : "none"}}></div>          
         {this.props.toolbar ?
          <div className="reading-panel__actions" ref="sticky">
            {this.props.primaryOption ? <div className="reading-panel__helper-container reading-panel__helper-container--main-action">{this.props.primaryOption}</div> : null}
            <div className="reading-panel__main-container reading-panel__main-container--actions">{this.props.toolbar}</div>
          </div> : null}             
          <div ref="damn" className="reading-panel__content">
            {this.props.asideBefore ? <div className="reading-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.asideBefore}</div> : null}
            <div className={`reading-panel__main-container loader-empty`}>{this.props.children}</div>
            {this.props.asideAfter ? <div className="reading-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.asideAfter}</div> : null}
          </div>
        </div>
      </div>
    </div>);
  }
}

