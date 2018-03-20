import * as React from 'react';

import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';

interface ApplicationPanelProps {
  modifier: string,
  title?: React.ReactElement<any> | string,
  icon?: React.ReactElement<any> | string,
  primaryOption?: React.ReactElement<any>,
  toolbar?: React.ReactElement<any>,
  asideBefore?: React.ReactElement<any>,   
  asideAfter?: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>,
}

//{this.props.asideBefore ? <div className="application-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.aside}</div> : null}
//{this.props.asideAfter ? <div className="application-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.aside}</div> : null}

interface ApplicationPanelState {
  sticky: boolean,
  remainingHeight: number,
  stickyHeight: number,
  offsetElementAgainstTop: number,
  extraPaddingLeft: number,
  extraPaddingRight: number
}

export default class ApplicationPanel extends React.Component<ApplicationPanelProps, ApplicationPanelState> {
  private offsetElementAgainstTop:number;
  private offsetStickyElementTop: number;
  private offsetBorderAgainstBottom: number;
  private stickyHeight: number;
  private extraPaddingLeft: number;
  private extraPaddingRight: number;
  private disabled: boolean;
  
  constructor(props: ApplicationPanelProps){
    super(props);
    
    this.state = {
      sticky: false,
      remainingHeight: null,
      stickyHeight: null,
      offsetElementAgainstTop: null,
      extraPaddingLeft: null,
      extraPaddingRight: null
    }
    
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount(){
    let computedStyle = document.defaultView.getComputedStyle(this.refs["sticky"] as HTMLElement);
    if (computedStyle.getPropertyValue("position") === "fixed"){
      this.disabled = true;
      return;
    }
    this.stickyHeight = parseInt(computedStyle.getPropertyValue("height"));
    this.setState({
      stickyHeight: this.stickyHeight
    });
    
    this.offsetStickyElementTop = (this.refs["sticky"] as HTMLElement).offsetTop;
    
    let element:Element = document.querySelector("#stick");
    if (!element){
      this.offsetElementAgainstTop = 0;
    } else {
      let stickyElementComputedStyle = document.defaultView.getComputedStyle(element);
      this.offsetElementAgainstTop = parseInt(stickyElementComputedStyle.getPropertyValue("height"));
    }
    
    this.setState({
      offsetElementAgainstTop: this.offsetElementAgainstTop
    })
    
    this.extraPaddingLeft = (this.refs["sticky"] as HTMLElement).getBoundingClientRect().left;
    
    let root:Element = document.querySelector("#root");
    if (!element){
      this.extraPaddingRight = this.extraPaddingLeft;
    } else {
      this.extraPaddingRight = root.getBoundingClientRect().width - 
        ((this.refs["sticky"] as HTMLElement).getBoundingClientRect().width + this.extraPaddingLeft);
    }
    
    this.setState({
      extraPaddingLeft: this.extraPaddingLeft,
      extraPaddingRight: this.extraPaddingRight
    });
    
    let panelComputedStyle = document.defaultView.getComputedStyle(this.refs["panel"] as HTMLElement);
    this.offsetBorderAgainstBottom = parseInt(panelComputedStyle.getPropertyValue("padding-bottom"));
    
    window.addEventListener("scroll", this.onScroll);
    
    this.setRemainingHeight();
  }
  componentWillUnmount(){
    if (!this.disabled){
      window.removeEventListener("scroll", this.onScroll);
    }
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
    let top = (document.documentElement.scrollTop || document.body.scrollTop);
    let diff = this.offsetStickyElementTop - top;
    let isSticky = (diff < this.offsetElementAgainstTop);
    if (isSticky !== this.state.sticky){
      this.setState({sticky: isSticky});
    }
    this.setRemainingHeight();
  }
  render(){
    return (        
    <div className={`application-panel application-panel--${this.props.modifier}`} ref="panel">
      <div className="application-panel__container">                
        
        <div className="application-panel__header">
        {this.props.title ? 
          <div className="application-panel__header-title">{this.props.title}</div>
        : null}
        {this.props.icon ? 
          <div className="application-panel__header-actions">{this.props.icon}</div>
        : null}
        </div>
        <div className="application-panel__body">
         <div style={{display: this.state.sticky ? "block" : "none", height: this.state.stickyHeight}}></div>
          <div className="application-panel__actions" ref="sticky" style={this.state.sticky ? {
               position: "fixed",
               top: this.state.offsetElementAgainstTop,
               left: this.state.extraPaddingLeft,
               right: this.state.extraPaddingRight
             } : null}>
            {this.props.primaryOption ? <div className="application-panel__helper-container application-panel__helper-container--main-action">{this.props.primaryOption}</div> : null}
            <div className="application-panel__main-container application-panel__main-container--actions">{this.props.toolbar}</div>
          </div>
          <div className="application-panel__content">
            {this.props.asideBefore ? <div className="application-panel__helper-container" style={{
               height: this.state.remainingHeight
             }}>{this.props.asideBefore}</div> : null}
            <div className={`application-panel__main-container loader-empty`}>{this.props.children}</div>
            {this.props.asideAfter ? <div className="application-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.asideAfter}</div> : null}
          </div>
        </div>
      </div>
    </div>);
  }
}

interface ApplicationPanelToolbarProps {
  
}

interface ApplicationPanelToolbarState {
  
}

export class ApplicationPanelToolbar extends React.Component<ApplicationPanelToolbarProps, ApplicationPanelToolbarState> {
  render(){
    return <div className="application-panel__toolbar">{this.props.children}</div>
  }
}

interface ApplicationPanelToolbarActionsMainProps {
  
}

interface ApplicationPanelToolbarActionsMainState {
  
}

export class ApplicationPanelToolbarActionsMain extends React.Component<ApplicationPanelToolbarActionsMainProps, ApplicationPanelToolbarActionsMainState> {
  render(){
    return <div className="application-panel__toolbar-actions-main">{this.props.children}</div>
  }
}
