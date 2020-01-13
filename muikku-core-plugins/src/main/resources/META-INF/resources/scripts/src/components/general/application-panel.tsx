import * as React from 'react';
import Tabs, {TabType} from '~/components/general/tabs';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';


// This is the deprecated application panel

interface ApplicationPanelProps {
  modifier: string,
  title?: React.ReactElement<any> | string,
  icon?: React.ReactElement<any> | string,
  panelTabs?: Array<TabType>
  onTabChange?:(id: string)=>any,
  activeTab? : string;
  primaryOption?: React.ReactElement<any>,
  toolbar?: React.ReactElement<any>,
  asideBefore?: React.ReactElement<any>,   
  asideAfter?: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>,
  disableStickyScrolling?: boolean
}

interface ApplicationPanelState {
  sticky: boolean,
  remainingHeight: number,
  stickyHeight: number,
  offsetElementAgainstTop: number,
  extraPaddingLeft: number,
  extraPaddingRight: number,
  asideBeforeWidth: number
  asideAfterWidth: number
}


export default class ApplicationPanel extends React.Component<ApplicationPanelProps, ApplicationPanelState> {
  private offsetElementAgainstTop:number;
  private offsetStickyElementTop: number;
  private offsetBorderAgainstBottom: number;
  private stickyHeight: number;
  private extraPaddingLeft: number;
  private extraPaddingRight: number;
  private asideBeforeWidth: number;
  private asideAfterWidth: number;
  private borderWidth: number;
  private disabled: boolean;
  
  constructor(props: ApplicationPanelProps){
    super(props);
    
    this.state = {
      sticky: false,
      remainingHeight: null,
      stickyHeight: null,
      offsetElementAgainstTop: null,
      extraPaddingLeft: null,
      extraPaddingRight: null,
      asideBeforeWidth: null,
      asideAfterWidth: null
    }
    
    this.onScroll = this.onScroll.bind(this);
    this.calculate = this.calculate.bind(this);
    this.calculateSides = this.calculateSides.bind(this);
  }

  componentDidMount(){
    this.calculate();
    if (!this.disabled){
      window.addEventListener("scroll", this.onScroll);
      window.addEventListener("resize", this.calculateSides);
    }
  }

  calculateSides(){
    this.extraPaddingLeft = (this.refs["body"] as HTMLElement).getBoundingClientRect().left + this.borderWidth;
    
    let root:Element = document.querySelector("#root");
    this.extraPaddingRight = root.getBoundingClientRect().width - 
      ((this.refs["body"] as HTMLElement).getBoundingClientRect().width + this.extraPaddingLeft) + (this.borderWidth*2);
    
    this.setState({
      extraPaddingLeft: this.extraPaddingLeft,
      extraPaddingRight: this.extraPaddingRight
    });
  }

  calculate(){
    this.disabled = this.props.disableStickyScrolling;
    if (this.disabled){
      return;
    }
    let computedStyle = document.defaultView.getComputedStyle(this.refs["sticky"] as HTMLElement);
    if (computedStyle.getPropertyValue("position") === "fixed"){
      this.disabled = true;
      return;
    }
    //Sticky height represents the height of the sticky thing on top
    this.stickyHeight = parseInt(computedStyle.getPropertyValue("height"));
    this.setState({
      stickyHeight: this.stickyHeight
    });
    //offset top represents the amount of offset that the sticky has to the top of the screen
    this.offsetStickyElementTop = (this.refs["sticky"] as HTMLElement).offsetTop;
    //We take the element that is supposed to stick to
    let element:Element = document.querySelector("#stick");
    if (!element){
      this.offsetElementAgainstTop = 0;
    } else {
      let stickyElementComputedStyle = document.defaultView.getComputedStyle(element);
      //this one represents the navbar basically the amount of pixels to the bottom
      this.offsetElementAgainstTop = parseInt(stickyElementComputedStyle.getPropertyValue("height"));
    }
    //So we save that here
    this.setState({
      offsetElementAgainstTop: this.offsetElementAgainstTop
    })
    
    let panelComputedStyle = document.defaultView.getComputedStyle(this.refs["panel"] as HTMLElement);
    this.offsetBorderAgainstBottom = parseInt(panelComputedStyle.getPropertyValue("padding-bottom"));
    
    let asideBefore:HTMLElement = (this.refs["asideBefore"] as HTMLElement);
    if (asideBefore){
      this.asideBeforeWidth = asideBefore.offsetWidth;
      this.setState({
        asideBeforeWidth: this.asideBeforeWidth
      });
    }
    
    let asideAfter:HTMLElement = (this.refs["asideAfter"] as HTMLElement);
    if (asideAfter){
      this.asideAfterWidth = asideAfter.offsetWidth;
      this.setState({
        asideAfterWidth: this.asideAfterWidth
      });
    }
    
    this.borderWidth = parseInt(document.defaultView.getComputedStyle(this.refs["body"] as HTMLElement).getPropertyValue("border-left-width"));
    
    this.calculateSides();
    this.setRemainingHeight(false);
  }

  componentWillUnmount(){
    if (!this.disabled){
      window.removeEventListener("scroll", this.onScroll);
      window.removeEventListener("resize", this.calculateSides);
    }
  }

  setRemainingHeight(isSticky: boolean){
    if (!this.props.asideBefore && !this.props.asideAfter){
     return;
    }
    let top = (document.documentElement.scrollTop || document.body.scrollTop);
    let height = document.documentElement.offsetHeight;
    let scrollHeight = document.documentElement.scrollHeight;
    let offsetTopHeight = isSticky ? 
      this.offsetElementAgainstTop + (this.refs["sticky"] as HTMLElement).offsetHeight : 
      (this.refs["sticky"] as HTMLElement).offsetHeight + (this.refs["sticky"] as HTMLElement).offsetTop - top;
    let bottom = Math.round(scrollHeight - top) - height;
    let borderBottomSize = this.offsetBorderAgainstBottom - bottom + this.borderWidth;
    if (borderBottomSize < 0){
      borderBottomSize = 0;
    }
    let remainingUsableWindow = height - offsetTopHeight - borderBottomSize;

    this.setState({remainingHeight: remainingUsableWindow});
  }
  onScroll(e: Event){
    let top = (document.documentElement.scrollTop || document.body.scrollTop);
    let diff = this.offsetStickyElementTop - top;
    let isSticky = (diff < this.offsetElementAgainstTop);
    if (isSticky !== this.state.sticky){
      this.setState({sticky: isSticky});

      if (isSticky){
        this.calculateSides();
      }
    }

    this.setRemainingHeight(isSticky);
  }
  getToolbar(): HTMLDivElement{
    return this.refs["toolbar"] as HTMLDivElement;
  }
  render(){
    return (
      <div className={`application-panel application-panel--${this.props.modifier}`} ref="panel">
        <div className="application-panel__container">
          <div className="application-panel__header">
            {this.props.title ? 
              <h1 className="application-panel__header-title">{this.props.title}</h1>
            : null}
            {this.props.icon ? 
              <div className="application-panel__header-actions">{this.props.icon}</div>
            : null}
          </div>
          <div className="application-panel__body" ref="body">
            <div style={{display: this.state.sticky ? "block" : "none", height: this.state.stickyHeight}}></div>
            <div className="application-panel__actions" ref="sticky" style={this.state.sticky ? {
                 position: "fixed",
                 top: this.state.offsetElementAgainstTop,
                 left: this.state.extraPaddingLeft,
                 right: this.state.extraPaddingRight
               } : null}>
              {this.props.primaryOption ? <div className="application-panel__helper-container application-panel__helper-container--main-action">{this.props.primaryOption}</div> : null}
              {this.props.toolbar ? <div ref="toolbar" className="application-panel__main-container application-panel__main-container--actions">{this.props.toolbar}</div> : null}
            </div>
            <div className="application-panel__content" style={this.state.sticky ? {paddingLeft: this.state.asideBeforeWidth, paddingRight: this.state.asideAfterWidth} : null}>
              {this.props.asideBefore ? <div className="application-panel__helper-container" ref="asideBefore" style={{
                 position: this.state.sticky ? "fixed" : null,
                 top: this.state.sticky ? this.state.offsetElementAgainstTop + this.state.stickyHeight : null,
                 left: this.state.sticky ? this.state.extraPaddingLeft : null,
                 height: this.state.remainingHeight,
                 width: this.state.sticky ? this.state.asideBeforeWidth : null,
                 overflowY: "auto"
               }}>{this.props.asideBefore}</div> : null}
              <div className={`application-panel__main-container loader-empty`}>{this.props.children}</div>
              {this.props.asideAfter ? <div className="application-panel__helper-container" ref="asideAfter" style={{
                  position: this.state.sticky ? "fixed" : null,
                  top: this.state.sticky ? this.state.offsetElementAgainstTop + this.state.stickyHeight : null,
                  right: this.state.sticky ? this.state.extraPaddingRight : null,
                  height: this.state.remainingHeight,
                  width: this.state.sticky ? this.state.asideAfterWidth : null,
                  overflowY: "auto"
                }}>{this.props.asideAfter}</div> : null}
            </div>
            {this.props.panelTabs ? <Tabs tabs={this.props.panelTabs} onTabChange={this.props.onTabChange} activeTab={this.props.activeTab} /> : 
              <div className="application-panel__body" ref="body">
                <div style={{display: this.state.sticky ? "block" : "none", height: this.state.stickyHeight}}></div>
                <div className="application-panel__actions" ref="sticky" style={this.state.sticky ? {
                     position: "fixed",
                     top: this.state.offsetElementAgainstTop,
                     left: this.state.extraPaddingLeft,
                     right: this.state.extraPaddingRight
                   } : null}>
                  {this.props.primaryOption ? <div className="application-panel__helper-container application-panel__helper-container--main-action">{this.props.primaryOption}</div> : null}
                  {this.props.toolbar ? <div className="application-panel__main-container application-panel__main-container--actions">{this.props.toolbar}</div> : null}
                </div>
                <div className="application-panel__content" style={this.state.sticky ? {paddingLeft: this.state.asideBeforeWidth} : null}>
                  {this.props.asideBefore ? <div className="application-panel__helper-container" ref="asideBefore" style={{
                     position: this.state.sticky ? "fixed" : null,
                     top: this.state.sticky ? this.state.offsetElementAgainstTop + this.state.stickyHeight : null,
                     left: this.state.sticky ? this.state.extraPaddingLeft : null,
                     height: this.state.remainingHeight,
                     width: this.state.sticky ? this.state.asideBeforeWidth : null,
                     overflowY: "auto"
                   }}>{this.props.asideBefore}</div> : null}
                  <div className={`application-panel__main-container loader-empty`}>{this.props.children}</div>
                  {this.props.asideAfter ? <div className="application-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.asideAfter}</div> : null}
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    );
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

interface ApplicationPanelToolbarActionsAsideProps {
  
}

interface ApplicationPanelToolbarActionsAsideState {
  
}

export class ApplicationPanelToolbarActionsAside extends React.Component<ApplicationPanelToolbarActionsAsideProps, ApplicationPanelToolbarActionsAsideState> {
  render(){
    return <div className="application-panel__toolbar-actions-aside">{this.props.children}</div>
  }
}

interface ApplicationPanelToolsContainerProps {
  
}

interface ApplicationPanelToolsContainerState {
  
}

export class ApplicationPanelToolsContainer extends React.Component<ApplicationPanelToolsContainerProps, ApplicationPanelToolsContainerState>{
  render(){
    return <div className="application-panel__tools-container">{this.props.children}</div>
  }
}