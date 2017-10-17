import * as React from 'react';

import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';

interface ApplicationPanelProps {
  modifier: string,
  title: React.ReactElement<any> | string,
  icon?: React.ReactElement<any> | string,
  primaryOption: React.ReactElement<any>,
  toolbar: React.ReactElement<any>,
  aside?: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>
}

interface ApplicationPanelState {
  sticky: boolean,
  remainingHeight: number
}

export default class ApplicationPanel extends React.Component<ApplicationPanelProps, ApplicationPanelState> {
  private offsetTop:number;
  
  constructor(props: ApplicationPanelProps){
    super(props);
    
    this.state = {
      sticky: false,
      remainingHeight: null
    }
    
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount(){
    window.addEventListener("scroll", this.onScroll);
    this.offsetTop = (this.refs["scrollReference"] as HTMLElement).offsetTop;
    this.setRemainingHeight();
  }
  componentWillUnmount(){
    window.removeEventListener("scroll", this.onScroll);
  }
  setRemainingHeight(){
    if (!this.props.aside){
      return;
    }
    let top = (document.documentElement.scrollTop || document.body.scrollTop);
    let height = (document.documentElement.offsetHeight || document.body.offsetHeight);
    let diff = this.offsetTop - top;
    let nDiff = (diff < 70);
    
    if (!nDiff){
      let height = (document.documentElement.offsetHeight || document.body.offsetHeight);
      //sticky thing height 55
      //navbar height 70
      //other tooblar thingy height 54
      let nRemainingHeight = height - 55 - 70 - 54 + top;
      console.log(nRemainingHeight);
      this.setState({remainingHeight: nRemainingHeight});
    } else {
      this.setState({remainingHeight: null});
    }
  }
  onScroll(e: Event){
    let top = (document.documentElement.scrollTop || document.body.scrollTop);
    let diff = this.offsetTop - top;
    let nDiff = (diff < 70);
    if (nDiff !== this.state.sticky){
      this.setState({sticky: nDiff});
    }
    this.setRemainingHeight();
  }
  render(){
    return (<div className={`application-panel application-panel--${this.props.modifier} ${this.state.sticky ? "application-panel--sticky" : ''}`}>
      <div className="application-panel__container">                
        <div className="application-panel__header">
          <div className="application-panel__header__wrapper">
            <div className="application-panel__helper-container">{this.props.title}</div>
            <div className="application-panel__main-container">{this.props.icon}</div>
          </div>
        </div>          
        <div className="application-panel__body">
          <div className="application-panel__actions" ref="scrollReference">
            <div className="application-panel__actions__wrapper">
              <div className="application-panel__helper-container">{this.props.primaryOption}</div>
              <div className="application-panel__main-container">{this.props.toolbar}</div>
            </div>
          </div>
          <div ref="damn" className="application-panel__content">
            <div className="application-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.aside}</div>
            <div className="application-panel__main-container loader-empty">{this.props.children}</div>
          </div>
        </div>
      </div>
    </div>);
  }
}

